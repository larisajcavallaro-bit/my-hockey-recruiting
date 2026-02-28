import React from "react";
import TeamsAndSchoolsBanner from "@/components/commonLayout/teamsAndSchools/TeamsAndSchoolsBanner";
import TeamsAndSchoolsGrid from "@/components/commonLayout/teamsAndSchools/TeamsAndSchoolsGrid";

export default function TeamsAndSchoolsPage() {
  return (
    <section className="py-15 bg-background">
      <TeamsAndSchoolsBanner />
      <TeamsAndSchoolsGrid />
    </section>
  );
}
