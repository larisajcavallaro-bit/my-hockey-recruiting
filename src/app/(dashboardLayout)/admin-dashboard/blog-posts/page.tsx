"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pencil, Trash2, FileText } from "lucide-react";
import AdminAddBlogPostModal from "@/components/dashboard/adminDashboard/AdminAddBlogPostModal";
import AdminEditBlogPostModal from "@/components/dashboard/adminDashboard/AdminEditBlogPostModal";

type BlogPost = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  author: string;
  category: string;
  featured: boolean;
  publishedAt: string;
  createdAt: string;
};

export default function AdminBlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchPosts = () => {
    setLoading(true);
    fetch("/api/admin/blog-posts")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setPosts(data.posts ?? []);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void Promise.resolve().then(() => fetchPosts());
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/blog-posts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error ?? "Failed to delete");
        return;
      }
      toast.success("Post deleted");
      fetchPosts();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-slate-400 text-sm mt-1">
            Create and manage blog posts. Posts appear on the blog section of your site.
          </p>
        </div>
        <AdminAddBlogPostModal onAdded={fetchPosts} />
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : posts.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="py-12 flex flex-col items-center justify-center text-slate-400">
            <FileText className="w-12 h-12 mb-3 opacity-50" />
            <p>No blog posts yet.</p>
            <p className="text-sm mt-1">Click &quot;Add Post&quot; to create your first post.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id} className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg text-white truncate">{post.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.featured && (
                        <Badge className="bg-amber-600/80 text-white">Featured</Badge>
                      )}
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                        {post.category}
                      </Badge>
                      <span className="text-slate-500 text-sm">{post.author}</span>
                      <span className="text-slate-500 text-sm">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => setEditingId(post.id)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-red-600/50 text-red-400 hover:bg-red-600/20"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt=""
                      width={96}
                      height={64}
                      className="w-24 h-16 object-cover rounded border border-slate-600"
                      unoptimized
                    />
                  )}
                  <p className="text-slate-400 text-sm line-clamp-2 flex-1">
                    {post.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingId && (() => {
        const post = posts.find((p) => p.id === editingId);
        if (!post) return null;
        return (
          <AdminEditBlogPostModal
            post={post}
            onSaved={() => {
              setEditingId(null);
              fetchPosts();
            }}
            onClose={() => setEditingId(null)}
          />
        );
      })()}
    </div>
  );
}
