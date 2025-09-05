import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard-layout";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";

function buildMonthGrid(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [] as { label: string; inMonth: boolean }[];
  for (let i = 0; i < startDay; i++) cells.push({ label: "", inMonth: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ label: String(d), inMonth: true });
  while (cells.length % 7 !== 0) cells.push({ label: "", inMonth: false });
  return {
    cells,
    title: date.toLocaleString(undefined, { month: "long", year: "numeric" }),
  };
}

export default async function CalendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");
  const { cells, title } = buildMonthGrid();

  return (
    <DashboardLayout user={user}>
      <div className="p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl font-bold text-white">Calendar</h1>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-xs sm:text-sm">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-slate-300 text-center py-2">
                  {d}
                </div>
              ))}
              {cells.map((c, i) => (
                <div
                  key={i}
                  className={`min-h-[80px] rounded-md border border-slate-700 p-2 ${c.inMonth ? "bg-slate-700" : "bg-slate-800 opacity-60"}`}
                >
                  <div className="text-slate-200 text-xs">{c.label}</div>
                </div>
              ))}
            </div>
            <div className="text-center text-slate-400 text-sm mt-6">
              No scheduled posts yet
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
