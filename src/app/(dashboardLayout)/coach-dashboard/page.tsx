// app/dashboard/page.tsx
import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/coach-dashboard/overview");
}
