import { ContentPageView } from "@/components/content-page-view";

export default function AccountOrdersPage() {
  return (
    <ContentPageView
      title="Siparislerim"
      description="Musteri hesabinda aktif ve gecmis siparisler listelenir."
      content="Demo surumde siparisler local storage ve seed veri ile goruntuleniyor. Sonraki fazda auth ve kullanici bazli sorgu ile gercek siparis gecmisi baglanacak."
    />
  );
}
