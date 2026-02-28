"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function ContactUs() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const topicParam = searchParams.get("topic");
    if (topicParam) setTopic(topicParam);
  }, [searchParams]);

  useEffect(() => {
    if (session?.user) {
      const name = (session.user as { name?: string | null })?.name ?? "";
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        setFirstName(parts[0] ?? "");
        setLastName(parts.slice(1).join(" ") ?? "");
      } else if (parts.length === 1) {
        setFirstName(parts[0] ?? "");
      }
      const em = (session.user as { email?: string | null })?.email ?? "";
      if (em) setEmail(em);
    }
  }, [session?.user]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setTopic("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!topic.trim()) {
      toast.error("Please select a topic.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          topic,
          message: message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg = data?.error ?? (data?.details ? String(data.details) : null) ?? "Something went wrong. Please try again.";
        toast.error(errMsg);
        return;
      }
      toast.success(session ? "We received your message. We'll reply in your Messages—check your dashboard." : "We received your message. We'll reply to the email you provided.");
      resetForm();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white py-20 px-4 flex items-center justify-center">
        <p className="text-[#6B7280]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20 px-4">
      {/* Page Header */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-[42px] font-bold text-[#111827] mb-4 tracking-tight">
          Help Center
        </h1>
        <p className="text-[#6B7280] text-lg font-normal max-w-3xl mx-auto leading-relaxed">
          Questions, issues or feedback? We are here to help. Use the form below to report a problem or ask a question.
          {session ? " We'll reply in your Messages." : " We'll reply to the email you provide. No account needed to contact us."}
        </p>
      </div>

      {/* Main Contact Card */}
      <Card className="max-w-[1100px] mx-auto border-[#D1D5DB] rounded-xl shadow-none">
        <CardContent className="p-10 md:p-12">
          <h2 className="text-[24px] font-bold text-[#111827] mb-10">
            Get in Touch
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label
                  htmlFor="firstName"
                  className="text-[15px] font-semibold text-[#374151]"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  required
                  className="h-[52px] bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 placeholder:text-[#9CA3AF] focus-visible:ring-blue-500 shadow-none"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="lastName"
                  className="text-[15px] font-semibold text-[#374151]"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  required
                  className="h-[52px] bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 placeholder:text-[#9CA3AF] focus-visible:ring-blue-500 shadow-none"
                />
              </div>
            </div>

            {/* Email Field - from account when logged in */}
            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-[15px] font-semibold text-[#374151]"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email we should reply to"
                required
                readOnly={!!session?.user}
                className="h-[52px] bg-[#F9FAFB]/50 border-[#E5E7EB] rounded-lg px-4 placeholder:text-[#9CA3AF] focus-visible:ring-blue-500 shadow-none"
              />
            </div>

            {/* Issue Select */}
            <div className="space-y-3">
              <Label
                htmlFor="issue"
                className="text-[15px] font-semibold text-[#374151]"
              >
                Topic
              </Label>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger className="w-full h-[52px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 text-sub-text1 shadow-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                  <SelectValue
                    placeholder="Select your issue."
                    className="placeholder:text-[#9CA3AF]"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white text-sub-text1 border-[#E5E7EB] rounded-lg shadow-lg">
                  <SelectItem
                    value="coach-verification"
                    className="py-3 cursor-pointer"
                  >
                    Coach credential or verification issue
                  </SelectItem>
                  <SelectItem
                    value="info-correction"
                    className="py-3 cursor-pointer"
                  >
                    Missing or incorrect team, school, league, or level information
                  </SelectItem>
                  <SelectItem
                    value="head-coach-dispute"
                    className="py-3 cursor-pointer"
                  >
                    Head coach dispute (another coach already claimed this team/level/birth year)
                  </SelectItem>
                  <SelectItem
                    value="visibility-access"
                    className="py-3 cursor-pointer"
                  >
                    Profile visibility or access question
                  </SelectItem>
                  <SelectItem
                    value="event-rsvp"
                    className="py-3 cursor-pointer"
                  >
                    Event or RSVP issue
                  </SelectItem>
                  <SelectItem
                    value="billing-account"
                    className="py-3 cursor-pointer"
                  >
                    Account or billing question
                  </SelectItem>
                  <SelectItem
                    value="other"
                    className="py-3 cursor-pointer"
                  >
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message Field */}
            <div className="space-y-3">
              <Label
                htmlFor="message"
                className="text-[15px] font-semibold text-[#374151]"
              >
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe the issue and include any relevant details."
                required
                minLength={10}
                className="min-h-[160px] bg-[#F9FAFB] border-[#E5E7EB] rounded-lg p-4 placeholder:text-[#9CA3AF] focus-visible:ring-blue-500 shadow-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] h-[52px] text-white font-bold text-base rounded-lg transition-colors shadow-none disabled:opacity-70"
            >
              {submitting ? "Sending…" : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
