"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Sparkles,
  Calendar as CalendarIcon,
  Upload,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Hash,
  Eye,
  Send,
  Clock,
  Image as ImageIcon,
  Wand2,
  Target,
  Info,
} from "lucide-react";
import { createClient } from "../../supabase/client";

interface PostComposerClientProps {
  user: any;
}

export default function PostComposerClient({ user }: PostComposerClientProps) {
  const supabase = useMemo(() => createClient(), []);

  // Core content state
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [postContent, setPostContent] = useState("");
  
  const [hashtags, setHashtags] = useState("#socialmedia #marketing #ai");

  // Platforms and connections
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "facebook",
    "instagram",
  ]);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  // AI and actions state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isGettingBestTime, setIsGettingBestTime] = useState(false);

  // Scheduling
  const [scheduleAt, setScheduleAt] = useState<string>(""); // Local datetime input value

  const platforms = [
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600",
      charLimit: 63206,
      preview: {
        profileName: "SocialHub.ai",
        profileImage:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=socialhub",
        timeAgo: "Just now",
      },
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-r from-purple-600 to-pink-600",
      charLimit: 2200,
      preview: {
        profileName: "socialhub.ai",
        profileImage:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=socialhub",
        timeAgo: "now",
      },
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700",
      charLimit: 3000,
      preview: {
        profileName: "SocialHub AI",
        profileImage:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=socialhub",
        timeAgo: "Just now",
      },
    },
    {
      id: "twitter",
      name: "Twitter/X",
      icon: Twitter,
      color: "bg-slate-700",
      charLimit: 280,
      preview: {
        profileName: "SocialHub AI",
        profileImage:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=socialhub",
        timeAgo: "now",
      },
    },
  ];

  // Fetch connected accounts for the user and restrict selectable platforms accordingly
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const { data, error } = await supabase
          .from("social_accounts")
          .select("platform")
          .eq("user_id", user.id)
          .eq("is_active", true);
        if (error) throw error;
        const connected = (data || []).map((d: any) => d.platform);
        setConnectedPlatforms(connected);
        // Ensure selectedPlatforms only includes connected ones
        setSelectedPlatforms((prev) =>
          prev.filter((p) => connected.includes(p)),
        );
      } catch (e) {
        console.error("Failed to load connected platforms", e);
      }
    };
    fetchConnections();
  }, [supabase, user?.id]);

  const togglePlatform = (platformId: string) => {
    const isConnected = connectedPlatforms.includes(platformId);
    if (!isConnected) return; // prevent selecting not-connected
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId],
    );
  };

  const toLocalDatetimeInputValue = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const generateAIContent = async () => {
    try {
      setIsGeneratingAI(true);
      const res = await fetch("/api/composer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "generate",
          topic,
          tone,
          hashtags,
          platforms: selectedPlatforms,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate content");
      setPostContent(data.content || "");
      if (data.hashtags) setHashtags(data.hashtags);
    } catch (e: any) {
      console.error(e);
      alert(e.message || "AI generation failed");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const getBestTime = async () => {
    try {
      setIsGettingBestTime(true);
      const res = await fetch("/api/composer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "best-times",
          platforms: selectedPlatforms,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get best time");
      const first = data?.suggestions?.[0];
      if (first?.iso) {
        // Convert to local input value
        const dt = new Date(first.iso);
        setScheduleAt(toLocalDatetimeInputValue(dt));
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to get best time");
    } finally {
      setIsGettingBestTime(false);
    }
  };

  const handlePublish = async (publishNow: boolean) => {
    try {
      if (selectedPlatforms.length === 0) {
        alert("Please select at least one connected platform.");
        return;
      }
      if (!postContent.trim()) {
        alert("Please add some content before publishing.");
        return;
      }
      if (!publishNow && !scheduleAt) {
        alert("Please choose a schedule date & time.");
        return;
      }
      setIsPublishing(true);
      const res = await fetch("/api/composer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "publish",
          content: postContent,
          hashtags,
          platforms: selectedPlatforms,
          publishNow,
          scheduleAt: scheduleAt ? new Date(scheduleAt).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish");
      if (publishNow) {
        alert("Post published successfully.");
      } else {
        alert("Post scheduled successfully.");
      }
      // Optional: reset form
      // setPostContent("");
      // setHashtags("#socialmedia #marketing #ai");
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to publish");
    } finally {
      setIsPublishing(false);
    }
  };



  

  const renderPlatformPreview = (platform: any) => {
    const content = postContent || "Your post content will appear here...";

    switch (platform.id) {
      case "facebook":
        return (
          <div className="bg-white rounded-lg p-4 text-black">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-blue-600 text-white">
                  SH
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-sm">
                  {platform.preview.profileName}
                </div>
                <div className="text-xs text-gray-500">
                  {platform.preview.timeAgo} • 🌍
                </div>
              </div>
            </div>
            <div className="text-sm mb-3 whitespace-pre-wrap">{content}</div>
            <div className="flex items-center gap-4 text-gray-500 text-sm border-t pt-2">
              <span>👍 Like</span>
              <span>💬 Comment</span>
              <span>↗️ Share</span>
            </div>
          </div>
        );

      case "instagram":
        return (
          <div className="bg-white rounded-lg text-black">
            <div className="flex items-center gap-3 p-3 border-b">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-pink-600 text-white">
                  SH
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-sm">
                  {platform.preview.profileName}
                </div>
              </div>
              <div className="text-xl">⋯</div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-white/50" />
            </div>
            <div className="p-3">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-xl">❤️</span>
                <span className="text-xl">💬</span>
                <span className="text-xl">📤</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold">
                  {platform.preview.profileName}
                </span>{" "}
                {content}
              </div>
            </div>
          </div>
        );

      case "linkedin":
        return (
          <div className="bg-white rounded-lg p-4 text-black">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-blue-700 text-white">
                  SH
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-sm">
                  {platform.preview.profileName}
                </div>
                <div className="text-xs text-gray-500">
                  AI-Powered Social Media Platform
                </div>
                <div className="text-xs text-gray-500">
                  {platform.preview.timeAgo}
                </div>
              </div>
            </div>
            <div className="text-sm mb-3 whitespace-pre-wrap">{content}</div>
            <div className="flex items-center gap-4 text-gray-600 text-sm border-t pt-3">
              <span>👍 Like</span>
              <span>💬 Comment</span>
              <span>🔄 Repost</span>
              <span>📤 Send</span>
            </div>
          </div>
        );

      case "twitter":
        return (
          <div className="bg-white rounded-lg p-4 text-black">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-slate-700 text-white">
                  SH
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">
                    {platform.preview.profileName}
                  </span>
                  <span className="text-gray-500 text-sm">@socialhub_ai</span>
                  <span className="text-gray-500 text-sm">·</span>
                  <span className="text-gray-500 text-sm">
                    {platform.preview.timeAgo}
                  </span>
                </div>
                <div className="text-sm mb-3 whitespace-pre-wrap">
                  {content.slice(0, 280)}
                </div>
                <div className="flex items-center gap-6 text-gray-500">
                  <span className="text-sm">💬</span>
                  <span className="text-sm">🔄</span>
                  <span className="text-sm">❤️</span>
                  <span className="text-sm">📤</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-slate-700 rounded-lg p-4 text-center text-slate-400">
            Preview not available
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Post Composer</h1>
          <p className="text-slate-400 text-sm">
            Create engaging, SEO-optimized content with AI assistance
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
            onClick={() =>
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              })
            }
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => handlePublish(true)}
            disabled={isPublishing}
          >
            <Send className="w-4 h-4 mr-2" />
            {isPublishing ? "Publishing..." : "Publish Now"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Composer Section */}
        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-400" />
                Content Creation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Topic and Tone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Topic
                  </label>
                  <Input
                    placeholder="e.g., AI tools for social media growth"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Tone
                  </label>
                  <select
                    className="w-full rounded-md bg-slate-700 border border-slate-600 text-white px-3 py-2 text-sm"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    {[
                      "Professional",
                      "Friendly",
                      "Witty",
                      "Inspirational",
                      "Educational",
                      "Bold",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Post Content
                </label>
                <Textarea
                  placeholder="What's on your mind? Use AI to generate engaging content..."
                  className="bg-slate-700 border-slate-600 text-white min-h-[150px] resize-none"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{postContent.length} characters</span>
                  <span>Optimal length: 100-300 characters</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Hashtags & Keywords
                </label>
                <Input
                  placeholder="#hashtags #keywords"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={generateAIContent}
                  disabled={isGeneratingAI}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGeneratingAI ? "Generating..." : "Generate AI Content"}
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                  <Hash className="w-4 h-4 mr-2" />
                  Suggest Tags
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Target Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatforms.includes(platform.id);
                  const isConnected = connectedPlatforms.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      disabled={!isConnected}
                      className={`p-3 rounded-lg border transition-all ${
                        isSelected
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-slate-700 bg-slate-700/50 hover:bg-slate-700"
                      } ${!isConnected ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded ${platform.color}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-white">
                              {platform.name}
                            </div>
                            {!isConnected && (
                              <Badge className="bg-slate-600 text-white">
                                Connect
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">
                            {platform.charLimit} chars
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {connectedPlatforms.length === 0 && (
                <div className="mt-3 flex items-start gap-2 text-xs text-slate-400">
                  <Info className="w-4 h-4 mt-0.5" />
                  Connect accounts from the sidebar to enable posting.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-green-400" />
                Media, Scheduling & Best Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-400 mb-2">
                  Drag & drop images or videos
                </p>
                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                  Browse Files
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Schedule (optional)
                  </label>
                  <Input
                    type="datetime-local"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={scheduleAt}
                    onChange={(e) => setScheduleAt(e.target.value)}
                  />
                  <p className="text-xs text-slate-500">
                    Leave empty to publish immediately.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 flex-1"
                  onClick={() => handlePublish(false)}
                  disabled={isPublishing}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {isPublishing ? "Scheduling..." : "Schedule Post"}
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 flex-1"
                  onClick={getBestTime}
                  disabled={isGettingBestTime || selectedPlatforms.length === 0}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {isGettingBestTime ? "Finding..." : "Best Time"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-400" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue={selectedPlatforms[0] || "facebook"}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    const disabled = !selectedPlatforms.includes(platform.id);
                    return (
                      <TabsTrigger
                        key={platform.id}
                        value={platform.id}
                        className="data-[state=active]:bg-slate-600 text-slate-200"
                        disabled={disabled}
                      >
                        <Icon className="w-4 h-4" />
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                {platforms.map((platform) => (
                  <TabsContent
                    key={platform.id}
                    value={platform.id}
                    className="mt-4"
                  >
                    {renderPlatformPreview(platform)}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                SEO & Analytics Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Engagement Score</div>
                  <div className="text-lg font-bold text-green-400">8.5/10</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Readability</div>
                  <div className="text-lg font-bold text-blue-400">Good</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-200">AI Suggestions:</div>
                <div className="space-y-1">
                  <div className="text-xs text-slate-400 bg-slate-700 rounded p-2">
                    💡 Add 2-3 more hashtags for better reach
                  </div>
                  <div className="text-xs text-slate-400 bg-slate-700 rounded p-2">
                    📈 Best posting time: 2:00 PM - 4:00 PM
                  </div>
                  <div className="text-xs text-slate-400 bg-slate-700 rounded p-2">
                    🎯 Consider adding a call-to-action
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
