// Автоподхват портфолио из папок (механика Бытовки72, папка = проект).
// public/images/projects/<slug>/: фото 01-…, 02-… (порядок по имени),
// рядом инфо.json: {title, area, year, city, desc, order, kind, hero, cover, featured, captions}.
// Деривативы из <slug>/_v/ (создаёт photo-fit) собираются в srcset.
// Результат: src/data/projects.json. Запускается сам при dev/build.
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from "fs";
import { join, dirname, parse } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, "..", "public", "images", "projects");
const OUT = join(here, "..", "src", "data", "projects.json");
const IMG = /\.(jpe?g|png|webp|avif)$/i;
const WIDTHS = [640, 960, 1280, 1600, 2200];

function humanize(slug) {
  const s = slug.replace(/[-_]+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Подпись кадра из имени файла: «03-detskaya-m» → «детская» (для alt) */
const ZONES = {
  koridor: "коридор",
  prihozhaya: "прихожая",
  detskaya: "детская",
  spalnya: "спальня",
  kuhnya: "кухня",
  gostinaya: "гостиная",
  sanuzel: "санузел",
  vannaya: "ванная",
  kabinet: "кабинет",
  garderob: "гардеробная",
  plan: "планировка",
};
function zoneOf(fileBase) {
  const s = fileBase.toLowerCase();
  for (const [k, v] of Object.entries(ZONES)) if (s.includes(k)) return v;
  return "";
}

let dirs = [];
try {
  dirs = readdirSync(ROOT).filter((d) => {
    try {
      return statSync(join(ROOT, d)).isDirectory();
    } catch {
      return false;
    }
  });
} catch {
  /* папки нет — пустое портфолио */
}

const projects = [];
for (const slug of dirs) {
  const dir = join(ROOT, slug);
  const vdir = join(dir, "_v");
  const files = readdirSync(dir)
    .filter((f) => IMG.test(f))
    .sort((a, b) => a.localeCompare(b, "ru", { numeric: true }));
  if (files.length === 0) continue;

  let info = {};
  try {
    info = JSON.parse(readFileSync(join(dir, "инфо.json"), "utf8"));
  } catch {
    /* инфо.json опционален */
  }

  const images = [];
  for (const f of files) {
    const src = `/images/projects/${slug}/${f}`;
    const base = parse(f).name;
    let w = null;
    let h = null;
    try {
      const m = await sharp(join(dir, f)).metadata();
      const swap = (m.orientation || 1) >= 5;
      w = swap ? m.height : m.width;
      h = swap ? m.width : m.height;
    } catch {
      /* размеры не читаются — отдадим без них */
    }
    // srcset из деривативов, если они сгенерированы
    const avail = WIDTHS.filter(
      (width) => w && width <= w * 1.05 && existsSync(join(vdir, `${base}-${width}.jpg`))
    );
    const srcset = (ext) =>
      avail.length
        ? avail.map((width) => `/images/projects/${slug}/_v/${base}-${width}.${ext} ${width}w`).join(", ")
        : "";

    images.push({
      src,
      w,
      h,
      avif: srcset("avif"),
      webp: srcset("webp"),
      jpg: srcset("jpg"),
      zone: zoneOf(base),
      caption: (info.captions && info.captions[f]) || "",
      // тип кадра: по умолчанию проектный (у Дарьи почти всё — авторские 3D)
      kind: (info.kinds && info.kinds[f]) || info.kind || "render",
    });
  }

  const pick = (name) => images.find((i) => i.src.endsWith("/" + name)) || null;

  projects.push({
    slug,
    title: info.title || humanize(slug),
    area: info.area ?? null,
    year: info.year ?? null,
    city: info.city || "Тюмень",
    type: info.type || "", // квартира | дом | коммерция — для фильтров, когда проектов станет много
    desc: info.desc || "",
    order: info.order ?? 999,
    kind: info.kind || "render",
    images,
    // разные кадры в разных ролях: один и тот же снимок дважды на экране читается как баг
    hero: pick(info.hero) || images[0],
    cover: pick(info.cover) || images[0],
    featured: pick(info.featured) || images[images.length - 1] || images[0],
  });
}

projects.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "ru"));
writeFileSync(OUT, JSON.stringify(projects, null, 2) + "\n");
console.log(
  "projects.json:",
  projects.map((p) => `${p.slug}(${p.images.length})`).join("  ") || "пусто"
);
