# Проект: сайт Дарьи Чернявской (дизайн интерьера, Тюмень)

## Что это
Next.js 15 + Tailwind 3.4 + TS, статический экспорт (`output: "export"` → `out/`).
Дизайн = направление IV «Синтез» из мудбордов (`../мудборды/Мудборды-Дарья.html#v4`),
собранное из приёмов мирового топа (`../ТОП-МИРА-АНАЛИЗ.md`). Схема Бытовки72.

## Команды (pnpm = standalone ~/.local/share/pnpm, НЕ corepack — тот сломан)
- `pnpm dev` / `node_modules/.bin/next dev --port 3210` — dev-сервер
- `pnpm build` — статика в `out/`
- `node scripts/projects.mjs` — пересобрать портфолио из папок (сам запускается при dev/build)

## Портфолио — автоподхват
`public/images/projects/<slug>/` = проект: фото 01-…, 02-… (порядок по имени),
рядом `инфо.json` {title, area, year, city, type, desc, order, kind, hero, cover, featured, captions, kinds}.
`kind`: render|photo|plan (по умолч. render — у Дарьи почти всё авторские 3D). hero/cover/featured —
РАЗНЫЕ кадры под роли (герой ≠ флагман ≠ карточка). Сейчас 1 реальный проект `kvartira-s-arkami` (7 кадров).
`pnpm photos` → photo-fit.mjs (ресайз мастеров ≤2200 + деривативы 640/960/1280/1600/2200 в avif+webp+jpg → `_v/`),
затем projects.mjs пишет srcset в projects.json. Инструкция: КАК-ДОБАВИТЬ-ПРОЕКТ.md.

## ⭐ ЭТАЛОН-правки 14.07 (многоагентный разбор → ЭТАЛОН-ПЛАН.md, 29 правок)
Ключевое, что нельзя откатить:
- **contacts.ts** — единый источник контактов, пусто→кнопки НЕ рендерятся. Заполнить телефон/TG/MAX Дарьи.
- **LeadForm.tsx** — согласие ПДн (чекбокс, обязателен), ловушка nickname_alt (НЕ company! — старое поле
  браузер автозаполнял и заявка молча терялась), заявка не теряется (бот только помечается), контекст проекта.
- **form.php** — согласие обязательно, журнал согласий в `.leads/` ВНЕ вебрута; настройки form.config.php.
- **routes.ts** — formHref(): #zayavka если форма на странице, иначе /kontakty#zayavka.
- **Picture.tsx** — <picture> avif→webp→jpg, ОДИН priority-кадр на страницу; остальное lazy.
- **Lightbox.tsx** — галерея кейса на <dialog>, рендеры НЕ кадрируем.
- **StickyCta.tsx** — липкая мобильная панель, прячется когда форма в кадре.
- **PlasterReveal** — УБРАН с формы (мешал CTA) → полоса-разделитель h-200; на тач/saveData/слабом CPU
  canvas НЕ монтируется (CSS-фолбэк); rAF только в кадре; resize дебаунс по ширине.
- **globals.css** — --header-h (якоря), :focus-visible, hover только @media(hover), skip-link.
- Политика ПДн настоящая и индексируема (robots без Disallow); .htaccess (кэш/сжатие/AVIF MIME).
- Блокировано Дарьей/Петром: ВОПРОСЫ-ДАРЬЕ-для-эталона.md.

## Дизайн-система
Палитра: ivory #F7F3EB / graphite #26262A / wine #7E3B47 / choco #3E2C23 (~70/20/7/3).
Шрифты: Cormorant Garamond self-hosted (src/app/fonts, вариативный 300–500 + курсив), текст Georgia.
Служебные капсы: .caps / .caps-wide. Арки: .arch. Анимации: [data-reveal] (ScrollReveal), .kenburns.

## TODO до запуска
- [ ] материалы 5 проектов Дарьи → в папки, `инфо.json`; SVG-заглушки удалить
- [ ] фотопортрет? («может быть», в.28) — секцию «Обо мне» НЕ делаем (разделы по анкете: 3)
- [ ] номера Telegram/WhatsApp/MAX в LeadForm и Контакты (в.38, в.43)
- [x] form.php ✅ 10.07 — public/form.php (JSON+honeypot; Telegram-бот + почта-дубль),
      настройки на хостинге: скопировать form.config.example.php → form.config.php и заполнить
      (нужен ТГ-бот для заявок + чат Дарьи). LeadForm шлёт JSON с honeypot-полем company.
- [x] фишка «штукатурка» ✅ 10.07 — src/components/PlasterReveal.tsx, фон блока заявки на главной;
      режим mode="venetian" (генеративная венецианка: мрамор+золотые прожилки, порт из демо) — АКТИВЕН,
      mode="photo" (image=...) в запасе; след валика «рваный» (шубка), валик красится после 1-го мазка;
      без мыши/при reduced-motion слой рисуется сразу целиком; ⚠️ если след слабо читается вживую —
      подтемнить стену в buildWall на ступень
- [ ] псевдовидео панорамой по 3D-рендеру (облётов у визуализаторов НЕТ — ответ 09.07)
- [x] photo-fit ✅ 10.07 — scripts/photo-fit.mjs (sharp стоит): `pnpm photos` — ресайз ≤2200px,
      сжатие q82, EXIF-поворот, бэкап в _originals/, предупреждения о мелких (<1200px); svg не трогает
- [x] SEO-база ✅ 10.07 — JsonLd.tsx (ProfessionalService, Тюмень) + robots.txt (privacy закрыт)
- [ ] домен + metadataBase + sitemap + строка Sitemap в robots.txt; Метрика
- ℹ️ локальный предпросмотр: постоянный юнит ~/.config/systemd/user/daria-site-preview.service
  (enable --now, автозапуск при входе; после `pnpm build` обновляется сам — раздаёт out/)
- [ ] privacy: ИНН самозанятой, дата публикации

## Правила
- Деплой только после явного «да» Петра и Дарьи (пока — ТОЛЬКО локально)
- Общение на русском
