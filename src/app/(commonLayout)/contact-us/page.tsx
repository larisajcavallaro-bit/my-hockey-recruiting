"use client";

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

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-white py-20 px-4">
      {/* Page Header */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-[42px] font-bold text-[#111827] mb-4 tracking-tight">
          Help Center
        </h1>
        <p className="text-[#6B7280] text-lg font-normal max-w-3xl mx-auto leading-relaxed">
          Questions, issues or feedback? We are here to help. Use the form below
          to report a problem or ask a question, and we will take a look.
        </p>
      </div>

      {/* Main Contact Card */}
      <Card className="max-w-[1100px] mx-auto border-[#D1D5DB] rounded-xl shadow-none">
        <CardContent className="p-10 md:p-12">
          <h2 className="text-[24px] font-bold text-[#111827] mb-10">
            Get in Touch
          </h2>

          <form className="space-y-8">
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
                  placeholder="Enter your first name"
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
                  placeholder="Enter your last name"
                  className="h-[52px] bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 placeholder:text-[#9CA3AF] focus-visible:ring-blue-500 shadow-none"
                />
              </div>
            </div>

            {/* Email Field */}
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
                placeholder="Enter the email we should reply to"
                className="h-[52px] bg-[#F9FAFB]/50 border-[#E5E7EB] rounded-lg px-4 placeholder:text-[#9CA3AF] focus-visible:ring-blue-500 shadow-none"
              />
            </div>

            {/* Issue Select */}
            <div className="space-y-3 text-sub-text3">
              <Label
                htmlFor="issue"
                className="text-[15px] font-semibold text-sub-text3"
              >
                What is this issue related to?
              </Label>
              <Select name="issue" required>
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
                    Missing or incorrect team, league, or level information
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
                placeholder="Please describe the issue and include any relevant details."
                className="min-h-[160px] bg-[#F9FAFB] border-[#E5E7EB] rounded-lg p-4 placeholder:text-[#9CA3AF] focus-visible:ring-blue-500 shadow-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] h-[52px] text-white font-bold text-base rounded-lg transition-colors shadow-none"
            >
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
