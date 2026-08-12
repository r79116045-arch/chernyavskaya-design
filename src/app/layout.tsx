import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import StickyCta from "@/components/StickyCta";
import FloatingContacts from "@/components/FloatingContacts";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

// Self-hosted Cormorant Garamond (вариативный 300–500 + курсив), сборка без сети.
// preload только для КИРИЛЛИЦЫ normal (первый экран); латиница и курсив — по факту (без preload),
// чтобы не тянуть с первого экрана 4 файла ради заголовка.
const display = localFont({
  src: [
    { path: "./fonts/cormorant-cyrillic-normal.woff2", weight: "300 500", style: "normal" },
    { path: "./fonts/cormorant-latin-normal.woff2", weight: "300 500", style: "normal" },
    { path: "./fonts/cormorant-cyrillic-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/cormorant-latin-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://дарьячернявская.рф"),
  title: {
    default: "Дарья Чернявская — дизайн интерьера в Тюмени",
    template: "%s — Дарья Чернявская",
  },
  description:
    "Дизайн интерьера квартир, домов и коммерческих пространств в Тюмени и по всей России. " +
    "Полный цикл: от замера до готового ремонта. 20 лет практики. Проекты от 2 500 ₽/м². " +
    "Консультация и замер — бесплатно.",
  keywords: [
    "дизайн интерьера Тюмень",
    "дизайнер интерьера Тюмень",
    "дизайн-проект квартиры",
    "дизайн интерьера дома",
    "дизайн коммерческих помещений",
  ],
  openGraph: {
    title: "Дарья Чернявская — дизайн интерьера в Тюмени",
    description:
      "Дизайн интерьера квартир, домов и коммерческих пространств. Полный цикл: от замера до готового ремонта. 20 лет практики.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={display.variable}>
      <body>
        <a href="#main" className="skip-link">
          К содержимому
        </a>
        <JsonLd />
        <ScrollReveal />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyCta />
        <FloatingContacts />
      </body>
    </html>
  );
}
