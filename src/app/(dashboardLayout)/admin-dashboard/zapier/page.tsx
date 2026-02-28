"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useMemo } from "react";

const ZAPIER_ENDPOINTS = [
  {
    name: "Contact Messages",
    path: "/api/zapier/contact-messages",
    method: "GET",
  },
  {
    name: "Disputes",
    path: "/api/zapier/disputes",
    method: "GET",
  },
  {
    name: "Training Submissions",
    path: "/api/zapier/facility-submissions",
    method: "GET",
  },
];

export default function AdminZapierPage() {
  const baseUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin;
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Zapier Integration</h1>
        <p className="text-slate-400 mt-1">
          Connect your admin data to Zapier for automation.
        </p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-slate-300 text-sm mb-2">
              Add these to your <code className="bg-slate-700 px-1 rounded">.env.local</code>:
            </p>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">ADMIN_API_KEY=</span>
                <span className="text-amber-300">your-secret-key</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("ADMIN_API_KEY=your-secret-key")}
                  className="p-1 rounded hover:bg-slate-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">ZAPIER_WEBHOOK_URL=</span>
                <span className="text-amber-300">https://hooks.zapier.com/...</span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard("ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/...")
                  }
                  className="p-1 rounded hover:bg-slate-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <p className="text-slate-300 text-sm mb-2">
              <strong>Webhook (optional):</strong> When you set{" "}
              <code className="bg-slate-700 px-1 rounded">ZAPIER_WEBHOOK_URL</code>,
              new contact messages, disputes, and training submissions are
              automatically sent to Zapier. Create a Zap with &quot;Webhooks by
              Zapier&quot; → &quot;Catch Hook&quot; and paste the URL.
            </p>
            <p className="text-slate-400 text-sm">
              Events: <code className="bg-slate-700 px-1 rounded">contact_message</code>,{" "}
              <code className="bg-slate-700 px-1 rounded">coach_review_dispute</code>,{" "}
              <code className="bg-slate-700 px-1 rounded">player_review_dispute</code>,{" "}
              <code className="bg-slate-700 px-1 rounded">facility_submission</code>,{" "}
              <code className="bg-slate-700 px-1 rounded">facebook_post</code>
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <p className="text-slate-300 text-sm font-medium mb-1">Post to Facebook</p>
            <p className="text-slate-400 text-sm mb-2">
              In the admin Blog Posts page, each post has a share button (Share to Facebook).
              When you click it, the post is sent to Zapier. Set up a Zap:
            </p>
            <ol className="text-slate-400 text-sm list-decimal list-inside space-y-1">
              <li>Trigger: <strong>Webhooks by Zapier</strong> → <strong>Catch Hook</strong> (use your existing ZAPIER_WEBHOOK_URL)</li>
              <li>Filter: Only continue if <code className="bg-slate-700 px-1 rounded">event</code> = <code className="bg-slate-700 px-1 rounded">facebook_post</code></li>
              <li>Action: <strong>Facebook Pages</strong> → <strong>Create Page Post</strong></li>
              <li>Map the <code className="bg-slate-700 px-1 rounded">message</code> field to your Facebook post content. Optionally map <code className="bg-slate-700 px-1 rounded">link</code>, <code className="bg-slate-700 px-1 rounded">imageUrl</code>.</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">API Endpoints (for Zapier)</CardTitle>
          <p className="text-slate-400 text-sm">
            Use &quot;Webhooks by Zapier&quot; → &quot;GET&quot; or &quot;Custom
            Request&quot;. Set header:{" "}
            <code className="bg-slate-700 px-1 rounded">
              Authorization: Bearer YOUR_ADMIN_API_KEY
            </code>
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {ZAPIER_ENDPOINTS.map((ep) => {
            const fullUrl = `${baseUrl}${ep.path}`;
            return (
              <div
                key={ep.path}
                className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-700/50"
              >
                <div>
                  <p className="font-medium text-white">{ep.name}</p>
                  <code className="text-amber-300 text-sm">{fullUrl}</code>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(fullUrl)}
                    className="p-2 rounded hover:bg-slate-600"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href="https://zapier.com/apps/webhook/integrations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded hover:bg-slate-600"
                    title="Zapier Webhooks"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
