import { redirect } from "next/navigation";

import { readAuthSession } from "@/lib/auth-server";
import { getAccountAddressesRepo } from "@/lib/repositories/account-repository";
import { AddressManager } from "@/components/address-manager";

export default async function AccountAddressesPage() {
  const session = await readAuthSession();

  if (!session?.user) {
    redirect("/giris?redirect=/hesabim/adresler");
  }

  const addresses = session.user.id
    ? await getAccountAddressesRepo(session.user.id)
    : [];

  return (
    <div className="space-y-6">
      <div className="floating-surface rounded-[2.3rem] p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="editorial-label text-[var(--color-accent)]">Address Book</p>
            <h1 className="mt-4 font-serif text-5xl text-[var(--color-ink)]">Addresses</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-muted)]">
              Kayıtlı teslimat adreslerinizi bu alanda yönetebilirsiniz. Varsayılan teslimat adresi
              checkout sırasında otomatik olarak doldurulur.
            </p>
          </div>
        </div>
      </div>

      <AddressManager initialAddresses={addresses} />
    </div>
  );
}
