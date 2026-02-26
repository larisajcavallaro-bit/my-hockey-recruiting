"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  AlertTriangle,
  Building2,
  GraduationCap,
  FileText,
  ListOrdered,
  Users,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    contactMessages: 0,
    pendingDisputes: 0,
    pendingFacilitySubmissions: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [messagesRes, disputesRes, facilitiesRes, usersRes] =
          await Promise.all([
            fetch("/api/admin/contact-messages?limit=1"),
            fetch("/api/admin/disputes?status=pending"),
            fetch("/api/admin/facility-submissions?status=pending"),
            fetch("/api/admin/users?limit=1"),
          ]);

        const [messagesData, disputesData, facilitiesData, usersData] =
          await Promise.all([
            messagesRes.json(),
            disputesRes.json(),
            facilitiesRes.json(),
            usersRes.json(),
          ]);

        setStats({
          contactMessages: messagesData?.total ?? 0,
          pendingDisputes: Array.isArray(disputesData?.disputes)
            ? disputesData.disputes.length
            : 0,
          pendingFacilitySubmissions: Array.isArray(facilitiesData?.submissions)
            ? facilitiesData.submissions.length
            : 0,
          totalUsers: usersData?.total ?? 0,
        });
      } catch {
        // ignore
      }
    };
    void fetchStats();
  }, []);

  const cards = [
    {
      title: "Contact Messages",
      value: stats.contactMessages,
      href: "/admin-dashboard/contact-messages",
      icon: MessageSquare,
    },
    {
      title: "Pending Disputes",
      value: stats.pendingDisputes,
      href: "/admin-dashboard/disputes",
      icon: AlertTriangle,
    },
    {
      title: "Pending Training Submissions",
      value: stats.pendingFacilitySubmissions,
      href: "/admin-dashboard/facility-submissions",
      icon: Building2,
    },
    {
      title: "Schools & Programs",
      value: "Manage",
      href: "/admin-dashboard/schools",
      icon: GraduationCap,
    },
    {
      title: "Team Management",
      value: "Manage",
      href: "/admin-dashboard/lookups",
      icon: ListOrdered,
    },
    {
      title: "Blog Posts",
      value: "Manage",
      href: "/admin-dashboard/blog-posts",
      icon: FileText,
    },
    {
      title: "Users",
      value: stats.totalUsers,
      href: "/admin-dashboard/users",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="text-slate-400 mt-1">
          Manage teams, schools, contact messages, disputes, training, and users.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}>
              <Card className="bg-slate-800 border-slate-700 hover:border-amber-500/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    {card.title}
                  </CardTitle>
                  <Icon className="w-4 h-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      {card.value}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
