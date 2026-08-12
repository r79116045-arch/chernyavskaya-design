import Link from "next/link";
import { contacts, tel, tgLink } from "@/lib/contacts";

export default function Footer() {
  const year = 2026; // фиксируем: new Date() недоступен в статике на этапе рендера предсказуемо
  return (
    <footer className="border-t border-graphite/10 mt-2">
      <div className="max-w-page mx-auto px-5 pt-12 pb-8">
        {/* три колонки на одной базовой линии; каждая ссылка — своей строкой, фразы не рвутся */}
        <div className="grid gap-10 md:gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-card">Дарья Чернявская</p>
            <p className="font-ui text-micro text-graphite/75 mt-2 leading-relaxed">
              Дизайн интерьера · Тюмень и вся Россия
              <br />
              Самозанятая (налог на профессиональный доход)
            </p>
          </div>

          <div>
            <p className="caps text-graphite/70 mb-2.5">Связь</p>
            {contacts.phoneRaw && (
              <a href={tel()} className="block font-ui text-ui text-graphite hover:text-wine">
                {contacts.phoneHuman}
              </a>
            )}
            {contacts.telegram && (
              <a
                href={tgLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-ui text-micro text-graphite/80 hover:text-graphite mt-1.5"
              >
                Telegram
              </a>
            )}
            <p className="font-ui text-micro text-graphite/75 mt-1.5">Отвечаю в течение дня</p>
          </div>

          <div>
            <p className="caps text-graphite/70 mb-2.5">Разделы</p>
            <Link
              href="/portfolio/"
              className="block font-ui text-micro text-graphite/80 hover:text-graphite"
            >
              Портфолио
            </Link>
            <Link
              href="/uslugi/"
              className="block font-ui text-micro text-graphite/80 hover:text-graphite mt-1.5"
            >
              Услуги и цены
            </Link>
            <Link
              href="/kontakty/"
              className="block font-ui text-micro text-graphite/80 hover:text-graphite mt-1.5"
            >
              Контакты
            </Link>
          </div>
        </div>

        <p className="font-ui text-micro text-graphite/70 mt-10 pt-5 border-t border-graphite/10">
          © {year} · Дарья Чернявская · все права защищены
        </p>
      </div>
    </footer>
  );
}
