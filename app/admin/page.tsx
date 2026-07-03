import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { AdminOrderTable } from "@/components/AdminOrderTable";

export default async function AdminDashboardPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  const supabase = createServiceRoleClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, sellers(first_name, last_name, email, phone), properties(property_address, city, state), packages(name)")
    .order("created_at", { ascending: false });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold text-navy">Admin Dashboard</h1>
        <form action="/api/admin/logout" method="post">
          <button className="font-display text-sm font-bold uppercase tracking-wide text-red">
            Log Out
          </button>
        </form>
      </div>
      <div className="mt-8">
        <AdminOrderTable orders={orders ?? []} />
      </div>
    </section>
  );
}
