"use client";

import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Pencil, Camera, X } from "lucide-react";
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
import { FACILITY_CATEGORIES } from "@/constants/facilities";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const FACILITY_IMAGE_SIZE = { w: 960, h: 480 };

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
  facilityName: z.string().min(2, "Required"),
  address: z.string().min(5, "Required"),
  city: z.string().min(2, "Required"),
  zipCode: z.string().min(5, "Required"),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").or(z.literal("")),
  description: z.string().min(10, "Required"),
  amenities: z.array(z.string()).min(1, "Select at least one"),
  hours: z.string().optional(),
  facilityType: z.enum(["in-person", "app", "at-home-trainer", "tournament-teams"]).optional(),
  imageUrl: z.string().optional(),
});

const facilityTypes = [
  { value: "in-person", label: "In Person" },
  { value: "app", label: "App" },
  { value: "at-home-trainer", label: "At Home Trainer" },
  { value: "tournament-teams", label: "Tournament Teams" },
] as const;

type FacilityData = {
  id: string;
  facilityName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string | null;
  website: string | null;
  description: string;
  amenities: string[];
  hours?: string | null;
  facilityType?: string | null;
  imageUrl?: string | null;
};

interface AdminEditFacilityModalProps {
  facility: FacilityData;
  onSaved: () => void;
}

export default function AdminEditFacilityModal({ facility, onSaved }: AdminEditFacilityModalProps) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facilityName: "",
      address: "",
      city: "",
      zipCode: "",
      phone: "",
      website: "",
      description: "",
      amenities: [],
      hours: "",
      facilityType: undefined,
      imageUrl: "",
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
      const dataUrl = await resizeImageFile(file, FACILITY_IMAGE_SIZE.w, FACILITY_IMAGE_SIZE.h);
      form.setValue("imageUrl", dataUrl);
    } catch {
      toast.error("Failed to process image");
    }
    e.target.value = "";
  };

  useEffect(() => {
    if (open && facility) {
      form.reset({
        facilityName: facility.facilityName,
        address: facility.address,
        city: facility.city,
        zipCode: facility.zipCode,
        phone: facility.phone ?? "",
        website: facility.website ?? "",
        description: facility.description,
        amenities: facility.amenities?.length ? facility.amenities : [],
        hours: facility.hours ?? "",
        facilityType: (facility.facilityType as "in-person" | "app" | "at-home-trainer" | "tournament-teams") || undefined,
        imageUrl: facility.imageUrl ?? "",
      });
    }
  }, [open, facility, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch(`/api/admin/facility-submissions/${facility.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facilityName: values.facilityName,
          address: values.address,
          city: values.city,
          zipCode: values.zipCode,
          phone: values.phone || null,
          website: values.website || undefined,
          description: values.description,
          hours: values.hours || undefined,
          facilityType: values.facilityType || undefined,
          amenities: values.amenities,
          imageUrl: values.imageUrl || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error ?? "Failed to save");
        return;
      }
      toast.success("Training updated.");
      setOpen(false);
      onSaved();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-amber-500 text-amber-400 hover:bg-amber-500/10"
        >
          <Pencil className="w-4 h-4 mr-1" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <div className="mb-6">
          <DialogTitle className="text-xl font-bold text-white">
            Edit Training
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm mt-1">
            Update details for {facility.facilityName}.
          </DialogDescription>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FormLabel className="text-slate-300">Image</FormLabel>
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
              name="facilityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Training Name</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Arctic Ice Arena"
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
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

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
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Hours (optional)</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Mon–Sun · 6 AM – 11 PM"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facilityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Type</FormLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(v) => field.onChange(v || undefined)}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {facilityTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

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

            <div>
              <FormLabel className="text-slate-300">Amenities</FormLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {FACILITY_CATEGORIES.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 border border-slate-600 rounded p-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item)}
                            onCheckedChange={(c) =>
                              c
                                ? field.onChange([...(field.value ?? []), item])
                                : field.onChange(
                                    (field.value ?? []).filter((v) => v !== item)
                                  )
                            }
                            className="border-slate-500 data-[state=checked]:bg-amber-600"
                          />
                        </FormControl>
                        <FormLabel className="text-slate-300 text-sm cursor-pointer">
                          {item}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage className="text-red-400">
                {form.formState.errors.amenities?.message}
              </FormMessage>
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
