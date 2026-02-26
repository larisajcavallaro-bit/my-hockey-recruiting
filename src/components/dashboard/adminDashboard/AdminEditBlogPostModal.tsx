"use client";

import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOG_CATEGORIES } from "@/constants/blog";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const BLOG_IMAGE_SIZE = { w: 960, h: 480 };

function resizeImageFile(file: File, maxW: number, maxH: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxW || height > maxH) {
        const r = Math.min(maxW / width, maxH / height);
        width = Math.round(width * r);
        height = Math.round(height * r);
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas failed"));
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}

const formSchema = z.object({
  title: z.string().min(2, "Title required"),
  content: z.string().min(1, "Content required"),
  imageUrl: z.string().optional(),
  author: z.string().min(1, "Author required"),
  category: z.string().refine((c) => BLOG_CATEGORIES.includes(c as (typeof BLOG_CATEGORIES)[number]), "Select a category"),
  featured: z.boolean().optional(),
  publishedAt: z.string().min(1, "Date required"),
});

type BlogPost = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  author: string;
  category: string;
  featured: boolean;
  publishedAt: string;
};

interface AdminEditBlogPostModalProps {
  post: BlogPost;
  onSaved: () => void;
  onClose: () => void;
}

export default function AdminEditBlogPostModal({ post, onSaved, onClose }: AdminEditBlogPostModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      imageUrl: "",
      author: "",
      category: "",
      featured: false,
      publishedAt: "",
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, etc.)");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) toast.error("Image will be resized (max 2MB).");
    try {
      const dataUrl = await resizeImageFile(file, BLOG_IMAGE_SIZE.w, BLOG_IMAGE_SIZE.h);
      form.setValue("imageUrl", dataUrl);
    } catch {
      toast.error("Failed to process image");
    }
    e.target.value = "";
  };

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl ?? "",
        author: post.author,
        category: post.category,
        featured: post.featured ?? false,
        publishedAt: post.publishedAt.slice(0, 10),
      });
    }
  }, [post, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch(`/api/admin/blog-posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          content: values.content,
          imageUrl: values.imageUrl || null,
          author: values.author,
          category: values.category,
          featured: values.featured ?? false,
          publishedAt: values.publishedAt,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error ?? "Failed to update");
        return;
      }
      toast.success("Post updated");
      onSaved();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={!!post} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <div className="mb-6">
          <DialogTitle className="text-xl font-bold text-white">
            Edit Blog Post
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm mt-1">
            Update the blog post details.
          </DialogDescription>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FormLabel className="text-slate-300">Photo (optional)</FormLabel>
              <div className="mt-2 flex items-center gap-3">
                <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-slate-700 border border-slate-600 flex-shrink-0">
                  {form.watch("imageUrl") ? (
                    <>
                      <img
                        src={form.watch("imageUrl")}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => form.setValue("imageUrl", "")}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Camera className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-slate-500 text-slate-300 hover:bg-slate-700"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {form.watch("imageUrl") ? "Replace" : "Upload"}
                  </Button>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Header (Title)</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-700 border-slate-600 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Content</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Author</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-slate-700 border-slate-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Date</FormLabel>
                    <FormControl>
                      <Input type="date" className="bg-slate-700 border-slate-600 text-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 rounded-lg border border-slate-600 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-slate-500 data-[state=checked]:bg-amber-600"
                    />
                  </FormControl>
                  <FormLabel className="text-slate-300 cursor-pointer">
                    Featured (shows at top of blog page until changed)
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Category</FormLabel>
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BLOG_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="border-slate-600" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
