"use client";

import React, { useState } from "react";
import { Lock, Shield, Trash2 } from "lucide-react";
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

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    {
      id: "1",
      name: "Sarah Williams",
      role: "Coach",
      blockedDate: "Blocked on Dec 29, 2024",
      image: "/newasset/parent/coaches/coach1.png",
    },
    {
      id: "2",
      name: "Sarah Williams",
      role: "Coach",
      blockedDate: "Blocked on Dec 29, 2024",
      image: "/newasset/parent/coaches/coach1.png",
    },
    {
      id: "3",
      name: "Sarah Williams",
      role: "Coach",
      blockedDate: "Blocked on Dec 29, 2024",
      image: "/newasset/parent/coaches/coach1.png",
    },
  ]);

  const handleUnblock = (id: string) => {
    setBlockedUsers(blockedUsers.filter((user) => user.id !== id));
  };

  const handlePasswordUpdate = () => {
    console.log("Password update:", passwordForm);
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="space-y-6">
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
              className="bg-button-clr1 hover:bg-button-clr1/50 text-white font-semibold w-full mt-4"
            >
              Update Password
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
            {blockedUsers.length > 0 ? (
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
                    variant="outline"
                    className="
                w-full sm:w-auto
                bg-button-clr1 hover:bg-blue-700
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
