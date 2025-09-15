"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Grid3X3,
  List,
  Star,
  Heart,
  Copy,
  Share2,
  Tag,
  Bookmark,
  FileText,
  Image as ImageIcon,
  Video,
  Calendar,
  Megaphone,
  Bell,
  Package,
  User,
  Briefcase,
  Sun,
  Palette,
  Sparkles,
  TrendingUp,
  Clock,
  Users,
  Settings,
  Download,
  Upload,
} from "lucide-react";
import { createClient } from "../../supabase/client";

interface TemplatesClientProps {
  user: any;
}

interface Template {
  id: string;
  title: string;
  description: string;
  content: string;
  media_urls: string[];
  hashtags: string[];
  platforms: string[];
  category: string;
  tags: string[];
  is_favorite: boolean;
  is_public: boolean;
  usage_count: number;
  template_data: any;
  created_at: string;
  updated_at: string;
}

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export default function TemplatesClient({ user }: TemplatesClientProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // Form states for creating/editing templates
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    tags: "",
    platforms: [] as string[],
    hashtags: "",
    is_public: false,
  });

  const platformOptions = [
    { value: "facebook", label: "Facebook", icon: "📘" },
    { value: "instagram", label: "Instagram", icon: "📷" },
    { value: "twitter", label: "Twitter/X", icon: "🐦" },
    { value: "linkedin", label: "LinkedIn", icon: "💼" },
    { value: "tiktok", label: "TikTok", icon: "🎵" },
    { value: "youtube", label: "YouTube", icon: "📺" },
  ];

  const filterOptions = [
    { value: "all", label: "All Templates" },
    { value: "favorites", label: "Favorites" },
    { value: "recent", label: "Recent" },
    { value: "popular", label: "Most Used" },
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
  ];

  const getCategoryIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      "share-2": Share2,
      megaphone: Megaphone,
      bell: Bell,
      calendar: Calendar,
      package: Package,
      user: User,
      briefcase: Briefcase,
      sun: Sun,
    };
    return icons[iconName] || FileText;
  };

  const getCategoryColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      pink: "bg-pink-500",
      gray: "bg-gray-500",
      red: "bg-red-500",
    };
    return colors[color] || "bg-gray-500";
  };

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("template_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const createTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from("templates")
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            description: formData.description,
            content: formData.content,
            category: formData.category,
            tags: formData.tags.split(",").map((tag) => tag.trim()),
            platforms: formData.platforms,
            hashtags: formData.hashtags.split(",").map((tag) => tag.trim()),
            is_public: formData.is_public,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTemplates([data, ...templates]);
      setCreateOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating template:", error);
    }
  };

  const updateTemplate = async () => {
    if (!editingTemplate) return;

    try {
      const { data, error } = await supabase
        .from("templates")
        .update({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category,
          tags: formData.tags.split(",").map((tag) => tag.trim()),
          platforms: formData.platforms,
          hashtags: formData.hashtags.split(",").map((tag) => tag.trim()),
          is_public: formData.is_public,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingTemplate.id)
        .select()
        .single();

      if (error) throw error;

      setTemplates(
        templates.map((t) => (t.id === editingTemplate.id ? data : t)),
      );
      setEditingTemplate(null);
      resetForm();
    } catch (error) {
      console.error("Error updating template:", error);
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from("templates")
        .delete()
        .eq("id", templateId);

      if (error) throw error;

      setTemplates(templates.filter((t) => t.id !== templateId));
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const toggleFavorite = async (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    try {
      const { data, error } = await supabase
        .from("templates")
        .update({ is_favorite: !template.is_favorite })
        .eq("id", templateId)
        .select()
        .single();

      if (error) throw error;

      setTemplates(templates.map((t) => (t.id === templateId ? data : t)));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const incrementUsage = async (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    try {
      const { data, error } = await supabase
        .from("templates")
        .update({ usage_count: template.usage_count + 1 })
        .eq("id", templateId)
        .select()
        .single();

      if (error) throw error;

      setTemplates(templates.map((t) => (t.id === templateId ? data : t)));
    } catch (error) {
      console.error("Error incrementing usage:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      category: "",
      tags: "",
      platforms: [],
      hashtags: "",
      is_public: false,
    });
  };

  const openEditDialog = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      title: template.title,
      description: template.description,
      content: template.content,
      category: template.category,
      tags: template.tags.join(", "),
      platforms: template.platforms,
      hashtags: template.hashtags.join(", "),
      is_public: template.is_public,
    });
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "favorites" && template.is_favorite) ||
      (selectedFilter === "recent" &&
        new Date(template.created_at) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (selectedFilter === "popular" && template.usage_count > 5) ||
      (selectedFilter === "public" && template.is_public) ||
      (selectedFilter === "private" && !template.is_public);

    return matchesSearch && matchesCategory && matchesFilter;
  });

  const toggleSelection = (templateId: string) => {
    setSelectedItems((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId],
    );
  };

  const renderGridView = () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredTemplates.map((template) => {
        const isSelected = selectedItems.includes(template.id);
        const category = categories.find((c) => c.name === template.category);
        const CategoryIcon = category
          ? getCategoryIcon(category.icon)
          : FileText;

        return (
          <Card
            key={template.id}
            className={`bg-slate-800 border-slate-700 overflow-hidden cursor-pointer transition-all hover:border-purple-500 ${
              isSelected ? "border-purple-500 ring-2 ring-purple-500/20" : ""
            }`}
            onClick={() => toggleSelection(template.id)}
          >
            <div className="aspect-video w-full overflow-hidden relative group bg-gradient-to-br from-slate-700 to-slate-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <CategoryIcon className="w-16 h-16 text-slate-400" />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute top-2 left-2">
                <Badge
                  variant="secondary"
                  className={`${
                    category ? getCategoryColor(category.color) : "bg-gray-500"
                  } text-white`}
                >
                  <CategoryIcon className="w-3 h-3 mr-1" />
                  {template.category}
                </Badge>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-slate-900/80 text-white hover:bg-slate-800 p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(template.id);
                  }}
                >
                  <Heart
                    className={`w-3 h-3 ${
                      template.is_favorite ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-slate-900/80 text-white hover:bg-slate-800 p-1"
                >
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-white text-sm truncate flex items-center gap-2">
                {template.title}
                {template.is_favorite && (
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                )}
              </CardTitle>
              <p className="text-xs text-slate-400 line-clamp-2">
                {template.description}
              </p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex flex-wrap gap-1 mb-3">
                {template.platforms.slice(0, 3).map((platform) => (
                  <Badge
                    key={platform}
                    variant="outline"
                    className="text-xs border-slate-600 text-slate-300"
                  >
                    {platformOptions.find((p) => p.value === platform)?.icon}{" "}
                    {platform}
                  </Badge>
                ))}
                {template.platforms.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs border-slate-600 text-slate-300"
                  >
                    +{template.platforms.length - 3}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span>Used {template.usage_count} times</span>
                <span>
                  {new Date(template.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    incrementUsage(template.id);
                    // Handle use in composer
                  }}
                >
                  Use Template
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditDialog(template);
                  }}
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {filteredTemplates.map((template) => {
        const isSelected = selectedItems.includes(template.id);
        const category = categories.find((c) => c.name === template.category);
        const CategoryIcon = category
          ? getCategoryIcon(category.icon)
          : FileText;

        return (
          <Card
            key={template.id}
            className={`bg-slate-800 border-slate-700 cursor-pointer transition-all hover:border-purple-500 ${
              isSelected ? "border-purple-500 ring-2 ring-purple-500/20" : ""
            }`}
            onClick={() => toggleSelection(template.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <CategoryIcon className="w-8 h-8 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium truncate">
                      {template.title}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={`${
                        category
                          ? getCategoryColor(category.color)
                          : "bg-gray-500"
                      } text-white`}
                    >
                      <CategoryIcon className="w-3 h-3 mr-1" />
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-2 line-clamp-1">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.platforms.map((platform) => (
                      <Badge
                        key={platform}
                        variant="outline"
                        className="text-xs border-slate-600 text-slate-300"
                      >
                        {
                          platformOptions.find((p) => p.value === platform)
                            ?.icon
                        }{" "}
                        {platform}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Used {template.usage_count} times</span>
                    <span>
                      {new Date(template.created_at).toLocaleDateString()}
                    </span>
                    <span>{template.is_public ? "Public" : "Private"}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      incrementUsage(template.id);
                    }}
                  >
                    Use Template
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditDialog(template);
                    }}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 lg:p-8 flex items-center justify-center">
        <div className="text-white">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Templates</h1>
          <p className="text-slate-400 text-sm">
            Create, manage and use templates for your social media posts
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Create New Template
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-200 mb-2 block">
                    Title
                  </label>
                  <Input
                    placeholder="Template title"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200 mb-2 block">
                    Description
                  </label>
                  <Textarea
                    placeholder="Template description"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200 mb-2 block">
                    Content
                  </label>
                  <Textarea
                    placeholder="Template content"
                    className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-200 mb-2 block">
                      Category
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.name}
                            className="text-white"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-200 mb-2 block">
                      Tags
                    </label>
                    <Input
                      placeholder="Tags (comma separated)"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200 mb-2 block">
                    Platforms
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {platformOptions.map((platform) => (
                      <Button
                        key={platform.value}
                        type="button"
                        size="sm"
                        variant={
                          formData.platforms.includes(platform.value)
                            ? "default"
                            : "outline"
                        }
                        className={
                          formData.platforms.includes(platform.value)
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                        }
                        onClick={() => {
                          const platforms = formData.platforms.includes(
                            platform.value,
                          )
                            ? formData.platforms.filter(
                                (p) => p !== platform.value,
                              )
                            : [...formData.platforms, platform.value];
                          setFormData({ ...formData, platforms });
                        }}
                      >
                        {platform.icon} {platform.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200 mb-2 block">
                    Hashtags
                  </label>
                  <Input
                    placeholder="Hashtags (comma separated)"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={formData.hashtags}
                    onChange={(e) =>
                      setFormData({ ...formData, hashtags: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={formData.is_public}
                    onChange={(e) =>
                      setFormData({ ...formData, is_public: e.target.checked })
                    }
                    className="rounded"
                  />
                  <label htmlFor="is_public" className="text-sm text-slate-200">
                    Make this template public
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                    onClick={createTemplate}
                  >
                    Create Template
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                    onClick={() => {
                      setCreateOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search templates by title, description, or tags..."
              className="bg-slate-800 border-slate-700 text-white pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex bg-slate-800 rounded-lg p-1">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFilter(option.value)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    selectedFilter === option.value
                      ? "bg-purple-600 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-purple-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-purple-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            className={
              selectedCategory === "all"
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
            }
            onClick={() => setSelectedCategory("all")}
          >
            All Categories
          </Button>
          {categories.map((category) => {
            const CategoryIcon = getCategoryIcon(category.icon);
            return (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.name ? "default" : "outline"
                }
                size="sm"
                className={
                  selectedCategory === category.name
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 whitespace-nowrap"
                }
                onClick={() => setSelectedCategory(category.name)}
              >
                <CategoryIcon className="w-3 h-3 mr-1" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Selected Items Actions */}
      {selectedItems.length > 0 && (
        <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">
              {selectedItems.length} template
              {selectedItems.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid/List */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">
            No templates found
          </h3>
          <p className="text-slate-400 mb-4">
            {searchQuery ||
            selectedCategory !== "all" ||
            selectedFilter !== "all"
              ? "Try adjusting your filters or search query"
              : "Create your first template to get started"}
          </p>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      ) : (
        <>{viewMode === "grid" ? renderGridView() : renderListView()}</>
      )}

      {/* Edit Template Dialog */}
      <Dialog
        open={!!editingTemplate}
        onOpenChange={() => setEditingTemplate(null)}
      >
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              Edit Template - {editingTemplate?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-200 mb-2 block">
                Title
              </label>
              <Input
                placeholder="Template title"
                className="bg-slate-800 border-slate-700 text-white"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-200 mb-2 block">
                Description
              </label>
              <Textarea
                placeholder="Template description"
                className="bg-slate-800 border-slate-700 text-white"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-200 mb-2 block">
                Content
              </label>
              <Textarea
                placeholder="Template content"
                className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-200 mb-2 block">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.name}
                        className="text-white"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-200 mb-2 block">
                  Tags
                </label>
                <Input
                  placeholder="Tags (comma separated)"
                  className="bg-slate-800 border-slate-700 text-white"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-200 mb-2 block">
                Platforms
              </label>
              <div className="grid grid-cols-3 gap-2">
                {platformOptions.map((platform) => (
                  <Button
                    key={platform.value}
                    type="button"
                    size="sm"
                    variant={
                      formData.platforms.includes(platform.value)
                        ? "default"
                        : "outline"
                    }
                    className={
                      formData.platforms.includes(platform.value)
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                    }
                    onClick={() => {
                      const platforms = formData.platforms.includes(
                        platform.value,
                      )
                        ? formData.platforms.filter((p) => p !== platform.value)
                        : [...formData.platforms, platform.value];
                      setFormData({ ...formData, platforms });
                    }}
                  >
                    {platform.icon} {platform.label}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-200 mb-2 block">
                Hashtags
              </label>
              <Input
                placeholder="Hashtags (comma separated)"
                className="bg-slate-800 border-slate-700 text-white"
                value={formData.hashtags}
                onChange={(e) =>
                  setFormData({ ...formData, hashtags: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit_is_public"
                checked={formData.is_public}
                onChange={(e) =>
                  setFormData({ ...formData, is_public: e.target.checked })
                }
                className="rounded"
              />
              <label
                htmlFor="edit_is_public"
                className="text-sm text-slate-200"
              >
                Make this template public
              </label>
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                onClick={updateTemplate}
              >
                Update Template
              </Button>
              <Button
                variant="outline"
                className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                onClick={() => {
                  setEditingTemplate(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (editingTemplate) {
                    deleteTemplate(editingTemplate.id);
                    setEditingTemplate(null);
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
