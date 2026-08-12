import type { Metadata } from "next";
import ChannelButtons from "@/components/ChannelButtons";
import { channels } from "@/lib/contacts";

export const metadata: Metadata = {
  title: "Дизайн-проект от 2 500 ₽/м² — состав, этапы, цены",
  description:
    "Полный цикл дизайна интерьера в Тюмени: замер, планировки, 3D-визуализация, рабочий проект, " +
    "авторский надзор. От 2 500 ₽/м², всё индивидуально.",
};

const SOSTAV = [
  { t: "Планировки", d: "Проработка всех вариантов. Ищем оптимальное решение с учётом особенностей именно вашей семьи и вашего образа жизни." },
  { t: "3D-визуализации", d: "Фотореалистичные рендеры всех помещений. Видите свет, фактуры, цвет стен и мебель до начала ремонта." },
  { t: "Рабочие чертежи", d: "Полный комплект для строителей: планы стен, электрика, сантехника — всё, что нужно для точной реализации." },
  { t: "Спецификации", d: "Перечень материалов и оборудования с артикулами. Никаких «ну вы поняли» — подрядчик получает конкретные позиции." },
  { t: "Авторский надзор", d: "Регулярные выезды на объект. Проверяю, что строят по проекту, а не «как всегда». Решаю вопросы на месте." },
];

const STEPS = [
  { t: "Встреча", d: "Знакомимся, слушаю, как вы живёте и чего не хватает дому." },
  { t: "Замер", d: "Приезжаю на объект, снимаю точные размеры и особенности." },
  { t: "Планировки", d: "Варианты решений — выбираем то, в котором удобно жить." },
  { t: "3D-визуализация", d: "Вы видите будущий интерьер до ремонта: свет, фактуры, мебель." },
  { t: "Сборка проекта", d: "Рабочие чертежи и спецификации — всё для строителей." },
  { t: "Ремонт", d: "Сопровождаю до результата: надзор, комплектация, решение вопросов." },
];

function NumberedList({ items }: { items: { t: string; d: string }[] }) {
  return (
    <div className="space-y-0">
      {items.map((s, i) => (
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
  );
}

export default function Uslugi() {
  return (
    <>
      {/* ── INTRO ── */}
      <section className="max-w-page mx-auto px-5 pt-20 pb-10">
        <h1 data-reveal className="font-display text-h1 font-light">
          От идеи — до ключей
        </h1>
        <div data-reveal className="mt-4 h-px w-12 bg-wine/50" />
        <p data-reveal className="font-body text-body text-graphite/75 mt-6 max-w-[52ch]">
          Квартиры, дома и коммерческие пространства — в Тюмени и по всей России.
          Без шаблонных пакетов. <span className="text-graphite/90 font-medium">От 2 500 ₽ за м²</span>,
          точную цену называю после бесплатного замера.
        </p>
      </section>

      {/* ── ЧТО ВХОДИТ ── */}
      <section id="sostav" className="bg-ivory-dark/30 scroll-mt-[var(--header-h)]">
        <div className="max-w-page mx-auto px-5 py-16">
          <p data-reveal className="caps-wide text-wine/80 mb-2">Состав проекта</p>
          <h2 data-reveal className="font-display text-h2 mb-8">
            Что входит в дизайн-проект
          </h2>
          <div className="max-w-[44rem]">
            <NumberedList items={SOSTAV} />
          </div>
        </div>
      </section>

      {/* ── КАК ИДЁТ РАБОТА ── */}
      <section id="steps" className="scroll-mt-[var(--header-h)]">
        <div className="max-w-page mx-auto px-5 py-16">
          <p data-reveal className="caps-wide text-wine/80 mb-2">Процесс</p>
          <h2 data-reveal className="font-display text-h2 mb-8">
            Как идёт работа
          </h2>
          <div className="max-w-[44rem]">
            <NumberedList items={STEPS} />
          </div>
        </div>
      </section>

      {/* ── НАЧАТЬ ── */}
      <section id="start" className="bg-choco text-ivory scroll-mt-[var(--header-h)]">
        <div className="max-w-page mx-auto px-5 py-16 text-center">
          <p data-reveal className="caps-wide text-ivory/45 mb-2">Первый шаг</p>
          <h2 data-reveal className="font-display text-h2 mb-4">
            Готовы начать?
          </h2>
          <p data-reveal className="font-body text-body text-ivory/70 max-w-[42ch] mx-auto mb-8">
            Встреча и замер — бесплатно. Час разговора сэкономит месяцы ремонта.
          </p>
          <div data-reveal className="flex flex-wrap items-center justify-center gap-4">
            <ChannelButtons items={channels("Здравствуйте! Хочу обсудить дизайн-проект.")} />
          </div>
        </div>
      </section>
    </>
  );
}
