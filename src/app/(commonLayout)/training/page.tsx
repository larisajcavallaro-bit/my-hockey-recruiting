import React from "react";
import Banner from "@/components/commonLayout/facilities/banner/banner";
import TrainingFacilitiesGrid from "@/components/commonLayout/facilities/trainingFacilities/TrainingFacilitiesGrid";

export default function TrainingPage() {
  return (
    <section className="py-15 bg-background">
      <Banner />
      <TrainingFacilitiesGrid />
    </section>
  );
}
