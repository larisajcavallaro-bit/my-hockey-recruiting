"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function CloseAccountPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const isCoach = (session?.user as { role?: string })?.role === "COACH";

  const handleCloseAccount = async () => {
    if (!confirmed) {
      toast.error("Please check the confirmation box first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/close-account", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to close account");
      await signOut({ callbackUrl: "/" });
      toast.success("Your account has been closed.");
      router.push("/");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to close account");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please sign in to close your account.
            </p>
            <Link href="/auth/sign-in">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-6 h-6" />
            <CardTitle>Close Account</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Closing your account will permanently remove:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {isCoach && (
              <>
                <li>Your coach profile</li>
                <li>Your team and roster information</li>
                <li>All verification history</li>
              </>
            )}
            <li>Your user account and login</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">
              I understand this will permanently close my account
            </span>
          </label>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCloseAccount}
              disabled={!confirmed || loading}
              className="flex-1"
            >
              {loading ? "Closing..." : "Close my account"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
