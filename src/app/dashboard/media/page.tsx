import DashboardLayout from "@/components/dashboard-layout";
import MediaLibraryClient from "@/components/media-library-client";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function MediaLibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  return (
    <DashboardLayout user={user}>
      <MediaLibraryClient user={user} />
    </DashboardLayout>
  );
}