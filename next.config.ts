import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Статический экспорт (как Бытовка72): папка out/ кладётся на любой хостинг без Node.js.
  // Пока собираем локально; домен и хостинг подключим позже.
  output: "export",
  // Каждая страница экспортируется папкой с index.html (/uslugi/ вместо /uslugi.html) —
  // работает на любом статик-хостинге без настройки редиректов.
  trailingSlash: true,
  images: {
    // На статике нет серверной оптимизации картинок — отдаём как есть.
    unoptimized: true,
  },
  poweredByHeader: false,
};

export default nextConfig;
