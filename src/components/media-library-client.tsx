"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
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
} from "lucide-react";

interface MediaLibraryClientProps {
  user: any;
}

export default function MediaLibraryClient({ user }: MediaLibraryClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [editingItem, setEditingItem] = useState<any>(null);

  const mediaItems = [
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
    },
    {
      id: "6",
      type: "image",
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
      title: "Analytics Dashboard",
      tags: ["analytics", "data", "charts", "business"],
      size: "2.1 MB",
      dimensions: "1920x1080",
      uploadDate: "2024-01-10",
      usage: 7,
    },
  ];

  const filterOptions = [
    { value: "all", label: "All Media", count: mediaItems.length },
    { value: "image", label: "Images", count: mediaItems.filter(item => item.type === "image").length },
    { value: "video", label: "Videos", count: mediaItems.filter(item => item.type === "video").length },
    { value: "recent", label: "Recent", count: 10 },
  ];

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "recent" && new Date(item.uploadDate) > new Date("2024-01-12")) ||
                         item.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image": return ImageIcon;
      case "video": return Video;
      default: return FileText;
    }
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
                <Badge variant="secondary" className="bg-slate-900/80 text-white">
                  <FileIcon className="w-3 h-3 mr-1" />
                  {item.type}
                </Badge>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="secondary" className="bg-slate-900/80 text-white hover:bg-slate-800">
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-white text-sm truncate">{item.title}</CardTitle>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{item.dimensions}</span>
                <span>{item.size}</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-300">
                    #{tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
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
                  <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium truncate">{item.title}</h3>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-200">
                      <FileIcon className="w-3 h-3 mr-1" />
                      {item.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-300">
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
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
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
    <div className="min-h-screen bg-slate-900 p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <p className="text-slate-400 text-sm">Upload, organize, and manage your media assets</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
          <Button variant="outline" className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Folder
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search media by name or tags..."
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
                {option.label} ({option.count})
              </button>
            ))}
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-purple-600 text-white" : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list" ? "bg-purple-600 text-white" : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Items Actions */}
      {selectedItems.length > 0 && (
        <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">
              {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-700">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button size="sm" variant="outline" className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-700">
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

      {/* Edit Media Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Media</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-800">
                  <img 
                    src={editingItem.src} 
                    alt={editingItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 flex-1">
                    <Crop className="w-4 h-4 mr-2" />
                    Crop
                  </Button>
                  <Button variant="outline" className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 flex-1">
                    <Palette className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <Button variant="outline" className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 flex-1">
                    <Sliders className="w-4 h-4 mr-2" />
                    Adjust
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-200 mb-2 block">Title</label>
                  <Input 
                    defaultValue={editingItem.title}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200 mb-2 block">Tags</label>
                  <Input 
                    defaultValue={editingItem.tags.join(", ")}
                    placeholder="Enter tags separated by commas"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-200 mb-2 block">Dimensions</label>
                    <Input 
                      defaultValue={editingItem.dimensions}
                      className="bg-slate-800 border-slate-700 text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-200 mb-2 block">File Size</label>
                    <Input 
                      defaultValue={editingItem.size}
                      className="bg-slate-800 border-slate-700 text-white"
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white flex-1">
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                    onClick={() => setEditingItem(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}