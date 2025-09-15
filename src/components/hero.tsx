import Link from "next/link";
import { ArrowUpRight, Check, Bot, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900 to-blue-900/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto">
            <Badge className="mb-6 bg-purple-600/20 text-purple-300 border-purple-600/30 text-sm px-4 py-2">
              <Bot className="w-4 h-4 mr-2" />
              AI-Powered Social Media Management
            </Badge>

            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-8 tracking-tight">
              Dominate Social Media with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                AI Magic
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              SocialHub.ai transforms your social media workflow with
              intelligent content creation, smart scheduling, and powerful
              analytics. Create engaging posts 10x faster across all platforms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Start Creating with AI
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center px-8 py-4 text-slate-300 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-all duration-300 text-lg font-medium backdrop-blur-sm"
              >
                Watch Demo
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>

            {/* Platform badges */}
            <div className="mt-16 flex flex-wrap justify-center gap-4">
              <div className="text-slate-500 text-sm mb-4 w-full">
                Supports all major platforms:
              </div>
              {["Facebook", "Instagram", "LinkedIn", "Twitter/X"].map(
                (platform) => (
                  <Badge
                    key={platform}
                    variant="outline"
                    className="border-slate-600 text-slate-400 bg-slate-800/30"
                  >
                    {platform}
                  </Badge>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
