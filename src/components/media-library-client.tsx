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
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useState, useRef, useCallback } from "react";
import {
  Upload,
  Search,
  Filter,
  Edit3,
  Trash2,
  Download,
  Eye,
  Tag,
  Grid3X3,
  List,
  Plus,
  Image as ImageIcon,
  Video,
  FileText,
  Crop,
  Palette,
  Sliders,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Maximize,
  Minimize,
  Save,
  Undo,
  Redo,
  Copy,
  Share2,
  FolderPlus,
  Star,
  Heart,
  Zap,
  Sun,
  Moon,
  Contrast,
  Droplets,
  Sparkles,
  Camera,
  Scissors,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Square,
  Circle,
  Triangle,
  Type,
  PaintBucket,
  Eraser,
  Brush,
  Layers,
  Settings,
  X,
  Check,
  RefreshCw,
  CloudUpload,
  HardDrive,
  Folder,
  FileImage,
  PlayCircle,
  Music,
  FileVideo,
  Archive,
} from "lucide-react";

interface MediaLibraryClientProps {
  user: any;
}

interface MediaItem {
  id: string;
  type: string;
  src: string;
  title: string;
  tags: string[];
  size: string;
  dimensions: string;
  uploadDate: string;
  usage: number;
  folder?: string;
  favorite?: boolean;
  description?: string;
}

