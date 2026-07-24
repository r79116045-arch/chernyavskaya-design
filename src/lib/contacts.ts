/**
 * Единственный источник контактов сайта.
 * ПРАВИЛО: пустое значение → кнопка/ссылка НЕ рендерится.
 * Лучше две рабочие кнопки, чем пять, ведущих в никуда.
 *
 * TODO(Дарья): телефон, ник Telegram, персональная ссылка MAX (в MAX: «поделиться профилем» —
 * прислать строку как есть, шаблон не угадываем). WhatsApp она не называла — кнопки нет.
 */

export const contacts = {
  /** Только цифры с 7: "79XXXXXXXXX". Пусто — кнопок звонка нет. */
  phoneRaw: "79829196695",
  /** Как показываем человеку: "+7 (912) 345-67-89" */
  phoneHuman: "+7 (982) 919-66-95",
  /** Ник без @: "daria_design" */
  telegram: "",
  /** Персональная ссылка MAX целиком, как прислала Дарья */
  maxUrl: "",
  /** Почта для юридических обращений (152-ФЗ: отзыв согласия) */
  email: "ap1688@yandex.ru",
} as const;

export const tel = () => (contacts.phoneRaw ? `tel:+${contacts.phoneRaw}` : "");

/** Ссылка в Telegram с предзаполненным текстом (в tel: параметры не подставляем) */
export const tgLink = (text?: string) =>
  contacts.telegram
    ? `https://t.me/${contacts.telegram}${text ? `?text=${encodeURIComponent(text)}` : ""}`
    : "";

export const maxLink = () => contacts.maxUrl || "";

export type Channel = { kind: "tel" | "tg" | "max"; label: string; href: string };

/** Живые каналы связи. context — что человек смотрел (уходит в текст сообщения). */
export function channels(context?: string): Channel[] {
  const hello = context
    ? `Здравствуйте! Смотрю проект «${context}» на сайте. Хочу обсудить свой интерьер.`
    : "Здравствуйте! Пишу с сайта — хочу обсудить свой интерьер.";
  const list: Channel[] = [];
  if (contacts.telegram) list.push({ kind: "tg", label: "Telegram", href: tgLink(hello) });
  if (contacts.maxUrl) list.push({ kind: "max", label: "MAX", href: maxLink() });
  if (contacts.phoneRaw) list.push({ kind: "tel", label: "Позвонить", href: tel() });
  return list;
}

export const hasAnyContact = () =>
  Boolean(contacts.phoneRaw || contacts.telegram || contacts.maxUrl);
