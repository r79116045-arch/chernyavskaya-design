// Приёмка фото/3D от Дарьи + генерация адаптивных деривативов.
// Запуск: pnpm photos   (не в prebuild — тяжело; деривативы кэшируются по mtime мастера)
//
// 1) Мастер-файлы в public/images/projects/<slug>/: поворот по EXIF, ресайз ≤2200px, q82.
//    Оригиналы больше 2200px бэкапятся в _originals/. Кадрирования НЕТ:
//    интерьерные рендеры рубить нельзя — композиция важнее ровной сетки.
// 2) Деривативы в <slug>/_v/: ширины 640/960/1280/1600/2200 в AVIF + WebP + JPEG
//    (srcset в Picture.tsx; JPEG-фолбэк остаётся всегда — сайт обязан выжить при любом MIME).
import { readdirSync, mkdirSync, copyFileSync, statSync, existsSync } from "fs";
import { join, dirname, parse } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, "..", "public", "images", "projects");
const BACKUP = join(here, "..", "_originals", "photo-fit-backup");
const IMG = /\.(jpe?g|png|webp)$/i;

const MAX_W = 2200; // потолок мастера
const MIN_W = 1200; // ниже — предупреждаем: на большом экране будет мыло
const WIDTHS = [640, 960, 1280, 1600, 2200];

let fixed = 0;
let derived = 0;
let cached = 0;
const warnings = [];

let slugs = [];
try {
  slugs = readdirSync(ROOT).filter((d) => statSync(join(ROOT, d)).isDirectory());
} catch {
  console.log("Нет папки с проектами — нечего обрабатывать.");
  process.exit(0);
}

for (const slug of slugs) {
  const dir = join(ROOT, slug);
  const files = readdirSync(dir).filter((f) => IMG.test(f));
  const vdir = join(dir, "_v");

  for (const name of files) {
    const file = join(dir, name);
    const rel = `${slug}/${name}`;
    try {
      const meta = await sharp(file, { failOn: "none" }).metadata();
      const swap = (meta.orientation || 1) >= 5;
      const w = swap ? meta.height : meta.width;
      const h = swap ? meta.width : meta.height;

      // 1) мастер: только ресайз/поворот, без кропа
      if (w > MAX_W) {
        mkdirSync(BACKUP, { recursive: true });
        copyFileSync(file, join(BACKUP, `${slug}__${name}`));
        const buf = await sharp(file, { failOn: "none" })
          .rotate()
          .resize({ width: MAX_W, withoutEnlargement: true })
          .jpeg({ quality: 82, mozjpeg: true })
          .toBuffer();
        await sharp(buf).toFile(file);
        console.log(`✂ ${rel}: ${w}px → ≤${MAX_W}px`);
        fixed++;
      }
      if (w < MIN_W) {
        warnings.push(`МЕЛКОЕ: ${rel} — ${w}×${h}px (нужно от ${MIN_W}px, иначе мыло на десктопе)`);
      }

      // 2) деривативы (кэш по времени изменения мастера)
      mkdirSync(vdir, { recursive: true });
      const master = statSync(file);
      const base = parse(name).name;
      const mw = (await sharp(file).metadata()).width;

      for (const width of WIDTHS) {
        if (width > mw * 1.05) continue; // не растягиваем
        for (const [fmt, opts] of [
          ["avif", { quality: 52 }],
          ["webp", { quality: 78 }],
          ["jpg", { quality: 80, mozjpeg: true }],
        ]) {
          const out = join(vdir, `${base}-${width}.${fmt}`);
          if (existsSync(out) && statSync(out).mtimeMs >= master.mtimeMs) {
            cached++;
            continue;
          }
          const pipe = sharp(file).rotate().resize({ width, withoutEnlargement: true });
          await (fmt === "avif"
            ? pipe.avif(opts)
            : fmt === "webp"
              ? pipe.webp(opts)
              : pipe.jpeg(opts)
          ).toFile(out);
          derived++;
        }
      }
    } catch (e) {
      warnings.push(`ОШИБКА: ${rel} — ${e.message}`);
    }
  }
}

console.log(`\nМастера: пережато ${fixed}. Деривативы: создано ${derived}, из кэша ${cached}.`);
if (warnings.length) {
  console.log("\n⚠️ Внимание:");
  for (const w of warnings) console.log("  " + w);
}
console.log("\nДальше: node scripts/projects.mjs (или просто pnpm dev/build).");
