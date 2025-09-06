import DashboardLayout from "@/components/dashboard-layout";
import TeamClient from "@/components/team-client";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";

export default async function TeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  return (
    <DashboardLayout user={user}>
      <TeamClient user={user} />
    </DashboardLayout>
  );
}