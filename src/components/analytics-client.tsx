"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Target,
  Calendar,
  Download,
  RefreshCw,
  Globe,
  Camera,
  Linkedin,
  Bird,
} from "lucide-react";
import { createClient } from "../../supabase/client";

interface AnalyticsClientProps {
  user: any;
}

interface AnalyticsData {
  platform: string;
  metric_type: string;
  metric_value: number;
  date_recorded: string;
  additional_data: any;
}

interface PlatformStats {
  platform: string;
  impressions: number;
  engagement: number;
  clicks: number;
  followers: number;
  growth: number;
}

export default function AnalyticsClient({ user }: AnalyticsClientProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const platforms = [
    { key: "all", name: "All Platforms", icon: Globe },
    { key: "facebook", name: "Facebook", icon: Globe },
    { key: "instagram", name: "Instagram", icon: Camera },
    { key: "linkedin", name: "LinkedIn", icon: Linkedin },
    { key: "twitter", name: "Twitter/X", icon: Bird },
  ];

  const periods = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 90 days" },
    { value: "365", label: "Last year" },
  ];

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod, selectedPlatform]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(selectedPeriod));

      let query = supabase
        .from("analytics_data")
        .select("*")
        .eq("user_id", user.id)
        .gte("date_recorded", startDate.toISOString().split("T")[0])
        .order("date_recorded", { ascending: false });

      if (selectedPlatform !== "all") {
        query = query.eq("platform", selectedPlatform);
      }

      const { data, error } = await query;

      if (error) throw error;

      setAnalyticsData(data || []);

      // Process platform stats
      const stats = processPlatformStats(data || []);
      setPlatformStats(stats);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      // Generate mock data for demo purposes
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockStats: PlatformStats[] = [
      {
        platform: "facebook",
        impressions: 15420,
        engagement: 1240,
        clicks: 320,
        followers: 2850,
        growth: 12.5,
      },
      {
        platform: "instagram",
        impressions: 22100,
        engagement: 2180,
        clicks: 450,
        followers: 4200,
        growth: 18.3,
      },
      {
        platform: "linkedin",
        impressions: 8900,
        engagement: 890,
        clicks: 180,
        followers: 1650,
        growth: 8.7,
      },
      {
        platform: "twitter",
        impressions: 12300,
        engagement: 980,
        clicks: 220,
        followers: 2100,
        growth: -2.1,
      },
    ];

    if (selectedPlatform !== "all") {
      setPlatformStats(
        mockStats.filter((s) => s.platform === selectedPlatform),
      );
    } else {
      setPlatformStats(mockStats);
    }
  };

  const processPlatformStats = (data: AnalyticsData[]): PlatformStats[] => {
    const platformMap = new Map<string, PlatformStats>();

    data.forEach((item) => {
      if (!platformMap.has(item.platform)) {
        platformMap.set(item.platform, {
          platform: item.platform,
          impressions: 0,
          engagement: 0,
          clicks: 0,
          followers: 0,
          growth: 0,
        });
      }

      const stats = platformMap.get(item.platform)!;

      switch (item.metric_type) {
        case "impressions":
          stats.impressions += item.metric_value;
          break;
        case "likes":
        case "comments":
        case "shares":
          stats.engagement += item.metric_value;
          break;
        case "clicks":
          stats.clicks += item.metric_value;
          break;
        case "followers":
          stats.followers = item.metric_value;
          break;
      }
    });

    return Array.from(platformMap.values());
  };

  const getTotalStats = () => {
    return platformStats.reduce(
      (totals, platform) => ({
        impressions: totals.impressions + platform.impressions,
        engagement: totals.engagement + platform.engagement,
        clicks: totals.clicks + platform.clicks,
        followers: totals.followers + platform.followers,
      }),
      { impressions: 0, engagement: 0, clicks: 0, followers: 0 },
    );
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = platforms.find((p) => p.key === platform);
    return platformData?.icon || Globe;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const totalStats = getTotalStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 lg:p-8 flex items-center justify-center">
        <div className="text-white">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-slate-400 text-sm">
            Track your social media performance and engagement
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {periods.map((period) => (
                <SelectItem
                  key={period.value}
                  value={period.value}
                  className="text-white"
                >
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {platforms.map((platform) => (
                <SelectItem
                  key={platform.key}
                  value={platform.key}
                  className="text-white"
                >
                  {platform.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={fetchAnalyticsData}
            variant="outline"
            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Impressions</p>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(totalStats.impressions)}
                </p>
              </div>
              <div className="p-3 bg-blue-600 rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">+12.5%</span>
              <span className="text-sm text-slate-400">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Engagement</p>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(totalStats.engagement)}
                </p>
              </div>
              <div className="p-3 bg-pink-600 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">+8.3%</span>
              <span className="text-sm text-slate-400">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Clicks</p>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(totalStats.clicks)}
                </p>
              </div>
              <div className="p-3 bg-green-600 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">+15.7%</span>
              <span className="text-sm text-slate-400">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Followers</p>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(totalStats.followers)}
                </p>
              </div>
              <div className="p-3 bg-purple-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">+6.2%</span>
              <span className="text-sm text-slate-400">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <div className="mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Platform Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {platformStats.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">No analytics data available</p>
                <p className="text-sm text-slate-500">
                  Connect your social media accounts and start posting to see
                  analytics
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {platformStats.map((platform) => {
                  const PlatformIcon = getPlatformIcon(platform.platform);
                  const engagementRate =
                    platform.impressions > 0
                      ? (
                          (platform.engagement / platform.impressions) *
                          100
                        ).toFixed(1)
                      : "0";

                  return (
                    <div
                      key={platform.platform}
                      className="p-4 rounded-lg bg-slate-700/50 border border-slate-600"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-600 rounded-lg">
                            <PlatformIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white capitalize">
                              {platform.platform}
                            </h3>
                            <p className="text-sm text-slate-400">
                              {formatNumber(platform.followers)} followers
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={
                            platform.growth >= 0
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                          }
                        >
                          {platform.growth >= 0 ? "+" : ""}
                          {platform.growth.toFixed(1)}%
                        </Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-white">
                            {formatNumber(platform.impressions)}
                          </p>
                          <p className="text-xs text-slate-400">Impressions</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-white">
                            {formatNumber(platform.engagement)}
                          </p>
                          <p className="text-xs text-slate-400">Engagement</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-white">
                            {formatNumber(platform.clicks)}
                          </p>
                          <p className="text-xs text-slate-400">Clicks</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-white">
                            {engagementRate}%
                          </p>
                          <p className="text-xs text-slate-400">
                            Engagement Rate
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-slate-700 text-slate-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="engagement"
            className="data-[state=active]:bg-slate-700 text-slate-200"
          >
            Engagement
          </TabsTrigger>
          <TabsTrigger
            value="audience"
            className="data-[state=active]:bg-slate-700 text-slate-200"
          >
            Audience
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="data-[state=active]:bg-slate-700 text-slate-200"
          >
            Content Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                    <p>Engagement chart would go here</p>
                    <p className="text-sm">
                      Connect analytics API for real-time data
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Top Performing Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50"
                    >
                      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                        {i}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">
                          Sample post content #{i}
                        </p>
                        <p className="text-xs text-slate-400">
                          {1000 - i * 100} engagements
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Engagement Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 rounded-lg bg-slate-700/50">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-white">
                    {formatNumber(Math.floor(totalStats.engagement * 0.6))}
                  </p>
                  <p className="text-sm text-slate-400">Likes</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-700/50">
                  <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-white">
                    {formatNumber(Math.floor(totalStats.engagement * 0.2))}
                  </p>
                  <p className="text-sm text-slate-400">Comments</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-700/50">
                  <Share2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-white">
                    {formatNumber(Math.floor(totalStats.engagement * 0.15))}
                  </p>
                  <p className="text-sm text-slate-400">Shares</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-700/50">
                  <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-white">
                    {formatNumber(totalStats.clicks)}
                  </p>
                  <p className="text-sm text-slate-400">Clicks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Audience Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">
                  Audience analytics coming soon
                </p>
                <p className="text-sm text-slate-500">
                  Detailed demographic and behavioral insights will be available
                  here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Content Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">
                  Content analytics coming soon
                </p>
                <p className="text-sm text-slate-500">
                  Track which types of content perform best across platforms
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
