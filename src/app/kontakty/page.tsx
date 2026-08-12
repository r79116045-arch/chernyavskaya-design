import type { Metadata } from "next";
import { contacts, channels } from "@/lib/contacts";
import ChannelButtons from "@/components/ChannelButtons";

export const metadata: Metadata = {
  title: "Контакты — записаться на бесплатную консультацию",
  description:
    "Связаться с Дарьей Чернявской: Telegram, MAX или телефон. " +
    "Консультация и замер — бесплатно. Тюмень и вся Россия.",
};

const PROCESS = [
  { t: "Обсудим задачу", d: "Расскажете про объект и пожелания. Скажу, чем могу помочь и сколько это будет стоить." },
  { t: "Замер", d: "Приеду на объект, сниму размеры, посмотрю свет и несущие. Бесплатно, без обязательств." },
  { t: "Смета и сроки", d: "Пришлю расчёт по площади и план работ. Решение принимаете спокойно." },
];

export default function Kontakty() {
  return (
    <>
      {/* ── INTRO ── */}
      <section className="max-w-page mx-auto px-5 pt-20 pb-10">
        <p data-reveal className="caps-wide text-wine/80 mb-3">Связаться</p>
        <h1 data-reveal className="font-display text-h1 font-light">
          Контакты
        </h1>
        <div data-reveal className="mt-4 h-px w-12 bg-wine/50" />
        <p data-reveal className="font-body text-body text-graphite/75 mt-6 max-w-[38ch]">
          Тюмень · работаю по всей России. Отвечаю лично, обычно в течение дня.
        </p>
      </section>

      {/* ── ПРОЦЕСС ── */}
      <section className="bg-ivory-dark/30">
        <div className="max-w-page mx-auto px-5 py-16">
          <p data-reveal className="caps-wide text-wine/80 mb-2">Как это работает</p>
          <h2 data-reveal className="font-display text-h2 mb-8">
            Первый разговор
          </h2>
          <div className="max-w-[38rem]">
            <div className="space-y-0">
              {PROCESS.map((s, i) => (
                <div key={s.t} data-reveal
                  className="flex gap-5 items-baseline py-5 border-b border-graphite/8 last:border-b-0 group">
                  <span className="font-display text-h2 font-light text-wine tabular-nums leading-none shrink-0 w-10 text-right">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-card font-medium">{s.t}</h3>
                    <p className="font-body text-ui text-graphite/70 mt-1">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── КАНАЛЫ СВЯЗИ ── */}
      <section className="max-w-page mx-auto px-5 py-16">
        <p data-reveal className="caps-wide text-wine/80 mb-2">Напрямую</p>
        <h2 data-reveal className="font-display text-h2 mb-8">
          Пишите и звоните
        </h2>

        <div data-reveal className="max-w-[34rem]">
          <p className="font-body text-body text-graphite/75 mb-6">
            Удобнее голосом или в мессенджере? Выбирайте любой канал — отвечаю лично.
          </p>

          <div className="space-y-5">
            {contacts.phoneRaw && (
              <p className="font-display text-h3 font-light text-graphite/85">
                {contacts.phoneHuman}
              </p>
            )}
            <ChannelButtons items={channels("Здравствуйте! Пишу с сайта.")} />
          </div>

          <p className="mt-12 pt-6 border-t border-graphite/10 font-ui text-micro text-graphite/60">
            Дарья Чернявская · самозанятая · Тюмень
            <br />
            Реквизиты для договора — по запросу
          </p>
        </div>
      </section>
    </>
  );
}
