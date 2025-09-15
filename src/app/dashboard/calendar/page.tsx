// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import DashboardLayout from "@/components/dashboard-layout";
// import { createClient } from "../../../../supabase/server";
// import { redirect } from "next/navigation";

// function buildMonthGrid(date = new Date()) {
//   const year = date.getFullYear();
//   const month = date.getMonth();
//   const firstDay = new Date(year, month, 1);
//   const startDay = firstDay.getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const cells = [] as { label: string; inMonth: boolean }[];
//   for (let i = 0; i < startDay; i++) cells.push({ label: "", inMonth: false });
//   for (let d = 1; d <= daysInMonth; d++)
//     cells.push({ label: String(d), inMonth: true });
//   while (cells.length % 7 !== 0) cells.push({ label: "", inMonth: false });
//   return {
//     cells,
//     title: date.toLocaleString(undefined, { month: "long", year: "numeric" }),
//   };
// }

// export default async function CalendarPage() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return redirect("/sign-in");
//   const { cells, title } = buildMonthGrid();

//   return (
//     <DashboardLayout user={user}>
//       <div className="p-6 lg:p-8 space-y-6">
//         <h1 className="text-2xl font-bold text-white">Calendar</h1>
//         <Card className="bg-slate-800 border-slate-700">
//           <CardHeader>
//             <CardTitle className="text-white">{title}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-7 gap-2 text-xs sm:text-sm">
//               {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//                 <div key={d} className="text-slate-300 text-center py-2">
//                   {d}
//                 </div>
//               ))}
//               {cells.map((c, i) => (
//                 <div
//                   key={i}
//                   className={`min-h-[80px] rounded-md border border-slate-700 p-2 ${c.inMonth ? "bg-slate-700" : "bg-slate-800 opacity-60"}`}
//                 >
//                   <div className="text-slate-200 text-xs">{c.label}</div>
                  



//                 </div>
//               ))}
//             </div>
//             <div className="text-center text-slate-400 text-sm mt-6">
//               No scheduled posts yet
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// }



// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import DashboardLayout from "@/components/dashboard-layout";
// import { createClient } from "../../../../supabase/server";
// import { redirect } from "next/navigation";

// function buildMonthGrid(date = new Date()) {
//   const year = date.getFullYear();
//   const month = date.getMonth();
//   const firstDay = new Date(year, month, 1);
//   const startDay = firstDay.getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const cells = [] as { label: string; inMonth: boolean; date?: string }[];

//   for (let i = 0; i < startDay; i++) cells.push({ label: "", inMonth: false });

//   for (let d = 1; d <= daysInMonth; d++) {
//     const dateStr = new Date(year, month, d).toISOString().split("T")[0];
//     cells.push({ label: String(d), inMonth: true, date: dateStr });
//   }

//   while (cells.length % 7 !== 0) cells.push({ label: "", inMonth: false });

//   return {
//     cells,
//     title: date.toLocaleString(undefined, { month: "long", year: "numeric" }),
//   };
// }

// async function getScheduledPostCounts(userId: string) {
//   const supabase = await createClient();

//   const { data, error } = await supabase
//     .from("posts")
//     .select("scheduled_at")
//     .eq("user_id", userId)
//     .eq("status", "pending");

//   if (error) throw error;

//   const grouped: Record<string, number> = {};
//   data?.forEach((post) => {
//     if (post.scheduled_at) {
//       const date = new Date(post.scheduled_at).toISOString().split("T")[0];
//       grouped[date] = (grouped[date] || 0) + 1;
//     }
//   });

//   return grouped; // { "2025-09-12": 3, "2025-09-14": 5 }
// }

// export default async function CalendarPage() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) return redirect("/sign-in");

//   const { cells, title } = buildMonthGrid();
//   const counts = await getScheduledPostCounts(user.id);

