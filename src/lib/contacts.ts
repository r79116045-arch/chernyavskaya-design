/**
 * Единственный источник контактов сайта.
 * ПРАВИЛО: пустое значение → кнопка/ссылка НЕ рендерится.
 */

export const contacts = {
  /** Только цифры с 7: "79XXXXXXXXX". Пусто — кнопок звонка нет. */
  phoneRaw: "79829196695",
  /** Как показываем человеку: "+7 (912) 345-67-89" */
  phoneHuman: "+7 (982) 919-66-95",
  /** Ник без @ ("daria_design") ИЛИ телефон в формате "+79...". Телефонный формат
      работает через t.me/+номер (решение Петра 23.07: у Дарьи TG привязан к номеру);
      когда Дарья пришлёт ник — заменить: ссылка с ником красивее и не зависит
      от её настройки «кто может найти меня по номеру». */
  telegram: "+79829196695",
  /** Персональная ссылка MAX целиком, как прислала Дарья.
      ⚠️ По НОМЕРУ ссылок в MAX НЕ СУЩЕСТВУЕТ (проверено 23.07, help.max.ru) —
      только ссылка профиля: в MAX «Поделиться профилем». Ждём от Дарьи. */
  maxUrl: "https://max.ru/u/f9LHodD0cOKKMKEWMIT4NUmOHrlYN-vlJTHWlq_5HOdjzBa8tuzvHFi2oHY",
  /** Почта Дарьи для прямых обращений */
  email: "ap1688@yandex.ru",
} as const;

export const tel = () => (contacts.phoneRaw ? `tel:+${contacts.phoneRaw}` : "");

/** Ссылка в Telegram с предзаполненным текстом (в tel: параметры не подставляем).
    Для телефонного формата (+7...) текст НЕ подставляем: t.me/+номер его не гарантирует. */
export const tgLink = (text?: string) =>
  contacts.telegram
    ? contacts.telegram.startsWith("+")
      ? `https://t.me/${contacts.telegram}`
      : `https://t.me/${contacts.telegram}${text ? `?text=${encodeURIComponent(text)}` : ""}`
    : "";

export const maxLink = () => contacts.maxUrl || "";

export type Channel = { kind: "tel" | "tg" | "max" | "copy"; label: string; href: string };

/** Живые каналы связи. context — что человек смотрел (уходит в текст сообщения). */
export function channels(context?: string): Channel[] {
  const hello = context
    ? `Здравствуйте! Смотрю проект «${context}» на сайте. Хочу обсудить свой интерьер.`
    : "Здравствуйте! Пишу с сайта — хочу обсудить свой интерьер.";
  const list: Channel[] = [];
  if (contacts.telegram) list.push({ kind: "tg", label: "Telegram", href: tgLink(hello) });
  if (contacts.maxUrl) list.push({ kind: "max", label: "MAX", href: maxLink() });
  if (contacts.phoneRaw) list.push({ kind: "copy", label: "Скопировать номер", href: contacts.phoneHuman });
  return list;
}

export const hasAnyContact = () =>
  Boolean(contacts.phoneRaw || contacts.telegram || contacts.maxUrl);
