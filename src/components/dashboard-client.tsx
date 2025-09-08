"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Target,
  Zap,
  Star,
  Activity,
  Bookmark,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../supabase/client";

interface DashboardClientProps {
  user: any;
}

interface DashboardStats {
  totalPosts: number;
  scheduledPosts: number;
  totalTemplates: number;
  favoriteTemplates: number;
  totalImpressions: number;
  totalEngagement: number;
  growthRate: number;
  activeConnections: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  platform?: string;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    scheduledPosts: 0,
    totalTemplates: 0,
    favoriteTemplates: 0,
    totalImpressions: 0,
    totalEngagement: 0,
    growthRate: 0,
    activeConnections: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch posts stats
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id);

      if (postsError) throw postsError;

      // Fetch templates stats
      const { data: templates, error: templatesError } = await supabase
        .from("templates")
        .select("*")
        .eq("user_id", user.id);

      if (templatesError) throw templatesError;

      // Fetch social accounts
      const { data: accounts, error: accountsError } = await supabase
        .from("social_accounts")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (accountsError) throw accountsError;

      // Fetch analytics data
      const { data: analytics, error: analyticsError } = await supabase
        .from("analytics_data")
        .select("*")
        .eq("user_id", user.id)
        .gte("date_recorded", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (analyticsError) throw analyticsError;

      // Calculate stats
      const totalPosts = posts?.length || 0;
      const scheduledPosts = posts?.filter(p => p.status === 'scheduled').length || 0;
      const totalTemplates = templates?.length || 0;
      const favoriteTemplates = templates?.filter(t => t.is_favorite).length || 0;
      const activeConnections = accounts?.length || 0;

      // Calculate analytics
      const totalImpressions = analytics?.reduce((sum, a) => 
        a.metric_type === 'impressions' ? sum + a.metric_value : sum, 0) || 0;
      const totalEngagement = analytics?.reduce((sum, a) => 
        ['likes', 'comments', 'shares', 'clicks'].includes(a.metric_type) ? sum + a.metric_value : sum, 0) || 0;

      setStats({
        totalPosts,
        scheduledPosts,
        totalTemplates,
        favoriteTemplates,
        totalImpressions,
        totalEngagement,
        growthRate: 12.5, // Mock growth rate
        activeConnections,
      });

      // Generate recent activity
      const activities: RecentActivity[] = [
        ...(posts?.slice(0, 3).map(post => ({
          id: post.id,
          type: 'post',
          title: 'Post Published',
          description: post.content.substring(0, 50) + '...',
          timestamp: post.created_at,
          platform: post.platforms[0],
        })) || []),
        ...(templates?.slice(0, 2).map(template => ({
          id: template.id,
          type: 'template',
          title: 'Template Created',
          description: template.title,
          timestamp: template.created_at,
        })) || []),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setRecentActivity(activities);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Create Post",
      description: "Compose a new social media post",
      icon: Plus,
      href: "/dashboard/composer",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Create Template",
      description: "Save a reusable template",
      icon: FileText,
      href: "/dashboard/templates",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Schedule Posts",
      description: "Plan your content calendar",
      icon: Calendar,
      href: "/dashboard/calendar",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "View Analytics",
      description: "Check your performance",
      icon: BarChart3,
      href: "/dashboard/analytics",
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  const statCards = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
      change: "+12%",
      changeType: "positive" as const,
      icon: FileText,
      description: "Published posts",
    },
    {
      title: "Scheduled",
      value: stats.scheduledPosts,
      change: "+5",
      changeType: "positive" as const,
      icon: Clock,
      description: "Upcoming posts",
    },
    {
      title: "Templates",
      value: stats.totalTemplates,
      change: `${stats.favoriteTemplates} favorites`,
      changeType: "neutral" as const,
      icon: Bookmark,
      description: "Saved templates",
    },
    {
      title: "Connections",
      value: stats.activeConnections,
      change: "All active",
      changeType: "positive" as const,
      icon: Users,
      description: "Social accounts",
    },
    {
      title: "Impressions",
      value: stats.totalImpressions.toLocaleString(),
      change: "+15.3%",
      changeType: "positive" as const,
      icon: Eye,
      description: "Last 30 days",
    },
    {
      title: "Engagement",
      value: stats.totalEngagement.toLocaleString(),
      change: "+8.2%",
      changeType: "positive" as const,
      icon: Heart,
      description: "Likes, comments, shares",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "post":
        return FileText;
      case "template":
        return Bookmark;
      case "analytics":
        return BarChart3;
      default:
        return Activity;
    }
  };

  const getPlatformEmoji = (platform: string) => {
    const emojis: { [key: string]: string } = {
      facebook: "📘",
      instagram: "📷",
      twitter: "🐦",
      linkedin: "💼",
      tiktok: "🎵",
      youtube: "📺",
    };
    return emojis[platform] || "📱";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 lg:p-8 flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user.user_metadata?.full_name || user.email}!
        </h1>
        <p className="text-slate-400">
          Here's what's happening with your social media presence today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-slate-400" />
                    <Badge
                      variant={
                        stat.changeType === "positive"
                          ? "default"
                          : stat.changeType === "negative"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        stat.changeType === "positive"
                          ? "bg-green-600 hover:bg-green-700"
                          : stat.changeType === "negative"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-slate-600 hover:bg-slate-700"
                      }
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.title}</p>
                    <p className="text-xs text-slate-500">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">No recent activity</p>
                  <p className="text-sm text-slate-500">
                    Start creating posts and templates to see activity here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-slate-600">
                          <Icon className="w-4 h-4 text-slate-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">
                              {activity.title}
                            </p>
                            {activity.platform && (
                              <span className="text-sm">
                                {getPlatformEmoji(activity.platform)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 truncate">
                            {activity.description}
                          </p>
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <div>
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Growth Rate</span>
                  <Badge className="bg-green-600 hover:bg-green-700">
                    +{stats.growthRate}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Engagement Rate</span>
                  <span className="text-white font-medium">
                    {stats.totalImpressions > 0 
                      ? ((stats.totalEngagement / stats.totalImpressions) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Avg. Daily Posts</span>
                  <span className="text-white font-medium">
                    {(stats.totalPosts / 30).toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Template Usage</span>
                  <span className="text-white font-medium">
                    {stats.totalTemplates > 0 ? "Active" : "None"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/dashboard/templates">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Manage Templates
                  </Button>
                </Link>
                <Link href="/dashboard/calendar">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Content Calendar
                  </Button>
                </Link>
                <Link href="/dashboard/analytics">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/team">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Team Management
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}