import type { Metadata } from "next";
import LeadForm from "@/components/LeadForm";
import { contacts, tel, channels, hasAnyContact } from "@/lib/contacts";
import ChannelButtons from "@/components/ChannelButtons";

export const metadata: Metadata = {
  title: "Контакты — записаться на бесплатную консультацию",
  description:
    "Связаться с Дарьей Чернявской: заявка на сайте, Telegram, MAX или телефон. " +
    "Консультация и замер — бесплатно. Тюмень и вся Россия.",
};

export default function Kontakty() {
  const hasMessenger = Boolean(contacts.telegram || contacts.maxUrl);

  return (
    // ритм страниц: крупные блоки дышат одинаково — py-20, как на главной
    <section className="max-w-page mx-auto px-5 py-20">
      <h1 data-reveal className="font-display text-h1 font-light">
        Контакты
      </h1>
      <p data-reveal className="caps text-graphite/70 mt-3 mb-10">
        Тюмень · работаю по всей России · отвечаю в течение дня
      </p>

      <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 items-start">
        <div data-reveal>
          <LeadForm />
        </div>
        <div data-reveal className="font-body text-body text-graphite/85">
          {/* Порядок колонки (решение Петра 23.07): СНАЧАЛА «как проходит первый разговор» —
              снимаем страх «а что будет, если я позвоню», ПОТОМ прямые каналы связи. */}
          <p className="caps text-graphite/70 mb-4">Как проходит первый разговор</p>
          <ol className="space-y-4">
            {[
              ["Созвон 15 минут", "Расскажете про объект и задачу. Я скажу, чем могу помочь и сколько это будет стоить."],
              ["Замер — бесплатно", "Приеду на объект, сниму размеры, посмотрю свет и несущие. Без обязательств."],
              ["Смета и сроки", "Пришлю расчёт по вашей площади и план работ. Решение принимаете спокойно."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3.5">
                <span className="font-display text-h3 text-wine/70 leading-none shrink-0 w-7">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-display text-card">{t}</span>
                  <span className="block font-ui text-ui text-graphite/80 mt-1">{d}</span>
                </span>
              </li>
            ))}
          </ol>

          {/* Прямые каналы — ПОСЛЕ процесса; текст обещает ровно те каналы, что заданы в contacts.ts */}
          <div className="mt-10 pt-8 border-t border-graphite/15">
            <p>
              {hasMessenger
                ? "Удобнее голосом или в мессенджере? Пишите и звоните напрямую — отвечаю лично, обычно в течение дня."
                : "Удобнее голосом? Звоните напрямую — отвечаю лично, обычно в течение дня."}
            </p>

            {/* Рендерятся только каналы, заданные в contacts.ts (нет значения — нет строки) */}
            <div className="mt-6 space-y-3">
              {contacts.phoneRaw && (
                <a href={tel()} className="block font-display text-h3 text-graphite hover:text-wine">
                  {contacts.phoneHuman}
                </a>
              )}
              {/* телефон написан строкой выше — тут только мессенджеры-иконки */}
              <ChannelButtons items={channels("Здравствуйте! Пишу с сайта.").filter((c) => c.kind !== "tel")} />
            </div>

            {!hasAnyContact() && (
              <p className="mt-6 font-ui text-ui text-graphite/75">
                {/* TODO(Дарья): телефон, ник Telegram, ссылка MAX → src/lib/contacts.ts */}
                Прямые контакты появятся здесь после запуска — пока оставьте заявку в форме слева.
              </p>
            )}
          </div>

          <p className="mt-8 pt-6 border-t border-graphite/15 font-ui text-micro text-graphite/80">
            Дарья Чернявская · самозанятая · Тюмень.
            <br />
            Реквизиты для договора предоставляю по запросу.
          </p>
        </div>
      </div>
    </section>
  );
}
