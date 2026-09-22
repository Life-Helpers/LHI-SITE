"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AdminBlogPost, BlogPostStatus } from "@/types/admin";
import { exportBlogPosts } from "@/lib/admin-data";

interface AdminCmsPostsProps {
  posts: AdminBlogPost[];
  onAddPost: (post: AdminBlogPost) => void;
  onUpdatePost: (post: AdminBlogPost) => void;
  onDeletePost: (id: string) => void;
  onLogAudit: (action: string, target: string, category: "CMS" | "Export & Backup") => void;
}

const CATEGORIES = [
  "Health & Nutrition",
  "Education & NIDAKE",
  "Child Protection",
  "Livelihoods",
  "WASH & Infrastructure",
  "Governance & PSEA",
];

export function AdminCmsPosts({
  posts,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  onLogAudit,
}: AdminCmsPostsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminBlogPost | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [readTime, setReadTime] = useState("5 min read");
  const [status, setStatus] = useState<BlogPostStatus>("Published");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
    if (selectedStatus !== "All" && p.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchAuthor = p.author.toLowerCase().includes(q);
      const matchExcerpt = p.excerpt.toLowerCase().includes(q);
      const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchAuthor || matchExcerpt || matchTag;
    }
    return true;
  });

  const publishedCount = posts.filter((p) => p.status === "Published").length;
  const draftCount = posts.filter((p) => p.status === "Draft").length;
  const scheduledCount = posts.filter((p) => p.status === "Scheduled").length;
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);

  function handleExport(format: "csv" | "json") {
    exportBlogPosts(filteredPosts, format);
    onLogAudit(
      `Exported Field Blog Posts (${format.toUpperCase()})`,
      `${filteredPosts.length} articles exported`,
      "Export & Backup"
    );
  }

  function handleOpenCreate() {
    setEditingPost(null);
    setTitle("");
    setAuthor("LHI Editorial Desk");
    setAuthorRole("Field Technical Advisor");
    setCategory(CATEGORIES[0]);
    setReadTime("5 min read");
    setStatus("Published");
    setExcerpt("");
    setTags("");
    setFeatured(false);
    setIsCreateModalOpen(true);
  }

  function handleOpenEdit(post: AdminBlogPost) {
    setEditingPost(post);
    setTitle(post.title);
    setAuthor(post.author);
    setAuthorRole(post.authorRole);
    setCategory(post.category);
    setReadTime(post.readTime);
    setStatus(post.status);
    setExcerpt(post.excerpt);
    setTags(post.tags.join(", "));
    setFeatured(post.featured);
    setIsCreateModalOpen(true);
  }

  function handleSavePost(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);

    const parsedTags = tags
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : ["Humanitarian", "Field Dispatch"];

    const todayStr = new Date().toISOString().split("T")[0];

    if (editingPost) {
      const updated: AdminBlogPost = {
        ...editingPost,
        title: title.trim(),
        slug,
        author: author.trim(),
        authorRole: authorRole.trim() || "Technical Advisor",
        category,
        readTime,
        status,
        excerpt: excerpt.trim(),
        tags: parsedTags,
        featured,
        updatedAt: todayStr,
      };
      onUpdatePost(updated);
      onLogAudit("Updated Blog Dispatch", updated.title, "CMS");
    } else {
      const newPost: AdminBlogPost = {
        id: `post-${Date.now().toString().slice(-4)}`,
        slug,
        title: title.trim(),
        author: author.trim(),
        authorRole: authorRole.trim() || "Technical Advisor",
        category,
        date: todayStr,
        readTime,
        status,
        excerpt: excerpt.trim(),
        tags: parsedTags,
        views: 1,
        featured,
        createdAt: todayStr,
        updatedAt: todayStr,
      };
      onAddPost(newPost);
      onLogAudit("Authored New Blog Dispatch", newPost.title, "CMS");
    }

    setIsCreateModalOpen(false);
  }

  function handleToggleStatus(post: AdminBlogPost, nextStatus: BlogPostStatus) {
    const updated = { ...post, status: nextStatus, updatedAt: new Date().toISOString().split("T")[0] };
    onUpdatePost(updated);
    onLogAudit("Changed Article Status", `${post.title} → ${nextStatus}`, "CMS");
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Dispatches
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{posts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Field reflections, case studies & research
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Published Live
            </CardTitle>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{publishedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Visible on public site at /blog</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Drafts & Scheduled
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {draftCount} <span className="text-sm font-normal text-muted-foreground">drafts</span> ·{" "}
              {scheduledCount} <span className="text-sm font-normal text-muted-foreground">scheduled</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Editorial pipeline pending publication</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Article Reads
            </CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Public knowledge dissemination reach</p>
          </CardContent>
        </Card>
      </div>

      {/* Main CMS Table & Controls */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl">Field Blog & Knowledge CMS</CardTitle>
              <CardDescription>
                Author, schedule, review, and export technical humanitarian research papers and field stories
              </CardDescription>
            </div>

            {/* Action Buttons: Export CSV, Export JSON, New Article */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("csv")}
                className="h-8 gap-1.5 text-xs font-semibold"
                title="Export articles to CSV spreadsheet"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Export CSV
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("json")}
                className="h-8 gap-1.5 text-xs font-semibold"
                title="Export articles to JSON backup"
              >
                <FileText className="h-3.5 w-3.5 text-blue-600" />
                Export JSON
              </Button>

              <Button
                size="sm"
                onClick={handleOpenCreate}
                className="h-8 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
                New Article
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles by title, author, tag, or excerpt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="All">All Statuses ({posts.length})</option>
                <option value="Published">Published ({publishedCount})</option>
                <option value="Draft">Draft ({draftCount})</option>
                <option value="Scheduled">Scheduled ({scheduledCount})</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="px-4 py-3">Article Title & Excerpt</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Author & Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Views</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No blog articles match your current query.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 max-w-sm">
                        <div className="flex items-center gap-1.5 font-semibold text-foreground">
                          {post.title}
                          {post.featured && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.2 text-[9px] font-bold text-amber-700 dark:text-amber-300">
                              <Sparkles className="h-2.5 w-2.5" /> Featured
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">{post.excerpt}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-muted px-1.5 py-0.2 text-[9px] font-medium text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                          {post.category}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{post.author}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {post.date} · {post.readTime}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <select
                          value={post.status}
                          onChange={(e) => handleToggleStatus(post, e.target.value as BlogPostStatus)}
                          className={`rounded border px-2 py-1 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-primary ${
                            post.status === "Published"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                              : post.status === "Draft"
                              ? "border-border bg-muted text-muted-foreground"
                              : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                          }`}
                        >
                          <option value="Published">Published</option>
                          <option value="Draft">Draft</option>
                          <option value="Scheduled">Scheduled</option>
                        </select>
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-medium text-foreground">
                        {post.views.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(post)}
                            className="h-7 px-2 text-xs text-primary"
                          >
                            Edit
                          </Button>
                          <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">
                            <Link href="/blog" target="_blank" title="View live on public site">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeletePost(post.id)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            title="Delete article"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create / Edit Article Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                {editingPost ? "Edit Field Article" : "Author New Field Dispatch"}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-foreground">Article Headline *</label>
                <Input
                  required
                  placeholder="e.g. Scaling Community-led Nutrition in North-West Nigeria"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-semibold text-foreground">Author Name *</label>
                  <Input
                    required
                    placeholder="e.g. Dr. Salisu Kangiwa"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-foreground">Author Role / Designation</label>
                  <Input
                    placeholder="e.g. MIYCN Nutrition Lead"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block font-semibold text-foreground">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-foreground">Read Time</label>
                  <Input
                    placeholder="e.g. 5 min read"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-foreground">Publication Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as BlogPostStatus)}
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-foreground">Executive Excerpt *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Summary snippet displayed on public blog feed and cards..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-foreground">Tags (comma-separated)</label>
                <Input
                  placeholder="Nutrition, Sokoto, Tom Brown, Food Security"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-article"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-border"
                />
                <label htmlFor="featured-article" className="text-xs font-semibold text-foreground cursor-pointer">
                  Feature this article prominently on the homepage and blog header
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                  {editingPost ? "Save Changes" : "Create Article"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
