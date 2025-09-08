"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Bot,
  LayoutDashboard,
  PenTool,
  Calendar,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Link2,
  Bird,
  Linkedin,
  Camera,
  Globe,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { ThemeSwitcher } from "./theme-switcher";

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    email: string;
  };
}

interface DashboardSidebarProps {
  user: User;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    current: true,
  },
  {
    name: "Post Composer",
    href: "/dashboard/composer",
    icon: PenTool,
    current: false,
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
    current: false,
  },
  {
    name: "Team",
    href: "/dashboard/team",
    icon: Users,
    current: false,
  },
  {
    name: "Templates",
    href: "/dashboard/templates",
    icon: FileText,
    current: false,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    current: false,
  },
];

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      const { data } = await supabase
        .from('social_accounts')
        .select('platform')
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      setConnectedAccounts(data || []);
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const [connectOpen, setConnectOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

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

  const platforms = [
    { key: "facebook", name: "Facebook", icon: Globe, color: "bg-blue-600" },
    { key: "instagram", name: "Instagram", icon: Camera, color: "bg-pink-600" },
    { key: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-sky-700" },
    { key: "twitter", name: "Twitter/X", icon: Bird, color: "bg-slate-700" },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-white"
        >
          <Bot className="w-6 h-6 text-purple-400" />
          SocialHub.ai
        </Link>
        <ThemeSwitcher />
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-purple-600 text-white">
              {user.user_metadata.full_name
                ? user.user_metadata.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : user.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.user_metadata.full_name || "User"}
            </p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
        <Badge className="mt-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <Sparkles className="w-3 h-3 mr-1" />
          Pro Plan
        </Badge>
        
        {/* Connected Accounts Status */}
        {connectedAccounts.length > 0 && (
          <div className="mt-3 text-xs text-slate-400">
            {connectedAccounts.length} account{connectedAccounts.length > 1 ? 's' : ''} connected
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-purple-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Dialog
          open={connectOpen}
          onOpenChange={(o) => {
            setConnectOpen(o);
            if (!o) setSelectedPlatform(null);
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Link2 className="w-5 h-5" />
              Connect Accounts
              {connectedAccounts.length > 0 && (
                <Badge className="ml-auto bg-green-600 text-white text-xs">
                  {connectedAccounts.length}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">
                Connect Social Media Accounts
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Connect your social media accounts to start posting and managing content.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-3">
              {platforms.map((p) => {
                const isConnected = connectedAccounts.some(acc => acc.platform === p.key);
                return (
                  <button
                    key={p.key}
                    onClick={() => isConnected ? null : handleConnect(p.key)}
                    disabled={isConnected}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/60 px-4 py-3 text-left transition hover:bg-slate-800 focus:outline-none",
                      isConnected && "opacity-75 cursor-not-allowed"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded",
                        p.color,
                      )}
                    >
                      <p.icon className="h-4 w-4 text-white" />
                    </span>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-200">{p.name}</span>
                      <div className="text-xs text-slate-400">
                        {isConnected ? "Connected" : "Click to connect"}
                      </div>
                    </div>
                    {isConnected && (
                      <Badge className="bg-green-600 text-white">
                        ✓ Connected
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
            <DialogFooter />
          </DialogContent>
        </Dialog>

        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}