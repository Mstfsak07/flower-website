"use client";

import { useState, type FormEvent } from "react";

import type { Locale } from "@/lib/locale";

type FormStatus = "idle" | "submitting" | "success" | "error";

const copy = {
  tr: {
    fullName: "Ad Soyad",
    phone: "Telefon",
    email: "E-posta",
    message: "Mesajınız",
    submit: "Mesaj Gönder",
    submitting: "Gönderiliyor",
    error: "Mesaj gönderilemedi. Lütfen bilgileri kontrol edip tekrar deneyin.",
    success: "Mesajınız alındı. En kısa sürede dönüş yapacağız.",
  },
  en: {
    fullName: "Full Name",
    phone: "Phone",
    email: "Email",
    message: "Your Message",
    submit: "Send Message",
    submitting: "Sending",
    error: "Message could not be sent. Please check your details and try again.",
    success: "Your message has been received. We will get back to you as soon as possible.",
  },
} as const;

export function ContactForm({ locale = "tr" }: { locale?: Locale }) {
  const t = copy[locale];
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("submitting");
    setMessage(null);

    const response = await fetch("/api/contact", {
      body: JSON.stringify({
        email: String(formData.get("email") ?? ""),
        fullName: String(formData.get("fullName") ?? ""),
        message: String(formData.get("message") ?? ""),
        phone: String(formData.get("phone") ?? ""),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).catch(() => null);

    if (!response?.ok) {
      setStatus("error");
      setMessage(t.error);
      return;
    }

    form.reset();
    setStatus("success");
    setMessage(t.success);
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-[#2f2623]">
          {t.fullName}
          <input
            className="rounded-2xl border border-[#ead8d2] bg-[#fff8f3] px-4 py-3 outline-none transition focus:border-[#aa2e28]"
            name="fullName"
            required
            type="text"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[#2f2623]">
          {t.phone}
          <input
            className="rounded-2xl border border-[#ead8d2] bg-[#fff8f3] px-4 py-3 outline-none transition focus:border-[#aa2e28]"
            name="phone"
            required
            type="tel"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-[#2f2623]">
        {t.email}
        <input
          className="rounded-2xl border border-[#ead8d2] bg-[#fff8f3] px-4 py-3 outline-none transition focus:border-[#aa2e28]"
          name="email"
          required
          type="email"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-[#2f2623]">
        {t.message}
        <textarea
          className="min-h-36 resize-y rounded-[1.5rem] border border-[#ead8d2] bg-[#fff8f3] px-4 py-3 outline-none transition focus:border-[#aa2e28]"
          name="message"
          required
        />
      </label>

      <button
        className="inline-flex justify-center rounded-full bg-[linear-gradient(135deg,#aa2e28_0%,#cc473e_100%)] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={status === "submitting"}
        type="submit"
      >
        {status === "submitting" ? t.submitting : t.submit}
      </button>

      {message ? (
        <p
          className={
            status === "success"
              ? "text-sm font-medium text-[#2a674c]"
              : "text-sm font-medium text-red-600"
          }
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
