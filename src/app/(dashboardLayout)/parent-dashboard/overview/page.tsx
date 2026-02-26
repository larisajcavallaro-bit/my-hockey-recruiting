import CoachContactsCardDashboard from "@/components/dashboard/parentDashboard/overview/CoachContactsCardDashboard";
import RatingRequestsCardDashboard from "@/components/dashboard/parentDashboard/overview/RatingRequestsCardDashboard";
import OverviewHeading from "@/components/dashboard/parentDashboard/overview/OverviewHeading";

export default function Overview() {
  return (
    <section className="ml-0">
      {/* Heading */}
      <OverviewHeading />

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CoachContactsCardDashboard />
        <RatingRequestsCardDashboard />
      </div>
    </section>
  );
}
