import React from "react";
import TeamsAndSchoolsBanner from "@/components/commonLayout/teamsAndSchools/TeamsAndSchoolsBanner";
import TeamsAndSchoolsGrid from "@/components/commonLayout/teamsAndSchools/TeamsAndSchoolsGrid";

export default function TeamsAndSchoolsPage() {
  return (
    <section className="py-15 bg-background">
      <div className="w-full bg-amber-500 text-slate-900 py-3 px-4 text-center font-semibold text-lg shadow-md">
        Coming Soon — Teams &amp; Schools are on the way. Check back soon!
      </div>
      <TeamsAndSchoolsBanner />
      <TeamsAndSchoolsGrid />
    </section>
  );
}
