import DashboardLayout from "@/components/dashboard-layout";
import TemplatesClient from "@/components/templates-client";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";

export default async function TemplatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  return (
    <DashboardLayout user={user}>
      <TemplatesClient user={user} />
    </DashboardLayout>
  );
}