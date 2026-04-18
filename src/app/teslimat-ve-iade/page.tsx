import { ContentPageView } from "@/components/content-page-view";
import { getContentPage } from "@/lib/data";

export default function DeliveryPage() {
  const page = getContentPage("teslimat-ve-iade");
  return (
    <ContentPageView
      title={page?.title ?? "Teslimat ve Iade"}
      description={page?.seoDescription ?? ""}
      content={page?.content ?? ""}
    />
  );
}
