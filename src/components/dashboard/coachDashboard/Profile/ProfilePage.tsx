"use client";

import Image from "next/image";
import { Edit2, Mail, Phone, MapPin, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Child {
  id: string;
  name: string;
  age?: number;
  team?: string;
}

export default function ProfilePage() {
  const parent = {
    name: "Alex Johnson",
    role: "Parent",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "Toronto, ON",
    avatarInitial: "AJ",
    bio: "Passionate about supporting my child's hockey journey. Available for communication weekdays after 5 PM.",
  };

  const children: Child[] = [
    { id: "c1", name: "Emma Johnson", age: 10, team: "U12 Hawks" },
    { id: "c2", name: "Noah Johnson", age: 8, team: "U10 Falcons" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-sub-text1/90 mt-1">
            Manage your account and family details
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="bg-button-clr1 hover:bg-blue-700 text-sub-text3"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <Card className="p-6 mb-6 bg-secondary-foreground/20 ">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-background text-sub-text font-semibold">
                {parent.avatarInitial}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{parent.name}</h2>
              <p className="text-sm text-sub-text1 mt-1">{parent.role}</p>
              <p className="mt-2 text-sm text-sub-text1/80 max-w-xl">
                {parent.bio}
              </p>
            </div>
          </div>

          <div className="ml-auto flex flex-col sm:flex-row gap-3 ">
            {/* <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> Message
            </Button> */}
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-sub-text1/80 mt-1" />
            <div>
              <p className="text-xs text-sub-text1/80">Email</p>
              <p className="text-sm font-medium text-gray-800">
                {parent.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-sub-text1/80 mt-1" />
            <div>
              <p className="text-xs text-sub-text1/80">Phone</p>
              <p className="text-sm font-medium text-gray-800">
                {parent.phone}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-sub-text1/80 mt-1" />
            <div>
              <p className="text-xs text-sub-text1/80">Location</p>
              <p className="text-sm font-medium text-gray-800">
                {parent.location}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Content Area: Spans 2 columns on Large screens, full width on Mobile/Tablet */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-4 md:p-6 bg-secondary-foreground/20 border-button-clr1 border-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Children</h3>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add Child
              </Button>
            </div>

            <div className="space-y-4">
              {children.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-secondary-foreground/40 p-4 rounded-2xl gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                      {c.name.split(" ")[0].charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 leading-none">
                        {c.name}
                      </p>
                      <p className="text-xs text-sub-text3/60 mt-1">
                        Age {c.age} • {c.team}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      View
                    </Button>
                    <Button size="sm" className="flex-1 sm:flex-none">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 md:p-6 bg-secondary-foreground/20">
            <h3 className="text-lg font-semibold mb-3">Account Settings</h3>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">Profile Visibility</p>
                    <p className="text-xs text-sub-text3/60">
                      Control who can see your profile
                    </p>
                  </div>
                </div>
                <div className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                  Public
                </div>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">Connected Accounts</p>
                    <p className="text-xs text-sub-text3/60">
                      Manage third-party sign-ins
                    </p>
                  </div>
                </div>
                <div className="text-xs font-medium bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                  2 connected
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Area: Spans 1 column on Tablet (right side) and Desktop */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6 bg-secondary-foreground/20 h-full lg:h-auto">
            <h3 className="text-lg font-semibold mb-2">Activity Summary</h3>
            <p className="text-sm text-sub-text1/80 mb-4">
              Quick stats about your recent activity
            </p>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                <p className="text-3xl font-bold text-gray-900">3</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notifications
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button size="sm" className="w-full">
                View Activity
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-secondary-foreground/20">
            <h3 className="text-lg font-semibold mb-2">Security</h3>
            <p className="text-sm text-sub-text1/80 mb-4">
              Manage password, 2FA and sessions
            </p>
            <Button size="sm" className="w-full">
              Security Settings
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
