import VerificationsCardDashboard from "@/components/dashboard/coachDashboard/overview/VerificationsCardDashboard";
import ContactRequestsCardDashboard from "@/components/dashboard/coachDashboard/overview/ContactRequestsCardDashboard";
import RecentActivityCardDashboard from "@/components/dashboard/coachDashboard/overview/UpcomingEvents";
import OverviewHeading from "@/components/dashboard/coachDashboard/overview/OverviewHeading";
import PendingPlayerRatingsCardDashboard from "@/components/dashboard/coachDashboard/overview/PendingPlayerRatingsCardDashboard";

export default function Overview() {
  return (
    <section className="ml-0">
      {/* Heading */}
      <OverviewHeading />

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VerificationsCardDashboard />
        <RecentActivityCardDashboard />
        <ContactRequestsCardDashboard />
        <PendingPlayerRatingsCardDashboard />
      </div>
    </section>
  );
}
