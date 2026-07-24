import type { Metadata } from "next";
import Link from "next/link";
import Picture from "@/components/Picture";
import LeadForm from "@/components/LeadForm";
import { projects, projectMeta, imageAlt } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Портфолио — дизайн интерьера в Тюмени",
  description:
    "Проекты Дарьи Чернявской: планировки, авторские 3D-визуализации и реализация. Квартиры, дома, коммерческие пространства.",
};

const single = projects.length === 1;

export default function Portfolio() {
  return (
    <>
      {/* ритм страниц: крупные блоки дышат одинаково — py-20, как на главной.
          max-w-page (не wide): карточка с подписью влезает в экран с воздухом,
          «чуть меньше, чтоб изящно» (Пётр 23.07) */}
      <section className="max-w-page mx-auto px-5 py-20">
        <h1 data-reveal className="font-display text-h1 font-light">
          Портфолио
        </h1>
        <p data-reveal className="caps text-graphite/70 mt-3">
          каждый проект — индивидуально
        </p>
        {/* Честно про 3D: у Дарьи почти нет фото реализаций, всё — авторские визуализации.
            Подаём это как метод, а не оправдание. */}
        <p data-reveal className="font-body text-body text-graphite/85 max-w-[62ch] mt-5">
          Показываю авторские 3D-визуализации: для меня рендер — не картинка, а техзадание
          подрядчику, по нему и ведутся работы. За 20 лет практики — десятки реализованных объектов.
        </p>

        <div className={`mt-10 grid gap-x-8 gap-y-14 ${single ? "" : "md:grid-cols-2"}`}>
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              href={`/portfolio/${p.slug}/`}
              className="group zoomable"
              data-reveal
            >
              <div
                className={`relative overflow-hidden ${single ? "aspect-[16/9]" : "aspect-[3/2]"} ${
                  i % 3 === 0 ? "arch" : "rounded-[18px]"
                } bg-ivory-dark`}
              >
                <Picture
                  image={p.cover}
                  alt={imageAlt(p, p.cover)}
                  sizes={
                    single
                      ? "(min-width:2500px) 2200px, (min-width:768px) 88vw, 100vw"
                      : "(min-width:2500px) 1050px, (min-width:768px) 44vw, 100vw"
                  }
                  priority={i === 0}
                  className="absolute inset-0"
                  imgClassName="w-full h-full"
                />
              </div>
              <div className="mt-4 flex justify-between items-baseline gap-3">
                <span className="font-display text-card font-medium">{p.title}</span>
                <span className="font-ui text-label text-graphite/70 whitespace-nowrap">{projectMeta(p)}</span>
              </div>
              {p.desc && (
                <p className="font-body text-ui text-graphite/75 mt-1.5 max-w-[60ch]">
                  {p.desc}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Портфолио — самая листаемая страница: форма нужна прямо здесь (и якорь для липкой панели) */}
      <section className="max-w-page mx-auto px-5 pb-20">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 items-start">
          <div data-reveal>
            <LeadForm />
          </div>
          <p data-reveal className="font-body text-body text-graphite/85">
            Понравился какой-то из проектов? Расскажите о своей квартире или доме — обсудим, как
            сделать похоже под вашу планировку и бюджет. Консультация и замер бесплатны.
          </p>
        </div>
      </section>
    </>
  );
}
