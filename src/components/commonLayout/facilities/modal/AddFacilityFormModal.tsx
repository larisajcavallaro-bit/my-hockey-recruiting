"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Plus, Upload } from "lucide-react";
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

const formSchema = z.object({
  facilityName: z.string().min(2, "Required"),
  address: z.string().min(5, "Required"),
  city: z.string().min(2, "Required"),
  zipCode: z.string().min(5, "Required"),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").or(z.literal("")),
  description: z.string().min(10, "Required"),
  amenities: z.array(z.string()).min(1, "Select at least one"),
});

import { FACILITY_CATEGORIES } from "@/constants/facilities";

const amenitiesList = [...FACILITY_CATEGORIES];

export default function AddFacilityFormModal() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { amenities: [], website: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch("/api/facility-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error ?? "Failed to submit");
        return;
      }
      toast.success("Training request submitted. We will review and add it if approved.");
      form.reset({ amenities: [], website: "" });
      setOpen(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer font-medium text-sm">
          <Plus className="w-4 h-4" /> Request to Add Training
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-8 border-none">
        <div className="text-center mb-8">
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Request to Add Training
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm mt-1">
            Help others discover training locations.
          </DialogDescription>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h2 className="font-bold border-b pb-2">Basic Information</h2>

              <FormField
                control={form.control}
                name="facilityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-slate-500">
                      Training Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Arctic Ice Arena" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase text-slate-500">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase text-slate-500">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                      <FormLabel className="text-[10px] font-bold uppercase text-slate-500">
                        Zip Code
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase text-slate-500">
                        Phone (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="(612) 555-0123" {...field} />
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
                    <FormLabel className="text-[10px] font-bold uppercase text-slate-500">
                      Website
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-slate-500">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea className="h-24 resize-none" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h2 className="font-bold border-b pb-2">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenitiesList.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 border rounded-md p-3">
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
                          />
                        </FormControl>
                        <FormLabel className="text-xs cursor-pointer">
                          {item}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-slate-50 cursor-pointer transition-all group">
              <Upload className="w-5 h-5 mx-auto text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold">Upload training location photos</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-white font-bold transition-colors"
            >
              Submit for Review
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
