"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Users,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Clock,
  Globe,
} from "lucide-react";

interface AnalyticsClientProps {
  user: any;
}

export default function AnalyticsClient({ user }: AnalyticsClientProps) {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [loading, setLoading] = useState(false);

  const timeRanges = [
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
  ];

  const platforms = [
    { value: "all", label: "All Platforms" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "twitter", label: "Twitter/X" },
  ];

  const metrics = [
    { 
      title: "Total Impressions", 
      value: "128.4k", 
      change: "+12.3%", 
      trend: "up",
      icon: Eye,
      color: "text-blue-400"
    },
    { 
      title: "Reach", 
      value: "86.2k", 
      change: "+8.1%", 
      trend: "up",
      icon: Users,
      color: "text-green-400"
    },
    { 
      title: "Engagement", 
      value: "14.7k", 
      change: "+4.6%", 
      trend: "up",
      icon: Heart,
      color: "text-pink-400"
    },
    { 
      title: "Engagement Rate", 
      value: "5.2%", 
      change: "-0.3%", 
      trend: "down",
      icon: Target,
      color: "text-purple-400"
    },
  ];

  const platformPerformance = [
    { name: "Instagram", impressions: 45200, engagement: 2340, rate: 5.2, growth: "+15%" },
    { name: "Facebook", impressions: 38100, engagement: 1890, rate: 4.9, growth: "+8%" },
    { name: "LinkedIn", impressions: 28900, engagement: 1456, rate: 5.0, growth: "+12%" },
    { name: "Twitter/X", impressions: 16200, engagement: 891, rate: 5.5, growth: "+6%" },
  ];

  const topPosts = [
    {
      id: 1,
      content: "🚀 Exciting news! We're launching our new AI-powered social media management platform...",
      platform: "Instagram",
      impressions: 12400,
      engagement: 890,
      rate: 7.2,
      date: "2024-01-20",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&q=80"
    },
    {
      id: 2,
      content: "💡 5 Tips for Better Social Media Engagement in 2024",
      platform: "LinkedIn",
      impressions: 8900,
      engagement: 567,
      rate: 6.4,
      date: "2024-01-19",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&q=80"
    },
    {
      id: 3,
      content: "Behind the scenes: How we built our analytics dashboard",
      platform: "Facebook",
      impressions: 7600,
      engagement: 423,
      rate: 5.6,
      date: "2024-01-18",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&q=80"
    },
  ];

  const insights = [
    {
      type: "best_time",
      title: "Optimal Posting Time",
      description: "Your audience is most active between 2:00 PM - 4:00 PM on weekdays",
      icon: Clock,
      color: "text-blue-400"
    },
    {
      type: "content_type",
      title: "Top Content Type",
      description: "Carousel posts perform 23% better than single image posts",
      icon: BarChart3,
      color: "text-green-400"
    },
    {
      type: "hashtags",
      title: "Hashtag Performance",
      description: "Posts with 5-7 hashtags get 18% more engagement",
      icon: Target,
      color: "text-purple-400"
    },
    {
      type: "platform",
      title: "Platform Growth",
      description: "Instagram shows the highest growth rate at +15% this month",
      icon: TrendingUp,
      color: "text-pink-400"
    },
  ];

  const refreshData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-slate-400 text-sm">Track your social media performance across all platforms</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={loading}
            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value} className="text-white">
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {platforms.map((platform) => (
              <SelectItem key={platform.value} value={platform.value} className="text-white">
                {platform.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === "up";
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          
          return (
            <Card key={metric.title} className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-300 text-sm">{metric.title}</CardTitle>
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  <div className={`flex items-center text-xs px-2 py-0.5 rounded ${
                    isPositive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                  }`}>
                    <TrendIcon className="w-3 h-3 mr-1" />
                    {metric.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700 text-slate-200">
            Overview
          </TabsTrigger>
          <TabsTrigger value="platforms" className="data-[state=active]:bg-slate-700 text-slate-200">
            Platforms
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-slate-700 text-slate-200">
            Content
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-slate-700 text-slate-200">
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white">Engagement Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full rounded-md bg-slate-900/60 border border-slate-700 flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 text-slate-500" />
                    <p>Interactive chart will be displayed here</p>
                    <p className="text-xs text-slate-500 mt-1">Showing engagement trends for {timeRange}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformPerformance.map((platform) => (
                    <div key={platform.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-200">{platform.name}</span>
                        <span className="text-slate-400">{platform.rate}%</span>
                      </div>
                      <div className="h-2 w-full rounded bg-slate-900">
                        <div 
                          className="h-2 rounded bg-gradient-to-r from-purple-600 to-blue-600" 
                          style={{ width: `${platform.rate * 10}%` }} 
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{platform.impressions.toLocaleString()} impressions</span>
                        <span className="text-green-400">{platform.growth}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platformPerformance.map((platform) => (
              <Card key={platform.name} className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-base">{platform.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Impressions</span>
                      <span className="text-white">{platform.impressions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Engagement</span>
                      <span className="text-white">{platform.engagement.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Rate</span>
                      <span className="text-white">{platform.rate}%</span>
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white w-full justify-center">
                    {platform.growth} growth
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Top Performing Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post) => (
                  <div key={post.id} className="flex items-start gap-4 p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium line-clamp-2 mb-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {post.platform}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.impressions.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.engagement.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {post.rate}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-purple-600 text-white mb-2">
                        Top Performer
                      </Badge>
                      <p className="text-xs text-slate-400">{post.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {insights.map((insight) => {
              const Icon = insight.icon;
              return (
                <Card key={insight.type} className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${insight.color}`} />
                      <CardTitle className="text-white text-base">{insight.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm">{insight.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Consider posting more carousel content on Instagram for higher engagement",
                  "Your LinkedIn posts perform best on Tuesday and Wednesday mornings",
                  "Adding 2-3 more hashtags could increase your reach by up to 15%",
                  "Video content shows 40% higher engagement than static images",
                ].map((recommendation, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                    <p className="text-slate-200 text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}