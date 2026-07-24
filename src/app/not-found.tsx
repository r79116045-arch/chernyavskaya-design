import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-page mx-auto px-5 py-28 text-center">
      <p className="font-display text-hero font-light leading-none">404</p>
      <p className="caps text-graphite/80 mt-4">такой страницы нет</p>
      <p className="font-body text-body text-graphite/80 mt-6 max-w-[46ch] mx-auto">
        Зато есть проекты, которые стоит посмотреть, — или напишите Дарье напрямую.
      </p>
      <div className="flex flex-wrap gap-3 justify-center mt-9">
        <Link href="/portfolio" className="btn btn-graphite">Смотреть портфолио</Link>
        <Link href="/kontakty#zayavka" className="btn btn-ghost-dark">Написать</Link>
      </div>
    </section>
  );
}
