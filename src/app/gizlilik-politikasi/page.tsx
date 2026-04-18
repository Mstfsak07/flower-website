import { ContentPageView } from "@/components/content-page-view";
import { getContentPage } from "@/lib/data";

export default function PrivacyPage() {
  const page = getContentPage("gizlilik-politikasi");
  return (
    <ContentPageView
      title={page?.title ?? "Gizlilik Politikasi"}
      description={page?.seoDescription ?? ""}
      content={page?.content ?? ""}
    />
  );
}
