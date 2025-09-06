"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Plus,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Calendar,
  Settings,
  Unlink,
} from "lucide-react";
import { createClient } from "../../supabase/client";

interface ConnectedAccount {
  id: string;
  platform: string;
  username: string;
  display_name: string;
  profile_image_url?: string;
  is_active: boolean;
  created_at: string;
  account_data: any;
}

interface DashboardClientProps {
  user: any;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [connectOpen, setConnectOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const platforms = [
    { 
      key: "facebook", 
      name: "Facebook", 
      icon: Facebook, 
      color: "bg-blue-600",
      description: "Connect your Facebook pages and profiles"
    },
    { 
      key: "instagram", 
      name: "Instagram", 
      icon: Instagram, 
      color: "bg-gradient-to-r from-purple-600 to-pink-600",
      description: "Manage your Instagram business account"
    },
    { 
      key: "linkedin", 
      name: "LinkedIn", 
      icon: Linkedin, 
      color: "bg-blue-700",
      description: "Share professional content on LinkedIn"
    },
    { 
      key: "twitter", 
      name: "Twitter/X", 
      icon: Twitter, 
      color: "bg-slate-700",
      description: "Post tweets and engage with your audience"
    },
  ];

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      setConnectedAccounts(data || []);
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: string) => {
    try {
      const response = await fetch(`/api/auth/oauth?platform=${platform}`);
      const data = await response.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Error initiating OAuth:', error);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .update({ is_active: false })
        .eq('id', accountId);

      if (error) throw error;
      fetchConnectedAccounts();
    } catch (error) {
      console.error('Error disconnecting account:', error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = platforms.find(p => p.key === platform);
    return platformData?.icon || Settings;
  };

  const getPlatformColor = (platform: string) => {
    const platformData = platforms.find(p => p.key === platform);
    return platformData?.color || "bg-slate-600";
  };

  const stats = [
    { title: "Connected Accounts", value: connectedAccounts.length, icon: Users, color: "text-blue-400" },
    { title: "Posts This Month", value: "24", icon: TrendingUp, color: "text-green-400" },
    { title: "Scheduled Posts", value: "8", icon: Calendar, color: "text-purple-400" },
    { title: "Total Engagement", value: "12.4k", icon: TrendingUp, color: "text-orange-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm">Welcome back, {user.user_metadata.full_name || user.email}</p>
        </div>
        <Dialog open={connectOpen} onOpenChange={setConnectOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Connect Account
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Connect Social Media Account</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isConnected = connectedAccounts.some(acc => acc.platform === platform.key);
                
                return (
                  <div key={platform.key} className="flex items-center justify-between p-4 rounded-lg border border-slate-700 bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${platform.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{platform.name}</h3>
                        <p className="text-slate-400 text-sm">{platform.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isConnected ? (
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Button 
                          onClick={() => handleConnect(platform.key)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-300 text-sm">{stat.title}</CardTitle>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Connected Accounts */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Connected Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading accounts...</div>
          ) : connectedAccounts.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No social media accounts connected yet</p>
              <Button 
                onClick={() => setConnectOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Connect Your First Account
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {connectedAccounts.map((account) => {
                const Icon = getPlatformIcon(account.platform);
                const colorClass = getPlatformColor(account.platform);
                
                return (
                  <div key={account.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{account.display_name}</h3>
                        <p className="text-slate-400 text-sm capitalize">{account.platform}</p>
                      </div>
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-400">
                        Connected {new Date(account.created_at).toLocaleDateString()}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDisconnect(account.id)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-600"
                      >
                        <Unlink className="w-3 h-3 mr-1" />
                        Disconnect
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">Post published successfully</p>
                    <p className="text-slate-400 text-xs">2 hours ago • Facebook, Instagram</p>
                  </div>
                  <Badge className="bg-green-600 text-white">Published</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Post
            </Button>
            <Button variant="outline" className="w-full justify-start border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Content
            </Button>
            <Button variant="outline" className="w-full justify-start border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}