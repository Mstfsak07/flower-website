import { RegisterForm } from "@/components/register-form";
import { getLocale } from "@/lib/i18n";

export default async function RegisterPage() {
  const locale = await getLocale();
  return <RegisterForm locale={locale} />;
}
