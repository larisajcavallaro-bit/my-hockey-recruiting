import React from "react";
import FacilityDetails from "@/components/commonLayout/facilities/FacilityDetails/FacilityDetails";

export default async function FacilityDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <section className="py-15 bg-background">
      <FacilityDetails facilitySlug={slug} />
    </section>
  );
}
