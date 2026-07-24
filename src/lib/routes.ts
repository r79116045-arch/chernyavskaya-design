/**
 * Одна точка правды: на каких страницах форма заявки есть прямо на странице.
 * Кнопка «Написать» скроллит к #zayavka, если форма тут, иначе ведёт на /kontakty.
 * Так якорь не «перезагружает» страницу и нигде не ведёт в пустоту.
 */
export const PAGES_WITH_FORM = ["/", "/uslugi", "/portfolio", "/kontakty"];

export function hasForm(pathname: string): boolean {
  const p = pathname.replace(/\/$/, "") || "/";
  return PAGES_WITH_FORM.includes(p) || p.startsWith("/portfolio/");
}

export function formHref(pathname: string): string {
  return hasForm(pathname) ? "#zayavka" : "/kontakty/#zayavka";
}
