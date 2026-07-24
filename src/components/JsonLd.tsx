import { contacts } from "@/lib/contacts";

/**
 * Микроразметка для поисковиков: локальный бизнес «дизайн интерьера, Тюмень».
 * TODO(домен): при появлении домена добавить url и image (og-превью).
 * Телефон подставляется из contacts.ts (модерация Директа и Яндекс.Бизнес смотрят сюда).
 */
export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Дарья Чернявская — дизайн интерьера",
    description:
      "Дизайн интерьера квартир, домов и коммерческих пространств. Полный цикл: от замера до готового ремонта. 20 лет практики.",
    areaServed: ["Тюмень", "Россия"],
    address: { "@type": "PostalAddress", addressLocality: "Тюмень", addressCountry: "RU" },
    priceRange: "от 2 500 ₽/м²",
    ...(contacts.phoneRaw ? { telephone: `+${contacts.phoneRaw}` } : {}),
    founder: { "@type": "Person", name: "Дарья Чернявская", jobTitle: "Дизайнер интерьера" },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
