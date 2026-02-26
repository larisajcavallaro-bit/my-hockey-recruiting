import React from "react";
import SchoolDetails from "@/components/commonLayout/teamsAndSchools/SchoolDetails";

export default async function TeamSchoolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <section className="py-15 bg-background">
      <SchoolDetails schoolSlug={slug} />
    </section>
  );
}
