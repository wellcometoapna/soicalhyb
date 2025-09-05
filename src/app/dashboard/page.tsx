import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/dashboard-layout";
import {
  InfoIcon,
  Bot,
  Image,
  Calendar,
  Sparkles,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  BarChart3,
  TrendingUp,
  Eye,
  MousePointer,
  Heart,
  Share2,
  Users,
  Shield,
  CheckCircle,
  Clock,
  MessageSquare,
  UserPlus,
  Upload,
  Search,
  Filter,
  Edit3,
  Tag,
  Grid3X3,
  List,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <DashboardLayout user={user}>
      <div className="p-6 lg:p-8">
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Dashboard Overview
          </h1>
          <div className="bg-purple-600/20 text-sm p-4 rounded-lg text-purple-300 flex gap-2 items-center border border-purple-600/30">
            <InfoIcon size="16" />
            <span>
              Welcome to your AI-powered social media management dashboard
            </span>
          </div>
        </header>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Posts",
              value: "142",
              change: "+12%",
              icon: MessageSquare,
              color: "text-blue-400",
            },
            {
              label: "Followers",
              value: "12.4K",
              change: "+8%",
              icon: Users,
              color: "text-green-400",
            },
            {
              label: "Engagement",
              value: "4.2%",
              change: "+15%",
              icon: Heart,
              color: "text-pink-400",
            },
            {
              label: "Reach",
              value: "45.2K",
              change: "+22%",
              icon: Eye,
              color: "text-purple-400",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">
                        {stat.value}
                      </p>
                      <p className="text-green-400 text-sm flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI Post Composer */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-400" />
                Quick Post Composer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-blue-600 text-white">
                  <Facebook className="w-3 h-3 mr-1" />
                  Facebook
                </Badge>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <Instagram className="w-3 h-3 mr-1" />
                  Instagram
                </Badge>
                <Badge className="bg-blue-700 text-white">
                  <Linkedin className="w-3 h-3 mr-1" />
                  LinkedIn
                </Badge>
              </div>
              <Textarea
                placeholder="What's on your mind? Let AI help you craft the perfect post..."
                className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                defaultValue="🚀 Exciting news! We're launching our new AI-powered social media management platform."
              />
              <div className="flex gap-2">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white flex-1">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Caption
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "Post published",
                    platform: "Instagram",
                    time: "2 hours ago",
                    status: "success",
                  },
                  {
                    action: "Post scheduled",
                    platform: "Facebook",
                    time: "4 hours ago",
                    status: "pending",
                  },
                  {
                    action: "Media uploaded",
                    platform: "Library",
                    time: "6 hours ago",
                    status: "success",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.status === "success"
                            ? "bg-green-400"
                            : "bg-yellow-400"
                        }`}
                      />
                      <div>
                        <p className="text-white text-sm font-medium">
                          {activity.action}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {activity.platform}
                        </p>
                      </div>
                    </div>
                    <span className="text-slate-400 text-xs">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Posts */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Upcoming Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    content: "New product launch announcement...",
                    platform: "LinkedIn",
                    time: "Today, 3:00 PM",
                    status: "scheduled",
                  },
                  {
                    content: "Behind the scenes content...",
                    platform: "Instagram",
                    time: "Tomorrow, 10:00 AM",
                    status: "scheduled",
                  },
                  {
                    content: "Weekly tips and tricks...",
                    platform: "Facebook",
                    time: "Friday, 2:00 PM",
                    status: "draft",
                  },
                ].map((post, index) => (
                  <div key={index} className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-white text-sm font-medium truncate flex-1">
                        {post.content}
                      </p>
                      <Badge
                        className={`ml-2 text-xs ${
                          post.status === "scheduled"
                            ? "bg-blue-600 text-white"
                            : "bg-yellow-600 text-white"
                        }`}
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs">
                        {post.platform}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {post.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-700 rounded-lg">
                    <p className="text-2xl font-bold text-white">2.4M</p>
                    <p className="text-slate-400 text-sm">Impressions</p>
                    <p className="text-green-400 text-xs flex items-center justify-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +12%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-slate-700 rounded-lg">
                    <p className="text-2xl font-bold text-white">1.8M</p>
                    <p className="text-slate-400 text-sm">Reach</p>
                    <p className="text-green-400 text-xs flex items-center justify-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +8%
                    </p>
                  </div>
                </div>
                <div className="h-24 bg-slate-700 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <BarChart3 className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-xs">Chart visualization</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
