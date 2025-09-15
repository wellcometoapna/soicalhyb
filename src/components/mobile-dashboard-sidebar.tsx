"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Bot,
  LayoutDashboard,
  PenTool,
  Calendar,
  Users,
  Image,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    email: string;
  };
}

interface MobileDashboardSidebarProps {
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
    name: "Media Library",
    href: "/dashboard/media",
    icon: Image,
    current: false,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    current: false,
  },
];

export default function MobileDashboardSidebar({
  user,
}: MobileDashboardSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    setOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-white"
        >
          <Bot className="w-5 h-5 text-purple-400" />
          SocialHub.ai
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 bg-slate-900 border-slate-800 p-0"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <SheetHeader className="p-6 border-b border-slate-800">
                <SheetTitle className="flex items-center gap-2 text-xl font-bold text-white">
                  <Bot className="w-6 h-6 text-purple-400" />
                  SocialHub.ai
                </SheetTitle>
              </SheetHeader>

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
                    <p className="text-xs text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Badge className="mt-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Pro Plan
                </Badge>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
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
                <Link
                  href="/dashboard/settings"
                  onClick={() => setOpen(false)}
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
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
