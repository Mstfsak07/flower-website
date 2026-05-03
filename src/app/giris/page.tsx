import { LoginForm } from "@/components/login-form";
import { getLocale } from "@/lib/i18n";

export default async function LoginPage() {
  const locale = await getLocale();
  return <LoginForm locale={locale} />;
}
