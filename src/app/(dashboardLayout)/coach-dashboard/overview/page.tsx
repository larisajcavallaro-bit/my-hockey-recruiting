import CoachContactsCardDashboard from "@/components/dashboard/coachDashboard/overview/VerificationsCardDashboard";
import RecentActivityCardDashboard from "@/components/dashboard/coachDashboard/overview/UpcomingEvents";
import OverviewHeading from "@/components/dashboard/coachDashboard/overview/OverviewHeading";
export default function Overview() {
  return (
    <section className="ml-0">
      {/* Heading */}
      <OverviewHeading />

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CoachContactsCardDashboard />
        <RecentActivityCardDashboard />
      </div>
    </section>
  );
}