export default function MediaLibraryClient({ user }: MediaLibraryClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaFilter, setMediaFilter] = useState("all");
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editor states
  const [activeTab, setActiveTab] = useState("crop");
  const [cropSettings, setCropSettings] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    blur: 0,
    sharpness: 0,
    exposure: 0,
    highlights: 0,
    shadows: 0,
    temperature: 0,
    tint: 0,
    vibrance: 0,
  });
  const [selectedFilterEffect, setSelectedFilterEffect] = useState("none");
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [zoom, setZoom] = useState(100);

  const mediaItems: MediaItem[] = [
    {
      id: "1",
      type: "image",
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80",
      title: "Sunset City Skyline",
      tags: ["city", "sunset", "urban", "landscape"],
      size: "2.4 MB",
      dimensions: "1920x1080",
      uploadDate: "2024-01-15",
      usage: 5,
      folder: "Landscapes",
      favorite: true,
      description: "Beautiful sunset over the city skyline",
    },
    {
      id: "2",
      type: "image",
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
      title: "Mountain Landscape",
      tags: ["nature", "mountain", "outdoor", "scenic"],
      size: "3.1 MB",
      dimensions: "1920x1280",
      uploadDate: "2024-01-14",
      usage: 12,
      folder: "Nature",
      favorite: false,
    },
    {
      id: "3",
      type: "image",
      src: "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=600&q=80",
      title: "Modern Workspace",
      tags: ["work", "desk", "office", "productivity"],
      size: "1.8 MB",
      dimensions: "1600x1200",
      uploadDate: "2024-01-13",
      usage: 8,
      folder: "Business",
    },
    {
      id: "4",
      type: "video",
      src: "https://images.unsplash.com/photo-1543269664-76bc3997d9ea?w=600&q=80",
      title: "Team Collaboration",
      tags: ["team", "people", "meeting", "business"],
      size: "15.2 MB",
      dimensions: "1920x1080",
      uploadDate: "2024-01-12",
      usage: 3,
      folder: "Videos",
    },
    {
      id: "5",
      type: "image",
      src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80",
      title: "Creative Design",
      tags: ["design", "creative", "art", "inspiration"],
      size: "2.7 MB",
      dimensions: "1800x1200",
      uploadDate: "2024-01-11",
      usage: 15,
      folder: "Design",
      favorite: true,
    },
  ];

  const folders = [
    "All",
    "Landscapes",
    "Nature",
    "Business",
    "Videos",
    "Design",
  ];

  const filterEffects = [
    { name: "None", value: "none" },
    { name: "Vintage", value: "sepia(0.5) contrast(1.2)" },
    { name: "Black & White", value: "grayscale(1)" },
    { name: "Warm", value: "sepia(0.3) saturate(1.4)" },
    { name: "Cool", value: "hue-rotate(180deg) saturate(1.2)" },
    { name: "High Contrast", value: "contrast(1.5) saturate(1.3)" },
    { name: "Soft", value: "blur(0.5px) brightness(1.1)" },
    { name: "Dramatic", value: "contrast(1.8) brightness(0.9)" },
    { name: "Faded", value: "opacity(0.8) contrast(0.8)" },
    { name: "Vibrant", value: "saturate(1.8) contrast(1.1)" },
  ];

  const cropPresets = [
    { name: "Original", ratio: null },
    { name: "Square", ratio: 1 },
    { name: "16:9", ratio: 16 / 9 },
    { name: "4:3", ratio: 4 / 3 },
    { name: "3:2", ratio: 3 / 2 },
    { name: "Instagram Post", ratio: 1 },
    { name: "Instagram Story", ratio: 9 / 16 },
    { name: "Facebook Cover", ratio: 820 / 312 },
    { name: "Twitter Header", ratio: 1500 / 500 },
  ];

  const filterOptions = [
    { value: "all", label: "All Media", count: mediaItems.length },
    {
      value: "image",
      label: "Images",
      count: mediaItems.filter((item) => item.type === "image").length,
    },
    {
      value: "video",
      label: "Videos",
      count: mediaItems.filter((item) => item.type === "video").length,
    },
    {
      value: "favorites",
      label: "Favorites",
      count: mediaItems.filter((item) => item.favorite).length,
    },
    { value: "recent", label: "Recent", count: 10 },
  ];

  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesFilter =
      mediaFilter === "all" ||
      (mediaFilter === "recent" &&
        new Date(item.uploadDate) > new Date("2024-01-12")) ||
      (mediaFilter === "favorites" && item.favorite) ||
      item.type === mediaFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadOpen(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const toggleSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const toggleFavorite = (itemId: string) => {
    // In real app, this would update the database
    console.log("Toggle favorite for item:", itemId);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return ImageIcon;
      case "video":
        return Video;
      case "audio":
        return Music;
      case "document":
        return FileText;
      default:
        return FileText;
    }
  };

  const resetEditor = () => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      hue: 0,
      blur: 0,
      sharpness: 0,
      exposure: 0,
      highlights: 0,
      shadows: 0,
      temperature: 0,
      tint: 0,
      vibrance: 0,
    });
    setSelectedFilterEffect("none");
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(100);
  };

  const applyEdits = () => {
    // In real app, this would process the image and save
    console.log("Applying edits:", {
      adjustments,
      selectedFilterEffect,
      rotation,
      flipH,
      flipV,
    });
    setEditingItem(null);
  };

  const renderGridView = () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredItems.map((item) => {
        const isSelected = selectedItems.includes(item.id);
        const FileIcon = getFileIcon(item.type);

        return (
          <Card
            key={item.id}
            className={`bg-slate-800 border-slate-700 overflow-hidden cursor-pointer transition-all hover:border-purple-500 ${
              isSelected ? "border-purple-500 ring-2 ring-purple-500/20" : ""
            }`}
            onClick={() => toggleSelection(item.id)}
          >
            <div className="aspect-video w-full overflow-hidden relative group">
              <img
                src={item.src}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute top-2 left-2">
                <Badge
                  variant="secondary"
                  className="bg-slate-900/80 text-white"
                >
                  <FileIcon className="w-3 h-3 mr-1" />
                  {item.type}
                </Badge>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-slate-900/80 text-white hover:bg-slate-800 p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                >
                  <Heart
                    className={`w-3 h-3 ${item.favorite ? "fill-red-500 text-red-500" : ""}`}
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
                {item.title}
                {item.favorite && (
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                )}
              </CardTitle>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{item.dimensions}</span>
                <span>{item.size}</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs border-slate-600 text-slate-300"
                  >
                    #{tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs border-slate-600 text-slate-300"
                  >
                    +{item.tags.length - 3}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span>Used {item.usage} times</span>
                <span>{item.uploadDate}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle select for composer
                  }}
                >
                  Select
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingItem(item);
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
      {filteredItems.map((item) => {
        const isSelected = selectedItems.includes(item.id);
        const FileIcon = getFileIcon(item.type);

        return (
          <Card
            key={item.id}
            className={`bg-slate-800 border-slate-700 cursor-pointer transition-all hover:border-purple-500 ${
              isSelected ? "border-purple-500 ring-2 ring-purple-500/20" : ""
            }`}
            onClick={() => toggleSelection(item.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium truncate">
                      {item.title}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-slate-700 text-slate-200"
                    >
                      <FileIcon className="w-3 h-3 mr-1" />
                      {item.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-slate-600 text-slate-300"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>{item.dimensions}</span>
                    <span>{item.size}</span>
                    <span>Used {item.usage} times</span>
                    <span>{item.uploadDate}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Select
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingItem(item);
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

  return (
    <div
      className="min-h-screen bg-slate-900 p-6 lg:p-8"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <p className="text-slate-400 text-sm">
            Upload, organize, edit and manage your media assets
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Upload Media
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Upload Media Files
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-slate-600"
                  }`}
                >
                  <CloudUpload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-white font-medium mb-2">
                    Drag & drop files here
                  </p>
                  <p className="text-slate-400 text-sm mb-4">
                    or click to browse
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Browse Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files && handleFiles(e.target.files)
                    }
                  />
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-300">
                      <span>Uploading files...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
                  <div>
                    <p className="font-medium text-slate-300 mb-1">
                      Supported formats:
                    </p>
                    <p>Images: JPG, PNG, GIF, WebP, SVG</p>
                    <p>Videos: MP4, MOV, AVI, WebM</p>
                    <p>Audio: MP3, WAV, OGG</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-300 mb-1">
                      File limits:
                    </p>
                    <p>Max size: 100MB per file</p>
                    <p>Max files: 50 at once</p>
                    <p>Total storage: 10GB</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                Create Folder
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Create New Folder
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Folder name"
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <Textarea
                  placeholder="Description (optional)"
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <div className="flex gap-2">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white flex-1">
                    Create Folder
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                    onClick={() => setCreateFolderOpen(false)}
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
              placeholder="Search media by name, tags, or description..."
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
                  onClick={() => setMediaFilter(option.value)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    mediaFilter === option.value
                      ? "bg-purple-600 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {option.label} ({option.count})
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

        {/* Folder Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {folders.map((folder) => (
            <Button
              key={folder}
              variant="outline"
              size="sm"
              className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 whitespace-nowrap"
            >
              <Folder className="w-3 h-3 mr-1" />
              {folder}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Items Actions */}
      {selectedItems.length > 0 && (
        <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">
              {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""}{" "}
              selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
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
                <Tag className="w-4 h-4 mr-2" />
                Add Tags
              </Button>
              <Button size="sm" variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Grid/List */}
      {viewMode === "grid" ? renderGridView() : renderListView()}

      {/* Advanced Media Editor Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-7xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="border-b border-slate-800 pb-4">
            <DialogTitle className="text-white flex items-center justify-between">
              <span>Advanced Media Editor - {editingItem?.title}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetEditor}
                  className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={applyEdits}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save Changes
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          {editingItem && (
            <div className="grid lg:grid-cols-3 gap-6 h-[calc(90vh-120px)] overflow-hidden">
              {/* Image Preview */}
              <div className="lg:col-span-2 space-y-4 overflow-hidden">
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-800 relative">
                  <img
                    src={editingItem.src}
                    alt={editingItem.title}
                    className="w-full h-full object-contain"
                    style={{
                      filter: `
                        brightness(${1 + adjustments.brightness / 100})
                        contrast(${1 + adjustments.contrast / 100})
                        saturate(${1 + adjustments.saturation / 100})
                        hue-rotate(${adjustments.hue}deg)
                        blur(${adjustments.blur}px)
                        ${selectedFilterEffect !== "none" ? filterEffects.find((f) => f.value === selectedFilterEffect)?.value || "" : ""}
                      `,
                      transform: `
                        rotate(${rotation}deg)
                        scaleX(${flipH ? -1 : 1})
                        scaleY(${flipV ? -1 : 1})
                        scale(${zoom / 100})
                      `,
                    }}
                  />

                  {/* Crop overlay */}
                  {activeTab === "crop" && (
                    <div className="absolute inset-0 border-2 border-dashed border-purple-500 bg-black/20">
                      <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs">
                        Crop Area
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRotation((r) => r - 90)}
                    className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRotation((r) => r + 90)}
                    className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFlipH(!flipH)}
                    className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFlipV(!flipV)}
                    className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  >
                    <FlipVertical className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setZoom((z) => Math.max(25, z - 25))}
                    className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setZoom((z) => Math.min(400, z + 25))}
                    className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Editor Controls */}
              <div className="space-y-4 overflow-y-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                    <TabsTrigger
                      value="crop"
                      className="data-[state=active]:bg-slate-700 text-slate-200"
                    >
                      <Crop className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger
                      value="adjust"
                      className="data-[state=active]:bg-slate-700 text-slate-200"
                    >
                      <Sliders className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger
                      value="filters"
                      className="data-[state=active]:bg-slate-700 text-slate-200"
                    >
                      <Palette className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger
                      value="details"
                      className="data-[state=active]:bg-slate-700 text-slate-200"
                    >
                      <Settings className="w-4 h-4" />
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="crop" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-200 mb-2 block">
                        Crop Presets
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {cropPresets.map((preset) => (
                          <Button
                            key={preset.name}
                            size="sm"
                            variant="outline"
                            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs"
                          >
                            {preset.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-slate-200">
                          X Position: {cropSettings.x}%
                        </label>
                        <Slider
                          value={[cropSettings.x]}
                          onValueChange={([value]) =>
                            setCropSettings((prev) => ({ ...prev, x: value }))
                          }
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-200">
                          Y Position: {cropSettings.y}%
                        </label>
                        <Slider
                          value={[cropSettings.y]}
                          onValueChange={([value]) =>
                            setCropSettings((prev) => ({ ...prev, y: value }))
                          }
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-200">
                          Width: {cropSettings.width}%
                        </label>
                        <Slider
                          value={[cropSettings.width]}
                          onValueChange={([value]) =>
                            setCropSettings((prev) => ({
                              ...prev,
                              width: value,
                            }))
                          }
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-200">
                          Height: {cropSettings.height}%
                        </label>
                        <Slider
                          value={[cropSettings.height]}
                          onValueChange={([value]) =>
                            setCropSettings((prev) => ({
                              ...prev,
                              height: value,
                            }))
                          }
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="adjust" className="space-y-4">
                    <div className="space-y-3">
                      {Object.entries(adjustments).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-sm text-slate-200 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}: {value}
                          </label>
                          <Slider
                            value={[value]}
                            onValueChange={([newValue]) =>
                              setAdjustments((prev) => ({
                                ...prev,
                                [key]: newValue,
                              }))
                            }
                            min={key === "blur" ? 0 : -100}
                            max={key === "blur" ? 10 : 100}
                            step={key === "blur" ? 0.1 : 1}
                            className="mt-2"
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="filters" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-200 mb-2 block">
                        Filter Effects
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {filterEffects.map((filter) => (
                          <Button
                            key={filter.value}
                            size="sm"
                            variant={
                              selectedFilterEffect === filter.value
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              setSelectedFilterEffect(filter.value)
                            }
                            className={`text-xs ${
                              selectedFilterEffect === filter.value
                                ? "bg-purple-600 hover:bg-purple-700 text-white"
                                : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                            }`}
                          >
                            {filter.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-200 mb-2 block">
                        Title
                      </label>
                      <Input
                        defaultValue={editingItem.title}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-200 mb-2 block">
                        Description
                      </label>
                      <Textarea
                        defaultValue={editingItem.description || ""}
                        placeholder="Add a description..."
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-200 mb-2 block">
                        Tags
                      </label>
                      <Input
                        defaultValue={editingItem.tags.join(", ")}
                        placeholder="Enter tags separated by commas"
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-200 mb-2 block">
                        Folder
                      </label>
                      <Select defaultValue={editingItem.folder || "None"}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="None" className="text-white">
                            No Folder
                          </SelectItem>
                          {folders.slice(1).map((folder) => (
                            <SelectItem
                              key={folder}
                              value={folder}
                              className="text-white"
                            >
                              {folder}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
                      <div>
                        <p className="font-medium text-slate-300">File Info</p>
                        <p>Size: {editingItem.size}</p>
                        <p>Dimensions: {editingItem.dimensions}</p>
                        <p>Type: {editingItem.type}</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-300">Usage</p>
                        <p>Used: {editingItem.usage} times</p>
                        <p>Uploaded: {editingItem.uploadDate}</p>
                        <p>Favorite: {editingItem.favorite ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Drag overlay */}
      {dragActive && (
        <div className="fixed inset-0 bg-purple-500/20 border-4 border-dashed border-purple-500 z-50 flex items-center justify-center">
          <div className="bg-slate-900 rounded-lg p-8 text-center">
            <CloudUpload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <p className="text-white text-xl font-bold">Drop files to upload</p>
            <p className="text-slate-400">Release to start uploading</p>
          </div>
        </div>
      )}
    </div>
  );
}
