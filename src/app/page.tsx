import Link from "next/link";
import Picture from "@/components/Picture";
import PlasterReveal from "@/components/PlasterReveal";
import { projects, projectMeta, imageAlt, KIND_LABEL } from "@/lib/projects";
import { tgLink, channels } from "@/lib/contacts";
import ChannelButtons from "@/components/ChannelButtons";

/**
 * Главная по направлению IV «Синтез» (выбор Дарьи):
 * герой (гео+услуга) → слоган → флагман-кейс → сетка проектов → двери → полоса-штукатурка → заявка.
 */
export default function Home() {
  const featured = projects[0];
  // 3 ряда лучших (просьба Петра 23.07); за бортом только самый тонкий кейс
  // molodezhnyi (11 фото, тёмная обложка) — он остаётся в полном /portfolio
  const grid = projects.filter((p) => p.slug !== "molodezhnyi").slice(0, 9);
  const tg = tgLink("Здравствуйте! Пишу с сайта — хочу обсудить свой интерьер.");

  return (
    <>
      {/* ГЕРОЙ: гео+услуга в первом экране, LCP-текст без reveal.
          Высота = ровно остаток экрана под липкой шапкой: первый экран без обрезков. */}
      <section className="relative h-[calc(100svh-var(--header-h))] min-h-[520px] overflow-hidden">
        {featured && (
          <Picture
            image={featured.hero}
            alt={imageAlt(featured, featured.hero)}
            sizes="100vw"
            priority
            className="absolute inset-0"
            imgClassName="kenburns w-full h-full"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-graphite/30 via-[#1e1a18]/20 to-[#1e1a18]/70" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-page mx-auto px-5 pb-12 text-ivory">
            <p className="caps text-ivory/85 mb-4">Дизайн интерьера · Тюмень и вся Россия</p>
            <h1 className="font-display font-light text-hero leading-[1.04] max-w-[16ch]">
              Дом, где сложное стало простым
            </h1>
            <p className="mt-5 font-body text-lead text-ivory/90 max-w-[42ch]">
              Полный цикл — от замера до готового ремонта. 20 лет практики. Проекты от 2 500 ₽/м².
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/kontakty/" className="btn btn-wine">
                Записаться на бесплатный замер
              </Link>
              {tg && (
                <a href={tg} target="_blank" rel="noopener noreferrer" className="btn btn-ivory">
                  Написать в Telegram
                </a>
              )}
            </div>
          </div>
        </div>
        <a
          href="#slogan"
          aria-label="Листать вниз"
          className="scroll-arrow absolute left-1/2 bottom-3 text-ivory/75 font-ui text-lg"
        >
          ↓
        </a>
      </section>

      {/* СЛОГАН с курсивным акцентом */}
      {/* ритм главной: между всеми крупными блоками РАВНЫЙ зазор py-20 (просьба Петра 23.07
          «подровняй зазоры») — герой→слоган→флагман→проекты дышат одинаково */}
      <section
        id="slogan"
        className="max-w-page mx-auto px-5 py-20 text-center scroll-mt-[var(--header-h)]"
      >
        <p data-reveal className="font-display">
          <span className="block text-h1 tracking-[0.22em] leading-none">ПРОСТОТА</span>
          <em className="block text-wine text-h3 mt-3">высшая форма роскоши</em>
        </p>
        <p data-reveal className="caps text-graphite/70 mt-5">
          20 лет практики · полный цикл · всё индивидуально
        </p>
      </section>

      {/* ФЛАГМАН-КЕЙС во весь экран: имя проекта по центру */}
      {featured && (
        <Link href={`/portfolio/${featured.slug}/`} className="block group">
          <section className="px-4 md:px-6">
            {/* Кадр ЦЕЛИКОМ и максимально крупно: упирается в ширину экрана либо (через
                maxWidth = --frame-h × пропорция) в высоту, при которой фото видно целиком
                под липкой шапкой — не режется при скролле; место резервируется width/height */}
            <div
              className="relative mx-auto max-w-full overflow-hidden"
              style={
                featured.featured.w && featured.featured.h
                  ? { maxWidth: `calc(var(--frame-h) * ${(featured.featured.w / featured.featured.h).toFixed(4)})` }
                  : undefined
              }
            >
              <Picture
                image={featured.featured}
                alt={imageAlt(featured, featured.featured)}
                sizes="100vw"
                fit="none"
                className="block"
                imgClassName="block w-full h-auto transition-transform duration-[1200ms] group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,rgba(30,26,24,.58),rgba(30,26,24,.14)_78%)]" />
              <div
                data-reveal
                className="absolute inset-0 flex flex-col items-center justify-center text-center text-ivory px-5"
              >
                <span className="caps-wide block mb-3 text-ivory/95">{KIND_LABEL[featured.featured.kind] || ""}</span>
                <span className="block font-display text-h1 tracking-[0.1em]">
                  {featured.title.toUpperCase()}
                </span>
                <span className="caps-wide block mt-3 text-ivory">{projectMeta(featured)}</span>
              </div>
            </div>
          </section>
        </Link>
      )}

      {/* СЕТКА ПРОЕКТОВ (появится по мере наполнения) */}
      {projects.length >= 2 && (
        <section className="max-w-wide mx-auto px-5 py-20">
          <div className="flex items-baseline justify-between gap-4 mb-9">
            <h2 data-reveal className="font-display text-h2">
              Проекты
            </h2>
            <Link data-reveal href="/portfolio/" className="caps text-graphite/70 hover:text-graphite">
              Все проекты →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {grid.map((p) => (
              <Link key={p.slug} href={`/portfolio/${p.slug}/`} className="group zoomable" data-reveal>
                {/* card-fit: ВСЯ секция (заголовок + арка + подпись) влезает в экран
                    под шапкой — как флагман-кадр («поправь» Петра 23.07) */}
                <div className="arch relative overflow-hidden aspect-[4/5] card-fit">
                  <Picture
                    image={p.cover}
                    alt={imageAlt(p, p.cover)}
                    sizes="(min-width:2500px) 690px, (min-width:768px) 29vw, 100vw"
                    className="absolute inset-0"
                    imgClassName="w-full h-full"
                  />
                </div>
                <div className="mt-4 flex justify-between items-baseline gap-3 card-fit">
                  <span className="font-display text-card font-medium">{p.title}</span>
                  <span className="font-ui text-label text-graphite/70 whitespace-nowrap">
                    {p.area ? `${p.area} м²` : ""}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ДВЕРЬ «Услуги и цены» — одна: дверь «Портфолио» была дублем сетки проектов
          (карточки + «все проекты →» уже ведут туда), убрана по замечанию Петра 23.07 */}
      <section className="min-h-[280px] grid">
        <Link
          href="/uslugi/"
          className="flex flex-col items-center justify-center gap-3 py-16 bg-choco text-ivory hover:brightness-[1.08] transition-[filter] duration-300"
        >
          <span className="font-display text-h2 tracking-[0.08em]">Услуги и цены</span>
          <span className="caps-wide text-ivory/85">полный цикл · от 2 500 ₽/м²</span>
        </Link>
      </section>

      {/* ПОЛОСА-ШТУКАТУРКА: фирменная фишка как разделитель, НЕ поверх формы */}
      <section className="relative h-[200px] bg-ivory-dark" aria-hidden="true">
        <PlasterReveal mode="venetian" />
      </section>

      {/* КОНТАКТЫ вместо формы — живые каналы */}
      <section className="max-w-page mx-auto px-5 py-20 text-center">
        <h2 data-reveal className="font-display text-h2 mb-4">
          Обсудить проект
        </h2>
        <p data-reveal className="font-body text-body text-graphite/80 max-w-[48ch] mx-auto mb-8">
          Первая консультация и замер — бесплатно. Напишите в Telegram, MAX или позвоните — отвечаю лично.
        </p>
        <div data-reveal className="flex flex-wrap items-center justify-center gap-4">
          <ChannelButtons items={channels("Здравствуйте! Пишу с сайта.")} />
        </div>
        <p data-reveal className="font-body text-body text-graphite/70 mt-8 max-w-[42ch] mx-auto">
          Дарья Чернявская — дизайнер интерьера с 20-летней практикой. Квартиры, дома и коммерческие
          пространства в Тюмени и по всей России. Полный цикл, без шаблонных пакетов.
        </p>
      </section>
    </>
  );
}
