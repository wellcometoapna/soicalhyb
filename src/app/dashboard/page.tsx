import DashboardLayout from "@/components/dashboard-layout";
import DashboardClient from "@/components/dashboard-client";
import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  return (
    <DashboardLayout user={user}>
      <DashboardClient user={user} />
    </DashboardLayout>
  );
}