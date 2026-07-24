import type { Metadata } from "next";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Услуги и цены — дизайн интерьера от 2 500 ₽/м²",
  description:
    "Полный цикл дизайна интерьера в Тюмени: замер, планировки, 3D-визуализация, рабочий проект, " +
    "авторский надзор и комплектация. От 2 500 ₽/м², всё индивидуально.",
};

// Этапы — дословно из анкеты Дарьи (в.33), развёрнуты в понятные клиенту шаги.
const STEPS = [
  { n: "01", t: "Встреча", d: "Знакомимся, слушаю, как вы живёте и чего не хватает дому. Бесплатно." },
  { n: "02", t: "Замер", d: "Приезжаю на объект, снимаю точные размеры и особенности. Бесплатно." },
  { n: "03", t: "Планировки", d: "Варианты планировочных решений — выбираем то, в котором удобно жить." },
  { n: "04", t: "3D-визуализация", d: "Вы видите будущий интерьер до ремонта: свет, фактуры, мебель." },
  { n: "05", t: "Сборка проекта", d: "Рабочие чертежи и спецификации — всё, что нужно строителям." },
  { n: "06", t: "Ремонт", d: "Сопровождаю до результата: надзор, комплектация, решение вопросов." },
];

export default function Uslugi() {
  return (
    <>
      {/* ритм страниц: крупные блоки дышат одинаково — py-20, как на главной */}
      <section className="max-w-page mx-auto px-5 py-20">
        <h1 data-reveal className="font-display text-h1 font-light">
          Услуги и цены
        </h1>
        <p data-reveal className="caps text-graphite/80 mt-3">
          полный цикл · от 2 500 ₽/м² · всё индивидуально
        </p>

        <div data-reveal className="mt-10 max-w-[62ch]">
          <p className="font-body text-lead text-graphite/85">
            Квартиры, дома и коммерческие пространства — в Тюмени и по всей России.
            Работаю без шаблонных пакетов: состав проекта собирается под вашу задачу
            и бюджет. Цена — от 2 500 ₽ за м², точную назову после бесплатного замера.
          </p>
        </div>

        <h2 data-reveal className="font-display text-h2 mt-16 mb-8">
          Как идёт работа
        </h2>
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
          {STEPS.map((s) => (
            <div key={s.n} data-reveal className="flex gap-5">
              <span className="font-display italic text-wine text-h3 leading-none pt-1">{s.n}</span>
              <div>
                <h3 className="font-display text-h3 font-medium">{s.t}</h3>
                <p className="font-body text-body text-graphite/75 mt-1">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-page mx-auto px-5 pb-20">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 items-start">
          <div data-reveal>
            <LeadForm />
          </div>
          <p data-reveal className="font-body text-body text-graphite/80">
            Не уверены, с чего начать? Начните со встречи — это бесплатно и ни к
            чему не обязывает. Час разговора сэкономит месяцы ремонта.
          </p>
        </div>
      </section>
    </>
  );
}
