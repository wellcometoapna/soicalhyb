import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/dashboard-layout";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  return (
    <DashboardLayout user={user}>
      <div className="min-h-screen bg-slate-900 p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 text-sm">Manage your account and preferences</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">Full Name</Label>
                <Input
                  id="name"
                  defaultValue={user.user_metadata.full_name || ""}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user.email}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-slate-200">Company</Label>
                <Input
                  id="company"
                  placeholder="Your company name"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-slate-200">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-slate-200">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-slate-200">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}