import DashboardLayout from "@/components/dashboard-layout";
import PostComposerClient from "@/components/post-composer-client";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";

export default async function ComposerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  return (
    <DashboardLayout user={user}>
      <PostComposerClient user={user} />
    </DashboardLayout>
  );
}