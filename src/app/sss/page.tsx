import { ContentPageView } from "@/components/content-page-view";
import { faqs } from "@/lib/data";

export default function FaqPage() {
  return (
    <ContentPageView
      title="Sik Sorulan Sorular"
      description="Teslimat, kart notu, toptan teklif ve odeme adimlariyla ilgili temel cevaplar."
      content={faqs.map((item) => `${item.question}: ${item.answer}`).join(". ")}
    />
  );
}
