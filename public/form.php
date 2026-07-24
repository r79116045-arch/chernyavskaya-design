<?php
/**
 * Обработчик заявок сайта Дарьи Чернявской (статика + PHP, схема Бытовки72).
 * Принимает JSON POST от LeadForm и шлёт заявку в Telegram (+ почта-дубль).
 *
 * ГЛАВНОЕ ПРАВИЛО: заявка НИКОГДА не теряется молча.
 * Ловушка для ботов и слишком быстрая отправка НЕ отбрасывают сообщение, а помечают его —
 * решает человек. (Браузеры автозаполняют скрытые поля; молчаливый отсев съедал бы
 * оплаченных клиентов из Яндекс.Директа.)
 *
 * Настройки — рядом в form.config.php (в git не кладём), см. form.config.example.php.
 */

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не поддерживается']);
    exit;
}

$raw  = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['error' => 'Неверный формат запроса']);
    exit;
}

// ── Контакт: телефон, ник в мессенджере или почта — на выбор посетителя.
// Телефон нормализуем к +7…, остальное принимаем как есть (лишь бы было содержимое).
$contact = isset($body['contact']) ? trim((string) $body['contact']) : '';
if ($contact === '' && isset($body['phone'])) {
    $contact = trim((string) $body['phone']); // совместимость со старой формой
}
if (mb_strlen($contact) < 3) {
    http_response_code(400);
    echo json_encode(['error' => 'Укажите, как с вами связаться']);
    exit;
}
$digits = preg_replace('/\D/', '', $contact);
$isPhone = strlen($digits) >= 10 && !preg_match('/[a-zA-Zа-яА-Я@]/u', $contact);
if ($isPhone) {
    if (strlen($digits) === 10) {
        $digits = '7' . $digits;
    }
    $contact = '+' . $digits;
}

// ── Согласие на обработку ПДн (152-ФЗ): без него заявку не принимаем.
if (empty($body['consent'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Нужно согласие на обработку персональных данных']);
    exit;
}

$note    = isset($body['note']) ? trim((string) $body['note']) : '';
$source  = isset($body['source']) ? trim((string) $body['source']) : 'сайт';
$context = isset($body['context']) ? trim((string) $body['context']) : '';
$policy  = isset($body['policy_version']) ? trim((string) $body['policy_version']) : '?';
$consentV = isset($body['consent_version']) ? trim((string) $body['consent_version']) : '?';
$consentT = isset($body['consent_text']) ? trim((string) $body['consent_text']) : '';
$elapsed = isset($body['elapsed']) ? (int) $body['elapsed'] : -1;

// ── Подозрения (НЕ отсев, только пометка в сообщении).
$flags = [];
if (!empty($body['honeypot'])) {
    $flags[] = 'скрытое поле заполнено';
}
if ($elapsed >= 0 && $elapsed < 2) {
    $flags[] = 'отправлено за ' . $elapsed . ' с';
}

$config = @include __DIR__ . '/form.config.php';
if (!is_array($config)) {
    $config = [];
}

$when  = (new DateTime('now', new DateTimeZone('Asia/Yekaterinburg')))->format('d.m.Y H:i');
$ip    = $_SERVER['REMOTE_ADDR'] ?? '?';
$ua    = substr($_SERVER['HTTP_USER_AGENT'] ?? '?', 0, 200);
$leadId = date('ymd-His') . '-' . substr(bin2hex(random_bytes(3)), 0, 4);

// ── ПОЛНЫЙ текст (почта на российском хостинге) — здесь контакт есть.
$full  = "Заявка с сайта (дизайн интерьера)\n";
$full .= "№ $leadId\n";
$full .= "Контакт: $contact\n";
if ($note !== '') {
    $full .= "Задача: $note\n";
}
if ($context !== '') {
    $full .= "Смотрел(а): проект «$context»\n";
}
$full .= "Страница: $source\nКогда: $when (Тюмень)\n";
$full .= "Согласие: да (согласие v$consentV, политика v$policy)";
if ($flags) {
    $full .= "\n⚠️ Подозрение на бота: " . implode(', ', $flags) . ". Проверьте перед ответом.";
}

// ── СИГНАЛ для Telegram — без персональных данных.
// Локализация (ч.5 ст.18 152-ФЗ): сами данные храним в РФ, мессенджер только уведомляет.
$signal  = "🔔 Новая заявка с сайта № $leadId\n";
$signal .= "Когда: $when (Тюмень)\n";
if ($context !== '') {
    $signal .= "Проект: «$context»\n";
}
$signal .= "Контакт — в почте и в журнале заявок на хостинге.";
if ($flags) {
    $signal .= "\n⚠️ Возможен бот: " . implode(', ', $flags);
}

// ── Журнал согласий вне вебрута (доказательство по 152-ФЗ; телефоны наружу не отдаём).
$logDir = __DIR__ . '/../.leads';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0700, true);
    @file_put_contents($logDir . '/.htaccess', "Require all denied\nDeny from all\n");
}
$line = json_encode([
    'id' => $leadId, 'ts' => $when, 'contact' => $contact, 'note' => $note,
    'consent' => true, 'consent_version' => $consentV, 'consent_text' => $consentT,
    'policy' => $policy, 'ip' => $ip, 'ua' => $ua, 'flags' => $flags, 'source' => $source,
], JSON_UNESCAPED_UNICODE);
@file_put_contents($logDir . '/leads.jsonl', $line . "\n", FILE_APPEND | LOCK_EX);
@chmod($logDir . '/leads.jsonl', 0600);

$sentTg   = false;
$sentMail = false;

// Telegram — основной канал Дарьи (в.41).
if (!empty($config['tg_token']) && !empty($config['tg_chat'])) {
    $url = 'https://api.telegram.org/bot' . $config['tg_token'] . '/sendMessage';
    $ctx = stream_context_create(['http' => [
        'method'        => 'POST',
        'header'        => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content'       => http_build_query(['chat_id' => $config['tg_chat'], 'text' => $signal]),
        'timeout'       => 8,
        'ignore_errors' => true,
    ]]);
    $sentTg = @file_get_contents($url, false, $ctx) !== false;
}

// Почта — дубль/резерв (отправитель обязан быть на домене сайта: SPF/DKIM).
if (!empty($config['to']) && !empty($config['from'])) {
    $headers  = 'From: ' . $config['from'] . "\r\n" . "Content-Type: text/plain; charset=utf-8\r\n";
    $sentMail = @mail($config['to'], 'Заявка с сайта № ' . $leadId, $full, $headers);
}

if (!$sentTg && !$sentMail) {
    // Заявка уже записана в журнал — её можно поднять руками.
    http_response_code(500);
    echo json_encode(['error' => 'Не удалось отправить заявку']);
    exit;
}

echo json_encode(['success' => true]);
