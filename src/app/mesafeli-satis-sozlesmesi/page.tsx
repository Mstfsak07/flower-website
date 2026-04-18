import { ContentPageView } from "@/components/content-page-view";
import { getContentPage } from "@/lib/data";

export default function DistanceSalesPage() {
  const page = getContentPage("mesafeli-satis-sozlesmesi");
  return (
    <ContentPageView
      title={page?.title ?? "Mesafeli Satis Sozlesmesi"}
      description={page?.seoDescription ?? ""}
      content={page?.content ?? ""}
    />
  );
}
