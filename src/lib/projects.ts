import data from "@/data/projects.json";

export type ProjectImage = {
  src: string;
  w: number | null;
  h: number | null;
  avif: string;
  webp: string;
  jpg: string;
  zone: string;
  caption: string;
  kind: "render" | "photo" | "plan" | string;
};

export type Project = {
  slug: string;
  title: string;
  area: number | null;
  year: number | null;
  city: string;
  type: string;
  desc: string;
  order: number;
  kind: string;
  images: ProjectImage[];
  hero: ProjectImage;
  cover: ProjectImage;
  featured: ProjectImage;
};

export const projects = data as unknown as Project[];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Следующий проект по кругу — чтобы кейс не был тупиком. */
export function nextProject(slug: string): Project | undefined {
  if (projects.length < 2) return undefined;
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

/** Подпись в стандарте мирового топа: «124 м² · 2025 · Тюмень». Пустое не рендерим. */
export function projectMeta(p: Project): string {
  return [p.area ? `${p.area} м²` : null, p.year || null, p.city || null]
    .filter(Boolean)
    .join(" · ");
}

/** alt для кадра: «Квартира с арками — 3D-визуализация, детская» */
export function imageAlt(p: Project, img: ProjectImage): string {
  if (img.caption) return `${p.title} — ${img.caption}`;
  const kind =
    img.kind === "photo" ? "фото реализации" : img.kind === "plan" ? "планировка" : "3D-визуализация";
  return [p.title, kind, img.zone].filter(Boolean).join(" — ");
}

export const KIND_LABEL: Record<string, string> = {
  render: "3D-визуализация",
  photo: "фото реализации",
  plan: "планировка",
};
