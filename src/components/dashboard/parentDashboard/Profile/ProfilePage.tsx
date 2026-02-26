"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit2, Mail, Phone, MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AddPlayerDialog from "@/components/dashboard/parentDashboard/Players/AddPlayerDialog";
import EditProfileDialog from "./EditProfileDialog";
import SubscriptionUpsellCard from "@/components/dashboard/parentDashboard/overview/SubscriptionUpsellCard";

function formatPhoneDisplay(value: string): string {
  if (!value) return "";
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (digits.length > 10) digits = digits.slice(0, 10);
  if (digits.length <= 3) return digits ? `(${digits}` : digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

interface Child {
  id: string;
  name: string;
  age?: number;
  team?: string;
}

export default function ProfilePage() {
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [parent, setParent] = useState({
    name: "",
    role: "Parent",
    email: "",
    phone: "",
    location: "",
    avatarInitial: "",
    bio: "",
    socialLink: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);

  const [children, setChildren] = useState<Child[]>([]);

  const fetchProfile = () => {
    setProfileLoading(true);
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setParent((p) => ({
            ...p,
            name: data.name ?? "",
            email: data.email ?? "",
            phone: data.phone ? formatPhoneDisplay(data.phone) : "",
            location: data.location ?? "",
            bio: data.bio ?? "",
            socialLink: data.socialLink ?? "",
            avatarInitial: (data.name ?? "")
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "?",
          }));
        }
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  };

  const fetchChildren = () => {
    fetch("/api/players?mine=1")
      .then((r) => r.json())
      .then((data) => {
        const players = (data.players ?? []).map(
          (p: {
            id: string;
            name: string;
            birthYear?: number;
            age?: number;
            team?: string;
          }) => ({
            id: p.id,
            name: p.name,
            age: p.age ?? (p.birthYear ? new Date().getFullYear() - p.birthYear : undefined),
            team: p.team ?? undefined,
          }),
        );
        setChildren(players);
      })
      .catch(() => setChildren([]));
  };

  useEffect(() => {
    void Promise.resolve().then(() => {
      fetchProfile();
      fetchChildren();
    });
  }, []);

  const parentFormData = {
    name: parent.name,
    email: parent.email,
    phone: parent.phone,
    location: parent.location,
    bio: parent.bio,
    socialLink: parent.socialLink,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SubscriptionUpsellCard />

      <div className="flex items-center justify-between mb-6 mt-6">
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
            onClick={() => setEditProfileOpen(true)}
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
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setEditProfileOpen(true)}
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

          {parent.socialLink && (
            <div className="flex items-start gap-3">
              <Share2 className="w-5 h-5 text-sub-text1/80 mt-1" />
              <div>
                <p className="text-xs text-sub-text1/80">Social Media</p>
                <a
                  href={parent.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {parent.socialLink}
                </a>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 md:p-6 bg-secondary-foreground/20 border-button-clr1 border-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Children</h3>
          <AddPlayerDialog
            onSuccess={fetchChildren}
            triggerLabel="Add Child"
            triggerClassName="bg-green-600 hover:bg-green-700 text-white"
          />
        </div>

        <div className="space-y-4">
          {children.length === 0 ? (
            <p className="text-sm text-sub-text1/80 py-4">
              No children added yet. Click &quot;Add Child&quot; to add your athlete.
            </p>
          ) : (
            children.map((c) => (
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
                      {c.age != null ? `Age ${c.age}` : ""}
                      {c.team ? ` • ${c.team}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    asChild
                  >
                    <Link href={`/parent-dashboard/players/${c.id}`}>
                      View
                    </Link>
                  </Button>
                  <Button size="sm" className="flex-1 sm:flex-none" asChild>
                    <Link href={`/parent-dashboard/players/${c.id}/manage`}>
                      Manage
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <EditProfileDialog
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        initialData={parentFormData}
        onSave={(data) => {
          setParent((p) => ({
            ...p,
            name: data.name,
            email: data.email,
            phone: data.phone,
            location: data.location,
            bio: data.bio,
            socialLink: data.socialLink,
            avatarInitial: data.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2),
          }));
        }}
      />
    </div>
  );
}
