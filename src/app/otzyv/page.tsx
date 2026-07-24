import type { Metadata } from "next";
import OtzyvForm from "./OtzyvForm";

/**
 * Скрытая страница-ссылка для сбора отзывов (как zayavka.html у Бытовки72):
 * Дарья рассылает её прошлым клиентам, клиент пишет отзыв прямо тут.
 * В навигации страницы НЕТ, поисковикам — noindex.
 */
export const metadata: Metadata = {
  title: "Оставить отзыв — Дарья Чернявская",
  description: "Страница для отзыва о работе с Дарьей Чернявской.",
  robots: { index: false, follow: false },
};

export default function OtzyvPage() {
  return (
    <section className="max-w-page mx-auto px-5 py-20">
      <h1 data-reveal className="font-display text-h1 font-light">
        Спасибо, что нашли минутку!
      </h1>
      <p data-reveal className="font-body text-lead text-graphite/85 mt-5 max-w-[58ch]">
        Я собираю отзывы заказчиков, с которыми работала. Напишите пару фраз — что
        делали и что понравилось в работе. Это займёт две минуты, а мне очень поможет.
      </p>
      <div className="mt-10">
        <OtzyvForm />
      </div>
    </section>
  );
}
