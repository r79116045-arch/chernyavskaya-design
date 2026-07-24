import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject, projectMeta, nextProject, imageAlt, KIND_LABEL } from "@/lib/projects";
import LeadForm from "@/components/LeadForm";
import Picture from "@/components/Picture";
import Lightbox from "@/components/Lightbox";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  const clean = p.desc || `${p.title}: проект Дарьи Чернявской. ${projectMeta(p)}.`;
  return { title: `${p.title} — проект интерьера`, description: clean };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const next = nextProject(p.slug);
  const rest = p.images.filter((i) => i.src !== p.hero.src);

  return (
    <>
      {/* хлебные крошки — кейс не тупик */}
      <nav aria-label="Хлебные крошки" className="max-w-page mx-auto px-5 pt-6">
        <ol className="flex gap-2 caps text-graphite/70">
          <li><Link href="/portfolio/" className="hover:text-graphite">Портфолио</Link></li>
          <li aria-hidden="true">›</li>
          <li className="text-graphite" aria-current="page">{p.title}</li>
        </ol>
      </nav>

      {/* Шапка кейса в стиле Yovanovitch: фото + имя по центру */}
      <section className="px-4 md:px-6 mt-4">
        {/* Шапка кейса: кадр целиком и максимально крупно — композицию не режем.
            maxWidth = --frame-h × пропорция: кадр гарантированно влезает на экран
            под липкой шапкой, место резервируется атрибутами width/height. */}
        <div
          className="relative mx-auto max-w-full overflow-hidden"
          style={
            p.hero.w && p.hero.h
              ? { maxWidth: `calc(var(--frame-h) * ${(p.hero.w / p.hero.h).toFixed(4)})` }
              : undefined
          }
        >
          <Picture
            image={p.hero}
            alt={imageAlt(p, p.hero)}
            sizes="100vw"
            priority
            fit="none"
            className="block"
            imgClassName="block w-full h-auto"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,rgba(30,26,24,.58),rgba(30,26,24,.14)_78%)]" />
          <div
            data-reveal
            className="absolute inset-0 flex flex-col items-center justify-center text-center text-ivory px-5"
          >
            {/* подпись по КОНКРЕТНОМУ кадру, а не по проекту: рендер нельзя звать фото реализации */}
            <span className="caps-wide block mb-3 text-ivory/95">
              {KIND_LABEL[p.hero.kind] || "3D-визуализация"}
            </span>
            <h1 className="font-display font-light text-h1 tracking-[0.1em]">
              {p.title.toUpperCase()}
            </h1>
            <span className="caps-wide block mt-3 text-ivory">{projectMeta(p)}</span>
          </div>
        </div>
      </section>

      {/* ритм кейса = ритм главной: равный зазор py-20 между крупными блоками
          (hero→описание→галерея→заявка), «подровняй зазоры» 23.07 */}
      {p.desc && (
        <section className="max-w-page mx-auto px-5 pt-20">
          <p data-reveal className="font-body text-lead max-w-[62ch] text-graphite/90">
            {p.desc}
          </p>
        </section>
      )}

      {/* Галерея — в широком контейнере: кадры главнее текста */}
      <section className="max-w-wide mx-auto px-5 py-20">
        <Lightbox project={p} images={rest} />
      </section>

      <section className="max-w-page mx-auto px-5 pb-20">

        {/* Заявка с контекстом проекта — в Telegram уйдёт «Смотрел(а): проект …» */}
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 items-start">
          <div data-reveal>
            <LeadForm context={p.title} />
          </div>
          <div data-reveal>
            <p className="font-body text-body text-graphite/85">
              Хотите так же? Первая консультация и замер — бесплатно. Обсудим вашу планировку, свет и
              бюджет — без обязательств.
            </p>
          </div>
        </div>
      </section>

      {/* Следующий проект — чтобы кейс вёл дальше, а не в тупик */}
      {next && (
        <Link href={`/portfolio/${next.slug}/`} className="block group border-t border-graphite/10">
          <div className="max-w-page mx-auto px-5 py-10 flex items-center justify-between gap-6">
            <div>
              <span className="caps text-graphite/70">Следующий проект</span>
              <p className="font-display text-h3 mt-1">{next.title}</p>
            </div>
            <span className="font-display text-3xl text-wine transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>
      )}
    </>
  );
}
