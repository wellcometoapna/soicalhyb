import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/dashboard-layout";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";

export default async function TeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  const team = [
    {
      name: "Alex Johnson",
      role: "Admin",
      email: "alex@example.com",
      status: "Active",
    },
    {
      name: "Sam Lee",
      role: "Editor",
      email: "sam@example.com",
      status: "Pending",
    },
    {
      name: "Taylor Kim",
      role: "Viewer",
      email: "taylor@example.com",
      status: "Active",
    },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl font-bold text-white">Team</h1>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.map((m) => (
                  <TableRow key={m.email}>
                    <TableCell className="text-slate-200">{m.name}</TableCell>
                    <TableCell className="text-slate-300">{m.role}</TableCell>
                    <TableCell className="text-slate-300">{m.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-md ${m.status === "Active" ? "bg-green-600 text-white" : "bg-yellow-600 text-white"}`}
                      >
                        {m.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
