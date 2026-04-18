import { ContentPageView } from "@/components/content-page-view";
import { getContentPage } from "@/lib/data";

export default function PreInfoPage() {
  const page = getContentPage("on-bilgilendirme-formu");
  return (
    <ContentPageView
      title={page?.title ?? "On Bilgilendirme Formu"}
      description={page?.seoDescription ?? ""}
      content={page?.content ?? ""}
    />
  );
}
