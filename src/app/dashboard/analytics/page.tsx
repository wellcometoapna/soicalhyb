import DashboardLayout from "@/components/dashboard-layout";
import AnalyticsClient from "@/components/analytics-client";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  return (
    <DashboardLayout user={user}>
      <AnalyticsClient user={user} />
    </DashboardLayout>
  );
}