//   return (
//     <DashboardLayout user={user}>
//       <div className="p-6 lg:p-8 space-y-6">
//         <h1 className="text-2xl font-bold text-white">Calendar</h1>
//         <Card className="bg-slate-800 border-slate-700">
//           <CardHeader>
//             <CardTitle className="text-white">{title}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-7 gap-2 text-xs sm:text-sm">
//               {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//                 <div key={d} className="text-slate-300 text-center py-2">
//                   {d}
//                 </div>
//               ))}
//               {cells.map((c, i) => (
//                 <div
//                   key={i}
//                   className={`min-h-[80px] rounded-md border border-slate-700 p-2 ${
//                     c.inMonth ? "bg-slate-700" : "bg-slate-800 opacity-60"
//                   }`}
//                 >
//                   <div className="text-slate-200 text-xs">{c.label}</div>
//                   {c.date && counts[c.date] && (
//                     <span className="text-xs font-bold text-blue-400">
//                       {counts[c.date]} posts
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {Object.keys(counts).length === 0 && (
//               <div className="text-center text-slate-400 text-sm mt-6">
//                 No scheduled posts yet
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// }

// app/dashboard/calendar/page.tsx

// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import DashboardLayout from "@/components/dashboard-layout";
// import { createClient } from "../../../../supabase/client";
// import { redirect } from "next/navigation";

// function buildMonthGrid(date = new Date()) {
//   const year = date.getFullYear();
//   const month = date.getMonth();
//   const firstDay = new Date(year, month, 1);
//   const startDay = firstDay.getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const cells: { label: string; inMonth: boolean; date?: string }[] = [];

//   for (let i = 0; i < startDay; i++) cells.push({ label: "", inMonth: false });

//   for (let d = 1; d <= daysInMonth; d++) {
//     const dateStr = new Date(year, month, d).toISOString().split("T")[0];
//     cells.push({ label: String(d), inMonth: true, date: dateStr });
//   }

//   while (cells.length % 7 !== 0) cells.push({ label: "", inMonth: false });

//   return {
//     cells,
//     title: date.toLocaleString(undefined, { month: "long", year: "numeric" }),
//   };
// }



// const handlePostSchedule=()=>{
//   console.log("post")


// }



// async function getScheduledPostCounts(userId: string) {
//   const supabase = createClient();

//   const { data, error } = await supabase
//     .from("posts")
//     .select("scheduled_at")
//     .eq("user_id", userId)
//     .eq("status", "pending");

//   if (error) throw error;

//   const grouped: Record<string, number> = {};
//   data?.forEach((post) => {
//     if (post.scheduled_at) {
//       const date = new Date(post.scheduled_at).toISOString().split("T")[0];
//       grouped[date] = (grouped[date] || 0) + 1;
//     }
//   });

//   return grouped;
// }

// async function getPostsByDate(userId: string, date: string) {
//   const supabase = createClient();

//   const { data, error } = await supabase
//     .from("posts")
//     .select("id, content, scheduled_at, platforms")
//     .eq("user_id", userId)
//     .eq("status", "pending");

//   if (error) throw error;

//   return data?.filter((p) => {
//     if (!p.scheduled_at) return false;
//     return new Date(p.scheduled_at).toISOString().split("T")[0] === date;
//   });
// }

// export default function CalendarPageWrapper() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const supabase = createClient();
//     supabase.auth.getUser().then(({ data }) => {
//       if (!data.user) {
//         redirect("/sign-in");
//       } else {
//         setUser(data.user);
//       }
//       setLoading(false);
//     });
//   }, []);

//   if (loading) return <div className="p-6 text-white">Loading...</div>;
//   if (!user) return null;

//   return <CalendarPage user={user} />;
// }

// function CalendarPage({ user }: { user: any }) {
//   const { cells, title } = buildMonthGrid();
//   const [counts, setCounts] = useState<Record<string, number>>({});
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [posts, setPosts] = useState<any[]>([]);

//   useEffect(() => {
//     getScheduledPostCounts(user.id).then(setCounts);
//   }, [user.id]);

//   useEffect(() => {
//     if (selectedDate) {
//       getPostsByDate(user.id, selectedDate).then((res) =>
//         setPosts(res || [])
//       );
//     }
//   }, [selectedDate, user.id]);

//   return (
//     <DashboardLayout user={user}>
//       <div className="p-6 lg:p-8 space-y-6">
//         <h1 className="text-2xl font-bold text-white">Calendar</h1>
//         <Card className="bg-slate-800 border-slate-700">
//           <CardHeader>
//             <CardTitle className="text-white">{title}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-7 gap-2 text-xs sm:text-sm">
//               {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//                 <div key={d} className="text-slate-300 text-center py-2">
//                   {d}
//                 </div>
//               ))}
//               {cells.map((c, i) => (
//                 <div
//                   key={i}
//                   className={`min-h-[80px] rounded-md border border-slate-700 p-2 cursor-pointer ${
//                     c.inMonth ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-800 opacity-60"
//                   }`}
//                   onClick={() => c.date && setSelectedDate(c.date)}
//                 >
//                   <div className="text-slate-200 text-xs">{c.label}</div>
//                   {c.date && counts[c.date] && (
//                     <span className="text-xs font-bold text-blue-400">
//                       {counts[c.date]} posts
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {Object.keys(counts).length === 0 && (
//               <div className="text-center text-slate-400 text-sm mt-6">
//                 No scheduled posts yet
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {selectedDate && (
//           <Card className="bg-slate-900 border-slate-700">
//             <CardHeader>
//               <CardTitle className="text-white">
//                 Posts on {selectedDate}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {posts.length === 0 ? (
//                 <div className="text-slate-400 text-sm">
//                   No posts scheduled for this date.
//                 </div>
//               ) : (
//                 posts.map((post) => (
//                   <div
//                     key={post.id}
//                     className="p-3 rounded-lg bg-slate-800 border border-slate-700"
//                   >
                 
//                     <p className="text-slate-400 mb-2 text-xs mt-1">
//                       Scheduled at:{" "}
//                       {new Date(post.scheduled_at).toLocaleTimeString()}
//                     </p>
//                     <p className="text-slate-200 text-sm">{post.content}</p>
//                     <div className="flex justify-between align-middle">

//                     <p className="text-blue-400 mt-3 text-xs">
//                       Platforms: {Array.isArray(post.platforms) ? post.platforms.join(", ") : post.platforms}
//                     </p>
//                     <div className=" flex gap-3">
//                       <button onClick={() => handleCancelSchedule(post.id)}className="flex justify-center min-w-[90px] items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-purple-600 text-white" >Cancel</button> 
//                       <button onClick={handlePostSchedule} className="flex min-w-[90px]  justify-center items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-purple-600 text-white">Post Now</button>


//                     </div>
//                     </div>



//                   </div>
//                 ))
//               )}
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }













// --------------------------------------------------------------------------------------




// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import DashboardLayout from "@/components/dashboard-layout";
// import { createClient } from "../../../../supabase/client";
// import { redirect } from "next/navigation";

// function buildMonthGrid(date = new Date()) {
//   const year = date.getFullYear();
//   const month = date.getMonth();
//   const firstDay = new Date(year, month, 1);
//   const startDay = firstDay.getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const cells: { label: string; inMonth: boolean; date?: string }[] = [];

//   for (let i = 0; i < startDay; i++) cells.push({ label: "", inMonth: false });

//   for (let d = 1; d <= daysInMonth; d++) {
//     const dateStr = new Date(year, month, d).toISOString().split("T")[0];
//     cells.push({ label: String(d), inMonth: true, date: dateStr });
//   }

//   while (cells.length % 7 !== 0) cells.push({ label: "", inMonth: false });

//   return {
//     cells,
//     title: date.toLocaleString(undefined, { month: "long", year: "numeric" }),
//   };
// }

// async function getScheduledPostCounts(userId: string) {
//   const supabase = createClient();

//   const { data, error } = await supabase
//     .from("posts")
//     .select("scheduled_at")
//     .eq("user_id", userId)
//     .eq("status", "pending");

//   if (error) throw error;

//   const grouped: Record<string, number> = {};
//   data?.forEach((post) => {
//     if (post.scheduled_at) {
//       const date = new Date(post.scheduled_at).toISOString().split("T")[0];
//       grouped[date] = (grouped[date] || 0) + 1;
//     }
//   });

//   return grouped;
// }

// async function getPostsByDate(userId: string, date: string) {
//   const supabase = createClient();

//   const { data, error } = await supabase
//     .from("posts")
//     .select("id, content, scheduled_at, platforms")
//     .eq("user_id", userId)
//     .eq("status", "pending");

//   if (error) throw error;

//   return data?.filter((p) => {
//     if (!p.scheduled_at) return false;
//     return new Date(p.scheduled_at).toISOString().split("T")[0] === date;
//   });
// }

// export default function CalendarPageWrapper() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const supabase = createClient();
//     supabase.auth.getUser().then(({ data }) => {
//       if (!data.user) {
//         redirect("/sign-in");
//       } else {
//         setUser(data.user);
//       }
//       setLoading(false);
//     });
//   }, []);

//   if (loading) return <div className="p-6 text-white">Loading...</div>;
//   if (!user) return null;

//   return <CalendarPage user={user} />;
// }

// function CalendarPage({ user }: { user: any }) {
//   const { cells, title } = buildMonthGrid();
//   const [counts, setCounts] = useState<Record<string, number>>({});
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [posts, setPosts] = useState<any[]>([]);

//   // Fetch counts
//   useEffect(() => {
//     getScheduledPostCounts(user.id).then(setCounts);
//   }, [user.id]);

//   // Fetch posts for selected date
//   useEffect(() => {
//     if (selectedDate) {
//       getPostsByDate(user.id, selectedDate).then((res) =>
//         setPosts(res || [])
//       );
//     }
//   }, [selectedDate, user.id]);

//   // Cancel schedule
//   const handleCancelSchedule = async (postId: string) => {
//     if (!confirm("Are you sure you want to cancel this scheduled post?")) return;

//     const supabase = createClient();
//     const { error } = await supabase
//       .from("posts")
//       .update({ status: "canceled" })
//       .eq("id", postId)
//       .eq("user_id", user.id);

//     if (error) {
//       alert("Failed to cancel post");
//     } else {
//       alert("Post canceled");
//       if (selectedDate) {
//         getPostsByDate(user.id, selectedDate).then((res) =>
//           setPosts(res || [])
//         );
//         getScheduledPostCounts(user.id).then(setCounts);
//       }
//     }
//   };

//   // Post now
//   const handlePostSchedule = async (postId: string) => {
//     if (!confirm("Do you want to post this now?")) return;

//     const supabase = createClient();
//     const { error } = await supabase
//       .from("posts")
//       .update({ status: "posted", scheduled_at: null })
//       .eq("id", postId)
//       .eq("user_id", user.id);

//     if (error) {
//       alert("Failed to post");
//     } else {
//       alert("Post published");
//       if (selectedDate) {
//         getPostsByDate(user.id, selectedDate).then((res) =>
//           setPosts(res || [])
//         );
//         getScheduledPostCounts(user.id).then(setCounts);
//       }
//     }
//   };

//   return (
//     <DashboardLayout user={user}>
//       <div className="p-6 lg:p-8 space-y-6">
//         <h1 className="text-2xl font-bold text-white">Calendar</h1>
//         <Card className="bg-slate-800 border-slate-700">
//           <CardHeader>
//             <CardTitle className="text-white">{title}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-7 gap-2 text-xs sm:text-sm">
//               {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//                 <div key={d} className="text-slate-300 text-center py-2">
//                   {d}
//                 </div>
//               ))}
//               {cells.map((c, i) => (
//                 <div
//                   key={i}
//                   className={`min-h-[80px] rounded-md border border-slate-700 p-2 cursor-pointer ${
//                     c.inMonth ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-800 opacity-60"
//                   }`}
//                   onClick={() => c.date && setSelectedDate(c.date)}
//                 >
//                   <div className="text-slate-200 text-xs">{c.label}</div>
//                   {c.date && counts[c.date] && (
//                     <span className="text-xs font-bold text-blue-400">
//                       {counts[c.date]} posts
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {Object.keys(counts).length === 0 && (
//               <div className="text-center text-slate-400 text-sm mt-6">
//                 No scheduled posts yet
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {selectedDate && (
//           <Card className="bg-slate-900 border-slate-700">
//             <CardHeader>
//               <CardTitle className="text-white">
//                 Posts on {selectedDate}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {posts.length === 0 ? (
//                 <div className="text-slate-400 text-sm">
//                   No posts scheduled for this date.
//                 </div>
//               ) : (
//                 posts.map((post) => (
//                   <div
//                     key={post.id}
//                     className="p-3 rounded-lg bg-slate-800 border border-slate-700"
//                   >
//                     <p className="text-slate-400 mb-2 text-xs mt-1">
//                       Scheduled at:{" "}
//                       {new Date(post.scheduled_at).toLocaleTimeString()}
//                     </p>
//                     <p className="text-slate-200 text-sm">{post.content}</p>
//                     <div className="flex justify-between align-middle">
//                       <p className="text-blue-400 mt-3 text-xs">
//                         Platforms:{" "}
//                         {Array.isArray(post.platforms)
//                           ? post.platforms.join(", ")
//                           : post.platforms}
//                       </p>
//                       <div className="flex gap-3">
//                         <button
//                           onClick={() => handleCancelSchedule(post.id)}
//                           className="flex justify-center min-w-[90px] items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-red-600 hover:bg-red-700 text-white"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           onClick={() => handlePostSchedule(post.id)}
//                           className="flex min-w-[90px] justify-center items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-green-600 hover:bg-green-700 text-white"
//                         >
//                           Post Now
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }




// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import DashboardLayout from "@/components/dashboard-layout";
// import { createClient } from "../../../../supabase/client";
// import { redirect } from "next/navigation";

// function buildMonthGrid(date = new Date()) {
//   const year = date.getFullYear();
//   const month = date.getMonth();
//   const firstDay = new Date(year, month, 1);
//   const startDay = firstDay.getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const cells: { label: string; inMonth: boolean; date?: string }[] = [];

//   for (let i = 0; i < startDay; i++) cells.push({ label: "", inMonth: false });
//   for (let d = 1; d <= daysInMonth; d++) {
//     const dateStr = new Date(year, month, d).toISOString().split("T")[0];
//     cells.push({ label: String(d), inMonth: true, date: dateStr });
//   }
//   while (cells.length % 7 !== 0) cells.push({ label: "", inMonth: false });

//   return {
//     cells,
//     title: date.toLocaleString(undefined, { month: "long", year: "numeric" }),
//   };
// }

// async function getScheduledPostCounts(userId: string) {
//   const supabase = createClient();
//   const { data, error } = await supabase
//     .from("posts")
//     .select("scheduled_at, status")
//     .eq("user_id", userId);

//   if (error) throw error;

//   const grouped: Record<string, number> = {};
//   data?.forEach((post) => {
//     if (post.scheduled_at && post.status === "pending") {
//       const date = new Date(post.scheduled_at).toISOString().split("T")[0];
//       grouped[date] = (grouped[date] || 0) + 1;
//     }
//   });

//   return grouped;
// }

// async function getPostsByDate(userId: string, date: string) {
//   const supabase = createClient();
//   const { data, error } = await supabase
//     .from("posts")
//     .select("id, content, scheduled_at, status, platforms, published_at")
//     .eq("user_id", userId);

//   if (error) throw error;

//   return data?.filter((p) => {
//     if (!p.scheduled_at) return false;
//     return new Date(p.scheduled_at).toISOString().split("T")[0] === date;
//   });
// }

// export default function CalendarPageWrapper() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const supabase = createClient();
//     supabase.auth.getUser().then(({ data }) => {
//       if (!data.user) {
//         redirect("/sign-in");
//       } else {
//         setUser(data.user);
//       }
//       setLoading(false);
//     });
//   }, []);

//   if (loading) return <div className="p-6 text-white">Loading...</div>;
//   if (!user) return null;

//   return <CalendarPage user={user} />;
// }

// function CalendarPage({ user }: { user: any }) {
//   const { cells, title } = buildMonthGrid();
//   const [counts, setCounts] = useState<Record<string, number>>({});
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [posts, setPosts] = useState<any[]>([]);

//   // Fetch counts
//   useEffect(() => {
//     getScheduledPostCounts(user.id).then(setCounts);
//   }, [user.id]);

//   // Fetch posts for selected date
//   useEffect(() => {
//     if (selectedDate) {
//       getPostsByDate(user.id, selectedDate).then((res) =>
//         setPosts(res || [])
//       );
//     }
//   }, [selectedDate, user.id]);

//   const handleCancelSchedule = async (postId: string) => {
//   if (!confirm("Are you sure you want to cancel this scheduled post?")) return;

//   const supabase = createClient();
//   const { error } = await supabase
//     .from("posts")
//     .update({ status: "failed", scheduled_at: null })
//     .eq("id", postId)
//     .eq("user_id", user.id);

//   if (error) {
//     alert("Failed to cancel post");
//   } else {
//     alert("Post canceled");
//     refreshPosts();
//   }
// };

//  // Post now
// const handlePostSchedule = async (post: any) => {
//   if (!post.content || !post.platforms || post.platforms.length === 0) {
//     alert("Content or platforms missing");
//     return;
//   }

//   // Ensure hashtags is always an array
//   const hashtagsArray = Array.isArray(post.hashtags) ? post.hashtags : [];

//   const res = await fetch("/api/composer", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       type: "publish",
//       content: post.content,
//       hashtags: hashtagsArray,
//       platforms: post.platforms,
//       publishNow: true,
//       scheduleAt: null,
//     }),
//   });

//   const data = await res.json();
//   if (!res.ok) {
//     alert(data.error || "Failed to post");
//   } else {
//     alert("Post published successfully");
//     // Update post status in Supabase
//     const supabase = createClient();
//     await supabase
//       .from("posts")
//       .update({ status: "published", scheduled_at: null })
//       .eq("id", post.id);

//     refreshPosts();
//   }
// };

// const refreshPosts = async () => {
//   if (!selectedDate) return;
//   const postsData = await getPostsByDate(user.id, selectedDate);
//   setPosts(postsData || []);
//   const countsData = await getScheduledPostCounts(user.id);
//   setCounts(countsData);
// };

//   return (
//     <DashboardLayout user={user}>
//       <div className="p-6 lg:p-8 space-y-6">
//         <h1 className="text-2xl font-bold text-white">Calendar</h1>

//         {/* Calendar */}
//         <Card className="bg-slate-800 border-slate-700">
//           <CardHeader>
//             <CardTitle className="text-white">{title}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-7 gap-2 text-xs sm:text-sm">
//               {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//                 <div key={d} className="text-slate-300 text-center py-2">{d}</div>
//               ))}
//               {cells.map((c, i) => (
//                 <div
//                   key={i}
//                   className={`min-h-[80px] rounded-md border border-slate-700 p-2 cursor-pointer ${
//                     c.inMonth ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-800 opacity-60"
//                   }`}
//                   onClick={() => c.date && setSelectedDate(c.date)}
//                 >
//                   <div className="text-slate-200 text-xs">{c.label}</div>
//                   {c.date && counts[c.date] && (
//                     <span className="text-xs font-bold text-blue-400">{counts[c.date]} posts</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//             {Object.keys(counts).length === 0 && (
//               <div className="text-center text-slate-400 text-sm mt-6">
//                 No scheduled posts yet
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Posts for selected date */}
//         {selectedDate && (
//           <Card className="bg-slate-900 border-slate-700">
//             <CardHeader>
//               <CardTitle className="text-white">Posts on {selectedDate}</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {posts.length === 0 ? (
//                 <div className="text-slate-400 text-sm">No posts scheduled for this date.</div>
//               ) : (
//                 posts.map((post) => (
//                   <div
//                     key={post.id}
//                     className="p-3 rounded-lg bg-slate-800 border border-slate-700"
//                   >
//                     <p className="text-slate-400 mb-2 text-xs mt-1">
//                       Scheduled at:{" "}
//                       {post.scheduled_at ? new Date(post.scheduled_at).toLocaleTimeString() : "-"}
//                     </p>
//                     <p className="text-slate-200 text-sm">{post.content}</p>
//                     <div className="flex justify-between items-center mt-3">
//                       <p className="text-blue-400 text-xs">
//                         Platforms: {Array.isArray(post.platforms) ? post.platforms.join(", ") : post.platforms}
//                       </p>
//                       <div className="flex gap-3">
//                         {post.status === "published" ? (
//                           <span className="text-green-400 font-bold px-3 py-2 rounded-lg bg-slate-700">Posted</span>
//                         ) : (
//                           <>
//                             <button
//                               onClick={() => handleCancelSchedule(post.id)}
//                               className="flex justify-center min-w-[90px] items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-red-600 hover:bg-red-700 text-white"
//                             >
//                               Cancel
//                             </button>
//                             <button
//                               onClick={() => handlePostSchedule(post)}
//                               className="flex min-w-[90px] justify-center items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-green-600 hover:bg-green-700 text-white"
//                             >
//                               Post Now
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }
// ----------------------------------------------------------------------


"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard-layout";
import { createClient } from "../../../../supabase/client";
import { redirect } from "next/navigation";

function buildMonthGrid(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { label: string; inMonth: boolean; date?: string }[] = [];

  for (let i = 0; i < startDay; i++) cells.push({ label: "", inMonth: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toISOString().split("T")[0];
    cells.push({ label: String(d), inMonth: true, date: dateStr });
  }
  while (cells.length % 7 !== 0) cells.push({ label: "", inMonth: false });

  return {
    cells,
    title: date.toLocaleString(undefined, { month: "long", year: "numeric" }),
  };
}

async function getScheduledPostCounts(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("scheduled_at, status")
    .eq("user_id", userId);

  if (error) throw error;

  const grouped: Record<string, number> = {};
  data?.forEach((post) => {
    if (post.scheduled_at && post.status === "pending") {
      const date = new Date(post.scheduled_at).toISOString().split("T")[0];
      grouped[date] = (grouped[date] || 0) + 1;
    }
  });

  return grouped;
}

async function getPostsByDate(userId: string, date: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, content, scheduled_at, status, platforms, hashtags, published_at")
    .eq("user_id", userId);

  if (error) throw error;

  return data?.filter((p) => {
    if (!p.scheduled_at) return false;
    return new Date(p.scheduled_at).toISOString().split("T")[0] === date;
  });
}

export default function CalendarPageWrapper() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        redirect("/sign-in");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (!user) return null;

  return <CalendarPage user={user} />;
}

function CalendarPage({ user }: { user: any }) {
  const { cells, title } = buildMonthGrid();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const postListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getScheduledPostCounts(user.id).then(setCounts);
  }, [user.id]);

  useEffect(() => {
    if (selectedDate) {
      getPostsByDate(user.id, selectedDate).then((res) => {
        setPosts(res || []);
        // Scroll to post list
        setTimeout(() => {
          postListRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      });
    }
  }, [selectedDate, user.id]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCancelSchedule = async (postId: string) => {
    if (!confirm("Are you sure you want to cancel this scheduled post?")) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("posts")
      .update({ status: "failed", scheduled_at: null })
      .eq("id", postId)
      .eq("user_id", user.id);

    if (error) {
      showToast("Failed to cancel post");
    } else {
      showToast("Post canceled");
      refreshPosts();
    }
  };

  const handlePostSchedule = async (post: any) => {
    if (!post.content || !post.platforms || post.platforms.length === 0) {
      showToast("Content or platforms missing");
      return;
    }

    // Ensure hashtags is always an array of strings
    const hashtagsArray = Array.isArray(post.hashtags)
  ? post.hashtags.map((h: any) => String(h))
  : [];


    const res = await fetch("/api/composer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "publish",
        content: post.content,
        hashtags: hashtagsArray,
        platforms: post.platforms,
        publishNow: true,
        scheduleAt: null,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Failed to post");
    } else {
      showToast("Post has been uploaded!");

      const supabase = createClient();
      await supabase
        .from("posts")
        .update({ status: "published", scheduled_at: null })
        .eq("id", post.id);

      // Remove post from list
      setPosts((prev) => prev.filter((p) => p.id !== post.id));

      const countsData = await getScheduledPostCounts(user.id);
      setCounts(countsData);
    }
  };

  const refreshPosts = async () => {
    if (!selectedDate) return;
    const postsData = await getPostsByDate(user.id, selectedDate);
    setPosts(postsData || []);
    const countsData = await getScheduledPostCounts(user.id);
    setCounts(countsData);
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl font-bold text-white">Calendar</h1>

        {/* Calendar */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-xs sm:text-sm">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-slate-300 text-center py-2">{d}</div>
              ))}
              {cells.map((c, i) => (
                <div
                  key={i}
                  className={`min-h-[80px] rounded-md border border-slate-700 p-2 cursor-pointer ${
                    c.inMonth ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-800 opacity-60"
                  }`}
                  onClick={() => c.date && setSelectedDate(c.date)}
                >
                  <div className="text-slate-200 text-xs">{c.label}</div>
                  {c.date && counts[c.date] && (
                    <span className="text-xs font-bold text-blue-400">{counts[c.date]} posts</span>
                  )}
                </div>
              ))}
            </div>
            {Object.keys(counts).length === 0 && (
              <div className="text-center text-slate-400 text-sm mt-6">
                No scheduled posts yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Posts for selected date */}
        {selectedDate && (
          <div ref={postListRef}>
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Posts on {selectedDate}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-slate-400 text-sm">No posts scheduled for this date.</div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-3 rounded-lg bg-slate-800 border border-slate-700"
                    >
                      <p className="text-slate-400 mb-2 text-xs mt-1">
                        Scheduled at:{" "}
                        {post.scheduled_at ? new Date(post.scheduled_at).toLocaleTimeString() : "-"}
                      </p>
                      <p className="text-slate-200 text-sm">{post.content}</p>
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-blue-400 text-xs">
                          Platforms: {Array.isArray(post.platforms) ? post.platforms.join(", ") : post.platforms}
                        </p>
                        <div className="flex gap-3">
                          {post.status === "published" ? (
                            <span className="text-green-400 font-bold px-3 py-2 rounded-lg bg-slate-700">Posted</span>
                          ) : (
                            <>
                              <button
                                onClick={() => handleCancelSchedule(post.id)}
                                className="flex justify-center min-w-[90px] items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-red-600 hover:bg-red-700 text-white"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handlePostSchedule(post)}
                                className="flex min-w-[90px] justify-center items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-green-600 hover:bg-green-700 text-white"
                              >
                                Post Now
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-500">
            {toastMessage}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
