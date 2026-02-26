"use client";

import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Lock, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface BlockedUser {
  id: string;
  name: string;
  role: string;
  blockedDate: string;
  image: string;
}

export default function SecuritySettings() {
  const [activeSection, setActiveSection] = useState<"password" | "blocklist">(
    "password",
  );
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [blockListLoading, setBlockListLoading] = useState(true);

  const fetchBlockList = () => {
    setBlockListLoading(true);
    fetch("/api/blocks")
      .then((r) => (r.ok ? r.json() : { blocks: [] }))
      .then((data) => {
        setBlockedUsers(
          (data.blocks ?? []).map((b: { id: string; name: string; role: string; blockedDate: string; image: string | null }) => ({
            id: b.id,
            name: b.name,
            role: b.role,
            blockedDate: b.blockedDate ? `Blocked on ${new Date(b.blockedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "Blocked",
            image: b.image ?? "/newasset/parent/coaches/coaches.png",
          }))
        );
      })
      .catch(() => setBlockedUsers([]))
      .finally(() => setBlockListLoading(false));
  };

  useEffect(() => {
    if (activeSection === "blocklist") fetchBlockList();
  }, [activeSection]);

  const handleUnblock = async (blockId: string) => {
    const res = await fetch(`/api/blocks/${blockId}`, { method: "DELETE" });
    if (res.ok) {
      setBlockedUsers((prev) => prev.filter((u) => u.id !== blockId));
      toast.success("User unblocked");
    } else {
      toast.error("Failed to unblock");
    }
  };

  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordUpdate = async () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordForm.new.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to update password");
      toast.success("Password updated successfully.");
      setPasswordForm({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sign Out */}
      <div className="bg-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogOut className="h-5 w-5 text-slate-300" />
            <div>
              <h2 className="text-lg font-semibold text-white">Sign Out</h2>
              <p className="text-sm text-sub-text3/80">
                Sign out of your account on this device.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Password Settings */}
      <div className="bg-slate-700/50 rounded-2xl p-6">
        <button
          onClick={() =>
            setActiveSection(
              activeSection === "password" ? "blocklist" : "password",
            )
          }
          className="w-full text-left"
        >
          <div className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity">
            <Lock className="h-5 w-5 text-slate-300" />
            <h2 className="text-lg font-semibold text-white">
              Password Settings
            </h2>
          </div>
          <p className="text-sm text-sub-text3/80 ml-8">
            Manage your password to keep your account secure and your family s
            information protected.
          </p>
        </button>

        {activeSection === "password" && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Current Password
              </label>
              <Input
                type="password"
                value={passwordForm.current}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, current: e.target.value })
                }
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                New Password
              </label>
              <Input
                type="password"
                value={passwordForm.new}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, new: e.target.value })
                }
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirm: e.target.value })
                }
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />
            </div>

            <Button
              onClick={handlePasswordUpdate}
              disabled={passwordLoading}
              className="bg-button-clr1 hover:bg-button-clr1/50 text-white font-semibold w-full mt-4"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        )}
      </div>

      {/* Block List */}
      <div className="bg-slate-700/50 rounded-2xl p-4 sm:p-6">
        <button
          onClick={() =>
            setActiveSection(
              activeSection === "blocklist" ? "password" : "blocklist",
            )
          }
          className="w-full text-left"
        >
          <div className="flex items-center gap-3 mb-3 sm:mb-4 cursor-pointer hover:opacity-80 transition-opacity">
            <Shield className="h-5 w-5 text-slate-300" />
            <h2 className="text-base sm:text-lg font-semibold text-white">
              Block list
            </h2>
          </div>

          <p className="text-sm text-sub-text3/80 ml-0 sm:ml-8">
            Control who can interact with your account by blocking specific
            users.
          </p>
        </button>

        {activeSection === "blocklist" && (
          <div className="mt-6 space-y-3 sm:space-y-4">
            {blockListLoading ? (
              <p className="text-slate-400 text-center py-6">Loading...</p>
            ) : blockedUsers.length > 0 ? (
              blockedUsers.map((user) => (
                <div
                  key={user.id}
                  className="
              flex flex-col sm:flex-row
              sm:items-center sm:justify-between
              gap-4
              p-4
              bg-slate-600/50
              rounded-lg
              border border-slate-600/30
            "
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={user.image}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-white font-medium text-sm sm:text-base">
                          {user.name}
                        </p>
                        <span className="text-xs bg-button-clr1 text-white px-2 py-1 rounded-2xl">
                          {user.role}
                        </span>
                      </div>

                      <p className="text-xs text-sub-text3/80">
                        {user.blockedDate}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    onClick={() => handleUnblock(user.id)}
                    disabled={blockListLoading}
                    variant="outline"
                    className="
                w-full sm:w-auto
                bg-button-clr1 
                text-white border-0 font-semibold
              "
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Unblock
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8">
                <p className="text-slate-400">No blocked users</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
