import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard-layout";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  const metrics = [
    { title: "Impressions", value: "128.4k", delta: "+12.3%" },
    { title: "Reach", value: "86.2k", delta: "+8.1%" },
    { title: "Clicks", value: "14.7k", delta: "+4.6%" },
    { title: "Engagement Rate", value: "5.2%", delta: "+0.9%" },
  ];

  const platforms = [
    { name: "Facebook", value: 72 },
    { name: "Instagram", value: 88 },
    { name: "LinkedIn", value: 54 },
    { name: "Twitter/X", value: 63 },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="p-6 lg:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 text-sm">
            Overview of your performance across platforms.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <Card key={m.title} className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-300 text-sm">
                  {m.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white">{m.value}</div>
                  <div className="text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                    {m.delta}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Engagement Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56 w-full rounded-md bg-slate-900/60 border border-slate-700 flex items-center justify-center text-slate-400">
                Chart placeholder
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Platform Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platforms.map((p) => (
                  <div key={p.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-200">{p.name}</span>
                      <span className="text-slate-400">{p.value}%</span>
                    </div>
                    <div className="h-2 w-full rounded bg-slate-900">
                      <div
                        className="h-2 rounded bg-purple-600"
                        style={{ width: `${p.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Top Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-md border border-slate-700 bg-slate-900/40 p-3"
                  >
                    <div className="h-12 w-16 shrink-0 overflow-hidden rounded">
                      <img
                        src={`https://images.unsplash.com/photo-15${i + 10}4696960-66a236eeefe4?w=200&q=40`}
                        alt="thumb"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm text-white">
                        Post title example {i + 1}
                      </div>
                      <div className="text-xs text-slate-400">
                        Engagement: {Math.round(1200 + i * 137)} • CTR:{" "}
                        {Math.round(2.1 + i * 0.2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Best time to post is between 9-11 AM on weekdays.",
                  "Carousel posts perform 18% better on Instagram.",
                  "LinkedIn posts with 3-5 hashtags get higher reach.",
                ].map((text, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-slate-900/50 border border-slate-700 p-3 text-sm text-slate-200"
                  >
                    <span className="mr-2">💡</span>
                    {text}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
