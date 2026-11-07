import "server-only";

import { cookies } from "next/headers";

import { defaultLocale, isLocale, type Locale, localeCookieName } from "@/lib/locale";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;

  return isLocale(cookieLocale) ? cookieLocale : defaultLocale;
}

const dictionaries = {
  tr: {
    common: {
      skipToContent: "Ana icerige gec",
      languageLabel: "Dil",
      languages: {
        tr: "TR",
        en: "EN",
      },
    },
    header: {
      nav: {
        home: "Ana Sayfa",
        collections: "Aranjmanlar",
        search: "Arama",
        corporate: "Kurumsal",
        orderTracking: "Siparis Takip",
      },
      tagline: "Zarif ve Ozenli",
      account: "Hesabim",
      admin: "Yonetim",
      login: "Giris",
      loginAction: "Giris Yap",
      logout: "Cikis",
      logoutAction: "Cikis Yap",
      whatsapp: "WhatsApp",
      whatsappSupport: "WhatsApp Destek",
      cart: "Sepet",
      mobileMenuOpen: "Menuyu ac",
      mobileMenuClose: "Menuyu kapat",
      quickMenu: "Hizli Menu",
      quickMenuTitle: "Cicek secimini hizlandir.",
    },
    home: {
      nav: {
        collections: "Aranjmanlar",
        occasions: "Mini Buketler",
        atelier: "Atolye",
        bespoke: "Kurumsal",
      },
      heroEyebrow: "Botanik Ustaligi",
      heroTitleStart: "Ciceklerin",
      heroTitleAccent: "Sanati",
      heroDescription:
        "Ozenle kurgulanmis seckilerle anlari daha zarif hale getiren premium cicek deneyimi.",
      heroPrimaryCta: "Koleksiyonlari Kesfet",
      heroSecondaryCta: "Atolyeyi Incele",
      seasonalTitle: "Sezonun Ozel Seckileri",
      seasonalDescription:
        "Kisa sureli hazirlanan, donemin ruhunu tasiyan ve dikkatle secilen aranjmanlar.",
      viewAllSeasons: "Tumunu Gor",
      reserveBouquet: "Buketi Incele",
      craftEyebrow: "Zanaatimiz",
      craftTitleStart: "Siradanin",
      craftTitleAccent: "Otesinde",
      craftDescription:
        "Riva Çiçekçilik'teki her tasarim; doku, ton ve koku arasinda dengeli bir kompozisyon olarak ele alinir.",
      craftItems: [
        "Dayaniklilik icin ozenle hazirlanan saplar",
        "Imza koku karakteriyle tamamlanan sunum",
        "Mat dokulu vazolar ve rafine detaylar",
      ],
      curatedEssentials: "Secilmis Vazgecilmezler",
      curatedEssentialsSubtitle: "Mekana sakin ama guclu bir karakter katan zamansiz secimler",
      atelierCollection: "Atolye Koleksiyonu",
      scentTitle: "Riva Çiçekçilik'in Imza Kokusu",
      scentDescription:
        "Amber, toprak ve yasemin notalari; her aranjmana duyusal bir derinlik ekler.",
      footerLinks: ["Surdurulebilirlik", "Bakim Rehberi", "Basin", "Kosullar", "Iletisim"],
      footerInstagram: "Instagram",
      footerMail: "E-Posta",
      footerCopy: "© 2026 Riva Çiçekçilik. Ozenle hazirlanan premium cicek tasarimlari.",
    },
    category: {
      collections: "Aranjmanlar",
      bespoke: "Kurumsal",
      atelier: "Atolye",
      heroEyebrow: "Koleksiyon 2026",
      enterGallery: "Galeriyi Ac",
      filters: ["Tum Cicekler", "Sezon Seckileri", "Nadir Parcalar", "Kurumsal"],
      quickView: "Hizli Incele",
      newsletterTitle: "Icerideki Daireye Katil",
      newsletterDescription:
        "Sinirli sayidaki koleksiyonlar ve ozel gosterimler icin ilk haberi sen al.",
      newsletterPlaceholder: "E-posta Adresin",
    },
    product: {
      collections: "Aranjmanlar",
      bespoke: "Kurumsal",
      atelier: "Atolye",
      heroEyebrow: "Seckin Koken",
      signatureCollection: "Imza Koleksiyonu",
      stock: "Stokta - Ozenle Hazirlanan Seri",
      composition: "Kompozisyon",
      careInstructions: "Bakim Notlari",
      careDescription:
        "Yumusak isik, duzenli su degisimi ve serin bir ortam; formu ve canliligi daha uzun korur.",
      pairingsEyebrow: "Uyumlu Eslikciler",
      pairingsTitle: "Atmosferi Tamamla",
      pairingsDescription:
        "Bu tasarimin etkisini destekleyen doku ve siluetlerle ambiyansi genislet.",
    },
    cart: {
      back: "Geri",
      title: "Sepet",
      eyebrow: "Siparis Akisi",
      heading: "Botanik Secimlerin",
    },
    checkout: {
      home: "Ana Sayfa",
      collections: "Aranjmanlar",
      cart: "Sepet",
      eyebrow: "Odeme Akisi",
      heading: "Siparisini daha sade ve odakli bir satin alma akisi icinde tamamla.",
    },
    wholesale: {
      boutique: "Butik",
      atelier: "Atolye",
      checkout: "Odeme",
      eyebrow: "Hikayemiz",
      heading: "Gecici guzelligin buyuk olcekteki rafine yorumu.",
      description:
        "Mekan kurulumlarindan surekli konaklama projelerine kadar ayni zarif dil, toptan ve ozel siparislerde de suruyor.",
    },
  },
  en: {
    common: {
      skipToContent: "Skip to main content",
      languageLabel: "Language",
      languages: {
        tr: "TR",
        en: "EN",
      },
    },
    header: {
      nav: {
        home: "Home",
        collections: "Arrangements",
        search: "Search",
        corporate: "Wholesale",
        orderTracking: "Track Order",
      },
      tagline: "Elegant and Intentional",
      account: "Account",
      admin: "Admin",
      login: "Sign In",
      loginAction: "Sign In",
      logout: "Sign Out",
      logoutAction: "Sign Out",
      whatsapp: "WhatsApp",
      whatsappSupport: "WhatsApp Support",
      cart: "Cart",
      mobileMenuOpen: "Open menu",
      mobileMenuClose: "Close menu",
      quickMenu: "Quick Menu",
      quickMenuTitle: "Find the right flowers faster.",
    },
    home: {
      nav: {
        collections: "Arrangements",
        occasions: "Mini Bouquets",
        atelier: "The Atelier",
        bespoke: "Wholesale",
      },
      heroEyebrow: "Botanical Mastery",
      heroTitleStart: "Art of",
      heroTitleAccent: "Flowers",
      heroDescription:
        "A premium floral experience shaped to make every gesture feel more refined and memorable.",
      heroPrimaryCta: "Explore Collections",
      heroSecondaryCta: "Visit the Atelier",
      seasonalTitle: "Seasonal Exclusives",
      seasonalDescription:
        "Limited arrangements created for the moment, selected with a restrained and elevated eye.",
      viewAllSeasons: "View All",
      reserveBouquet: "Explore Bouquet",
      craftEyebrow: "Our Craft",
      craftTitleStart: "Beyond the",
      craftTitleAccent: "Ordinary",
      craftDescription:
        "Every design at Riva Çiçekçilik is approached as a balanced composition of texture, tone, and scent.",
      craftItems: [
        "Carefully prepared stems for longer presence",
        "Presentation completed with a signature scent profile",
        "Matte vessels and refined finishing details",
      ],
      curatedEssentials: "Curated Essentials",
      curatedEssentialsSubtitle: "Timeless pieces that give interiors a quiet but confident character",
      atelierCollection: "Atelier Collection",
      scentTitle: "The Signature Scent of Riva Çiçekçilik",
      scentDescription:
        "Amber, earth, and jasmine notes add a layered sensory depth to every arrangement.",
      footerLinks: ["Sustainability", "Care Guide", "Press", "Terms", "Contact"],
      footerInstagram: "Instagram",
      footerMail: "Email",
      footerCopy: "© 2026 Riva Çiçekçilik. Refined floral compositions.",
    },
    category: {
      collections: "Arrangements",
      bespoke: "Wholesale",
      atelier: "The Atelier",
      heroEyebrow: "Collection 2026",
      enterGallery: "Enter the Gallery",
      filters: ["All Flowers", "Seasonal Edits", "Rare Finds", "Wholesale"],
      quickView: "Quick View",
      newsletterTitle: "Join the Inner Circle",
      newsletterDescription:
        "Be the first to hear about limited collections and private previews.",
      newsletterPlaceholder: "Email Address",
    },
    product: {
      collections: "Arrangements",
      bespoke: "Wholesale",
      atelier: "The Atelier",
      heroEyebrow: "Exclusive Origin",
      signatureCollection: "Signature Collection",
      stock: "In Stock - Curated Batch",
      composition: "The Composition",
      careInstructions: "Care Instructions",
      careDescription:
        "Soft light, regular water changes, and a cooler room help preserve shape and freshness longer.",
      pairingsEyebrow: "Curated Pairings",
      pairingsTitle: "Complement the Mood",
      pairingsDescription:
        "Extend the atmosphere with textures and silhouettes that echo this arrangement.",
    },
    cart: {
      back: "Back",
      title: "Cart",
      eyebrow: "Checkout Journey",
      heading: "Your Botanical Selections",
    },
    checkout: {
      home: "Home",
      collections: "Arrangements",
      cart: "Cart",
      eyebrow: "Payment Flow",
      heading: "Complete your order in a cleaner, more focused purchase flow.",
    },
    wholesale: {
      boutique: "Boutique",
      atelier: "Atelier",
      checkout: "Checkout",
      eyebrow: "Our Story",
      heading: "A refined expression of ephemeral beauty at scale.",
      description:
        "From installations to recurring hospitality programs, the same elegant language continues through wholesale and private commissions.",
    },
  },
} as const;

export async function getDictionary(locale?: Locale) {
  const resolvedLocale = locale ?? (await getLocale());
  return dictionaries[resolvedLocale];
}
