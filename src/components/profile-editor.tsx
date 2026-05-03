"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, Phone, UserRound } from "lucide-react";

const PHONE_COUNTRY_CODES = [
  { code: "+90", label: "Turkiye (+90)" },
  { code: "+1", label: "ABD/Kanada (+1)" },
  { code: "+44", label: "Birlesik Krallik (+44)" },
  { code: "+49", label: "Almanya (+49)" },
  { code: "+33", label: "Fransa (+33)" },
  { code: "+39", label: "Italya (+39)" },
  { code: "+31", label: "Hollanda (+31)" },
  { code: "+971", label: "BAE (+971)" },
] as const;

function splitPhoneNumber(input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      countryCode: "+90",
      localNumber: "",
    };
  }

  const matchedCountryCode = PHONE_COUNTRY_CODES.find((entry) => trimmed.startsWith(entry.code));
  if (!matchedCountryCode) {
    return {
      countryCode: "+90",
      localNumber: trimmed.replace(/^\+/, ""),
    };
  }

  return {
    countryCode: matchedCountryCode.code,
    localNumber: trimmed.slice(matchedCountryCode.code.length).trim(),
  };
}

type ProfileData = {
  birthDate?: string;
  name: string;
  email: string;
  phone: string;
};

export function ProfileEditor({ initialData }: { initialData: ProfileData }) {
  const router = useRouter();
  const initialPhone = splitPhoneNumber(initialData.phone);
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  const [birthDate, setBirthDate] = useState(initialData.birthDate ?? "");
  const [phoneCountryCode, setPhoneCountryCode] = useState(initialPhone.countryCode);
  const [phoneLocalNumber, setPhoneLocalNumber] = useState(initialPhone.localNumber);
  const [profilePassword, setProfilePassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleProfileUpdate() {
    setSavingProfile(true);
    setProfileMessage(null);

    try {
      const normalizedInitialEmail = initialData.email.trim().toLowerCase();
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPhoneLocalNumber = phoneLocalNumber.trim();
      const bodyPayload = {
        birthDate: birthDate || undefined,
        currentPassword: normalizedEmail !== normalizedInitialEmail ? profilePassword : undefined,
        email: normalizedEmail,
        name: name.trim(),
        phone: normalizedPhoneLocalNumber ? `${phoneCountryCode} ${normalizedPhoneLocalNumber}` : undefined,
      };

      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message ?? "Güncelleme başarısız.");
      }

      setProfileMessage({ type: "success", text: "Bilgileriniz güncellendi." });
      setProfilePassword("");
      startTransition(() => router.refresh());
    } catch (error) {
      setProfileMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Bir hata oluştu.",
      });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordUpdate() {
    setSavingPassword(true);
    setPasswordMessage(null);

    try {
      const response = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          currentPassword,
          nextPassword,
          confirmPassword,
        }),
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.message ?? "Şifre değiştirilemedi.");
      }

      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
      setPasswordMessage({ type: "success", text: "Şifreniz güncellendi." });
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Bir hata oluştu.",
      });
    } finally {
      setSavingPassword(false);
    }
  }

  function getMessageClass(type: "success" | "error") {
    if (type === "success") {
      return "border border-[#735c00]/40 bg-[#241a00] text-[#ffe088]";
    }

    return "border border-[#93000a]/40 bg-[#35090b] text-[#ffdad6]";
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]" id="profil-bilgileri">
      <div className="rounded-lg border border-[#4d4635]/20 bg-[#1c1b1b] p-8 md:p-10">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2ca50]/10 text-[#f2ca50]">
            <UserRound className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#d0c5af]/70">Kişisel bilgiler</p>
            <h2 className="mt-2 font-serif text-3xl text-[#f2ca50]">Hesabım Bilgileri</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#d0c5af]">
              Ad soyad ve telefon bilgisini burada doğrudan güncelleyebilirsin. E-posta değişikliği
              için güvenlik amacıyla mevcut şifre doğrulaması istenir.
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          <div>
            <label className="text-sm text-[#d0c5af]" htmlFor="profile-name">
              Ad Soyad
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#4d4635]/30 bg-[#201f1f] px-4 py-3 text-[#e5e2e1] outline-none transition-colors focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="text-sm text-[#d0c5af]" htmlFor="profile-email">
              E-posta Adresi
            </label>
            <div className="mt-2 flex min-w-0 items-center gap-2 rounded-lg border border-[#4d4635]/30 bg-[#201f1f] px-4 py-3 text-[#e5e2e1]">
              <Mail className="h-4 w-4 text-[#d4af37]" />
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[#e5e2e1] outline-none placeholder:text-[#d0c5af]/45"
                placeholder="ornek@mail.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-[#d0c5af]" htmlFor="profile-phone">
              Telefon Numarası
            </label>
            <div className="mt-2 flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#d4af37]" />
              <select
                aria-label="Telefon ulke kodu"
                className="rounded-lg border border-[#4d4635]/30 bg-[#171616] px-3 py-3 text-[#e5e2e1] outline-none transition-colors focus:border-[#d4af37]"
                value={phoneCountryCode}
                onChange={(event) => setPhoneCountryCode(event.target.value)}
              >
                {PHONE_COUNTRY_CODES.map((entry) => (
                  <option key={entry.code} value={entry.code}>
                    {entry.code}
                  </option>
                ))}
              </select>
              <input
                id="profile-phone"
                type="tel"
                value={phoneLocalNumber}
                onChange={(e) => setPhoneLocalNumber(e.target.value)}
                placeholder="5XX XXX XX XX"
                className="w-full rounded-lg border border-[#4d4635]/30 bg-[#201f1f] px-4 py-3 text-[#e5e2e1] outline-none transition-colors focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-[#d0c5af]" htmlFor="profile-birthdate">
              Doğum Tarihi
            </label>
            <input
              id="profile-birthdate"
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              className="mt-2 w-full rounded-lg border border-[#4d4635]/30 bg-[#201f1f] px-4 py-3 text-[#e5e2e1] outline-none transition-colors focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="text-sm text-[#d0c5af]" htmlFor="profile-current-password">
              Mevcut Şifre
            </label>
            <input
              id="profile-current-password"
              type="password"
              value={profilePassword}
              onChange={(event) => setProfilePassword(event.target.value)}
              placeholder="Yalnızca e-posta değişikliği için gerekli"
              className="mt-2 w-full rounded-lg border border-[#4d4635]/30 bg-[#201f1f] px-4 py-3 text-[#e5e2e1] outline-none transition-colors focus:border-[#d4af37] placeholder:text-[#d0c5af]/45"
            />
            <p className="mt-2 text-xs leading-6 text-[#d0c5af]/65">
              Ad soyad ve telefon için zorunlu değil. E-posta adresini değiştirirken güvenlik
              doğrulaması olarak istenir.
            </p>
          </div>
        </div>

        {profileMessage && (
          <div className={`mt-5 rounded-lg px-4 py-3 text-sm ${getMessageClass(profileMessage.type)}`}>
            {profileMessage.text}
          </div>
        )}

        <button
          onClick={handleProfileUpdate}
          disabled={savingProfile}
          className="mt-8 inline-flex rounded-sm bg-gradient-to-r from-[#f2ca50] to-[#d4af37] px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#3c2f00] transition-all hover:shadow-[0_0_15px_rgba(242,202,80,0.25)] disabled:opacity-50"
        >
          {savingProfile ? "Kaydediliyor..." : "Bilgileri Güncelle"}
        </button>
      </div>

      <div className="rounded-lg border border-[#4d4635]/20 bg-[#1c1b1b] p-8 md:p-10">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2ca50]/10 text-[#f2ca50]">
            <KeyRound className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#d0c5af]/70">Security</p>
            <h2 className="mt-2 font-serif text-3xl text-[#f2ca50]">Change Password</h2>
            <p className="mt-3 text-sm leading-7 text-[#d0c5af]">
              Mevcut şifreni doğrulayarak hesap şifreni aynı ekrandan güncelleyebilirsin.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-[#d0c5af]" htmlFor="current-password">
              Mevcut Şifre
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-[#4d4635]/30 bg-[#201f1f] px-4 py-3 text-[#e5e2e1] outline-none transition-colors focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="text-sm text-[#d0c5af]" htmlFor="next-password">
              Yeni Şifre
            </label>
            <input
              id="next-password"
              type="password"
              value={nextPassword}
              onChange={(event) => setNextPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-[#4d4635]/30 bg-[#201f1f] px-4 py-3 text-[#e5e2e1] outline-none transition-colors focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="text-sm text-[#d0c5af]" htmlFor="confirm-password">
              Yeni Şifre Tekrar
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-[#4d4635]/30 bg-[#201f1f] px-4 py-3 text-[#e5e2e1] outline-none transition-colors focus:border-[#d4af37]"
            />
          </div>
        </div>

        {passwordMessage && (
          <div className={`mt-5 rounded-lg px-4 py-3 text-sm ${getMessageClass(passwordMessage.type)}`}>
            {passwordMessage.text}
          </div>
        )}

        <button
          onClick={handlePasswordUpdate}
          disabled={savingPassword}
          className="mt-8 inline-flex rounded-sm border border-[#4d4635]/30 bg-[#201f1f] px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#f2ca50] transition-colors hover:bg-[#2a2a2a] disabled:opacity-50"
        >
          {savingPassword ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        </button>

        <p className="mt-5 text-xs leading-6 text-[#d0c5af]/65">
          Yeni şifre en az 8 karakter olmalı; en az bir harf ve bir rakam içermelidir.
        </p>
      </div>
    </div>
  );
}
