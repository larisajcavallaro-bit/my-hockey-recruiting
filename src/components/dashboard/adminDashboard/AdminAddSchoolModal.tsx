"use client";

import { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, Camera, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
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
import { GENDER_OPTIONS, AGE_BRACKETS } from "@/constants/schools";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const SCHOOL_IMAGE_SIZE = { w: 960, h: 480 };

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
  name: z.string().min(2, "Required"),
  address: z.string().min(5, "Required"),
  city: z.string().min(2, "Required"),
  zipCode: z.string().min(5, "Required"),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").or(z.literal("")),
  description: z.string().min(10, "Required"),
  imageUrl: z.string().optional(),
  gender: z.array(z.string()),
  league: z.array(z.string()),
  ageBracketFrom: z.string().optional(),
  ageBracketTo: z.string().optional(),
});

const defaultFormValues = {
  name: "",
  address: "",
  city: "",
  zipCode: "",
  phone: "",
  website: "",
  description: "",
  imageUrl: "",
  gender: [] as string[],
  league: [] as string[],
  ageBracketFrom: "",
  ageBracketTo: "",
};

interface AdminAddSchoolModalProps {
  onAdded: () => void;
}

export default function AdminAddSchoolModal({ onAdded }: AdminAddSchoolModalProps) {
  const [open, setOpen] = useState(false);
  const [leagues, setLeagues] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (open) {
      fetch("/api/admin/lookups?category=league")
        .then((r) => r.json())
        .then((data) => {
          const vals = (data.lookups ?? []).map((l: { value: string }) => l.value);
          setLeagues(vals);
        })
        .catch(() => setLeagues([]));
    }
  }, [open]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, etc.)");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) toast.error("Image will be resized (max 2MB).");
    try {
      const dataUrl = await resizeImageFile(file, SCHOOL_IMAGE_SIZE.w, SCHOOL_IMAGE_SIZE.h);
      form.setValue("imageUrl", dataUrl);
    } catch {
      toast.error("Failed to process image");
    }
    e.target.value = "";
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch("/api/admin/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: values.website || undefined,
          league: values.league,
          ageBracketFrom: values.ageBracketFrom || undefined,
          ageBracketTo: values.ageBracketTo || undefined,
          imageUrl: values.imageUrl || undefined,
          gender: values.gender,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error ?? "Failed to add school");
        return;
      }
      toast.success("School added. It's live on the Teams and Schools page now.");
      form.reset(defaultFormValues);
      setOpen(false);
      onAdded();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Plus className="w-4 h-4 mr-1" /> Add School
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <div className="mb-6">
          <DialogTitle className="text-xl font-bold text-white">
            Add School / Program
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm mt-1">
            Create a new school or program. It will appear on the Teams and Schools page immediately.
          </DialogDescription>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FormLabel className="text-slate-300">Image (optional)</FormLabel>
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
                  <p className="text-slate-500 text-xs mt-1">JPEG/PNG, max 2MB</p>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Name</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="NE Knights AAA"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Address</FormLabel>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">City</FormLabel>
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
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Zip Code</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Phone</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="(612) 555-0123"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Website</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="https://..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="league"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Leagues (multiselect)</FormLabel>
                  <p className="text-slate-500 text-xs mb-2">Programs can span multiple leagues as players get older.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {leagues.map((l) => (
                      <div
                        key={l}
                        className="flex items-center space-x-2 border border-slate-600 rounded p-2"
                      >
                        <Checkbox
                          id={`league-${l}`}
                          checked={field.value?.includes(l)}
                          onCheckedChange={(c) =>
                            c
                              ? field.onChange([...(field.value ?? []), l])
                              : field.onChange((field.value ?? []).filter((v) => v !== l))
                          }
                          className="border-slate-500 data-[state=checked]:bg-amber-600"
                        />
                        <label
                          htmlFor={`league-${l}`}
                          className="text-slate-300 text-sm cursor-pointer"
                        >
                          {l}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      className="flex-1 bg-slate-700 border-slate-600 text-white"
                      placeholder="Add custom league (type & press Enter)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          const v = input.value.trim();
                          if (v && !(field.value ?? []).includes(v) && !leagues.includes(v)) {
                            field.onChange([...(field.value ?? []), v]);
                            input.value = "";
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-slate-500 text-slate-300 shrink-0"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add custom league (type & press Enter)"]') as HTMLInputElement;
                        const v = input?.value?.trim();
                        if (v && !(field.value ?? []).includes(v) && !leagues.includes(v)) {
                          field.onChange([...(field.value ?? []), v]);
                          input.value = "";
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  {(field.value ?? []).filter((l) => !leagues.includes(l)).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(field.value ?? []).filter((l) => !leagues.includes(l)).map((l) => (
                        <span
                          key={l}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-600 text-slate-300 text-sm"
                        >
                          {l}
                          <button
                            type="button"
                            onClick={() => field.onChange((field.value ?? []).filter((x) => x !== l))}
                            className="hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="text-slate-300">Gender</FormLabel>
              <div className="flex flex-wrap gap-3 mt-2">
                {GENDER_OPTIONS.map((opt) => (
                  <FormField
                    key={opt}
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(opt)}
                            onCheckedChange={(c) =>
                              c
                                ? field.onChange([...(field.value ?? []), opt])
                                : field.onChange(
                                    (field.value ?? []).filter((v) => v !== opt)
                                  )
                            }
                            className="border-slate-500 data-[state=checked]:bg-amber-600"
                          />
                        </FormControl>
                        <FormLabel className="text-slate-300 text-sm cursor-pointer">
                          {opt}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ageBracketFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Age Bracket From</FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={(v) => field.onChange(v)}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="U6" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AGE_BRACKETS.map((a) => (
                          <SelectItem key={a} value={a}>
                            {a}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ageBracketTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Age Bracket To</FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={(v) => field.onChange(v)}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="U20" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AGE_BRACKETS.map((a) => (
                          <SelectItem key={a} value={a}>
                            {a}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              Add School
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
