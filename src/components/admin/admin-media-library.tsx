"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Check,
  Copy,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type MediaAsset } from "@/lib/cms-crm-store";

export function AdminMediaLibrarySection({
  assets,
  onAddAsset,
  onDeleteAsset,
}: {
  assets: MediaAsset[];
  onAddAsset: (asset: MediaAsset) => void;
  onDeleteAsset: (id: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload Form State
  const [assetName, setAssetName] = useState("");
  const [assetUrl, setAssetUrl] = useState("");
  const [assetAlt, setAssetAlt] = useState("");
  const [assetCategory, setAssetCategory] = useState<MediaAsset["category"]>("Photography");
  const [assetDimensions, setAssetDimensions] = useState("1920x1080");

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.alt || a.altText || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  function handleCopy(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAssetName(file.name.replace(/\.[^/.]+$/, ""));
    setAssetAlt(file.name.replace(/\.[^/.]+$/, ""));

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAssetUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleSaveAsset(e: React.FormEvent) {
    e.preventDefault();
    if (!assetName.trim() || !assetUrl.trim()) return;

    const newAsset: MediaAsset = {
      id: `media-${Date.now()}`,
      name: assetName,
      url: assetUrl,
      alt: assetAlt || assetName,
      altText: assetAlt || assetName,
      category: assetCategory,
      dimensions: assetDimensions,
      fileSize: "450 KB",
      format: "JPEG",
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    onAddAsset(newAsset);
    setIsUploadModalOpen(false);
    setAssetName("");
    setAssetUrl("");
    setAssetAlt("");
  }

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Media Assets & Content Repository
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage high-resolution field photography, verified consent assets, organizational logos, and policy PDFs.
          </p>
        </div>

        <Button
          onClick={() => setIsUploadModalOpen(true)}
          size="sm"
          className="text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          Upload New Asset
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets by name or alt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Photography", "Logos", "Reports", "Icons"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="relative aspect-4/3 w-full bg-muted/50 overflow-hidden">
              <Image
                src={asset.url}
                alt={asset.alt || asset.altText || asset.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(asset.url, asset.id);
                  }}
                  className="rounded-full bg-white/90 p-2 text-black hover:bg-white shadow-sm"
                  title="Copy URL"
                >
                  {copiedId === asset.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-2.5">
              <p className="truncate text-xs font-semibold text-foreground">
                {asset.name}
              </p>
              <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{asset.category}</span>
                <span>{asset.dimensions}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ASSET INSPECTOR MODAL */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setSelectedAsset(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-foreground">{selectedAsset.name}</h3>

            <div className="relative mt-4 aspect-16/10 w-full overflow-hidden rounded-2xl border border-border bg-muted">
              <Image
                src={selectedAsset.url}
                alt={selectedAsset.alt || selectedAsset.altText || selectedAsset.name}
                fill
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="mt-4 space-y-2 rounded-2xl bg-muted/40 p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-semibold">{selectedAsset.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dimensions:</span>
                <span className="font-semibold font-mono">{selectedAsset.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">File Size:</span>
                <span className="font-semibold font-mono">{selectedAsset.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uploaded Date:</span>
                <span className="font-semibold">{selectedAsset.uploadedAt}</span>
              </div>
              <div className="pt-2">
                <span className="text-muted-foreground block mb-1">Alt Text (Accessibility & SEO):</span>
                <p className="rounded-lg bg-card border border-border p-2 text-foreground font-mono text-[11px]">
                  {selectedAsset.alt || selectedAsset.altText || selectedAsset.name}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Asset URL:</span>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={selectedAsset.url}
                    className="h-7 text-[11px] font-mono"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(selectedAsset.url, selectedAsset.id)}
                    className="h-7 text-xs shrink-0"
                  >
                    {copiedId === selectedAsset.id ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm(`Delete asset "${selectedAsset.name}"?`)) {
                    onDeleteAsset(selectedAsset.id);
                    setSelectedAsset(null);
                  }
                }}
                className="text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Delete Asset
              </Button>

              <Button
                size="sm"
                onClick={() => setSelectedAsset(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD / ADD ASSET MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-foreground">Upload Media Asset</h3>
            <p className="text-xs text-muted-foreground">Add field photos, donor reports, or infographics to the CMS.</p>

            <form onSubmit={handleSaveAsset} className="mt-4 space-y-3">
              <div>
                <Label className="text-xs">Select Local File (or enter URL below)</Label>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="mt-1 text-xs cursor-pointer"
                />
              </div>

              <div>
                <Label className="text-xs">Asset Name *</Label>
                <Input
                  required
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="e.g. Tom Brown Distribution Sokoto 2026"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs">Direct Image/File URL *</Label>
                <Input
                  required
                  value={assetUrl}
                  onChange={(e) => setAssetUrl(e.target.value)}
                  placeholder="https://... or /images/..."
                  className="mt-1 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Category</Label>
                  <select
                    value={assetCategory}
                    onChange={(e) => setAssetCategory(e.target.value as MediaAsset["category"])}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="Photography">Photography</option>
                    <option value="Logos">Logos</option>
                    <option value="Reports">Reports</option>
                    <option value="Icons">Icons</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Dimensions</Label>
                  <Input
                    value={assetDimensions}
                    onChange={(e) => setAssetDimensions(e.target.value)}
                    placeholder="1920x1080"
                    className="mt-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Alt Text (Accessible Description) *</Label>
                <Input
                  required
                  value={assetAlt}
                  onChange={(e) => setAssetAlt(e.target.value)}
                  placeholder="Describe image content for screen readers & SEO"
                  className="mt-1 text-xs"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Save to Media Library
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
