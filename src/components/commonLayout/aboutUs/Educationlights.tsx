"use client";

interface AboutSectionProps {
  heading?: string;
  subheading?: string;
  foundingTitle?: string;
  foundingText?: string;
  visionTitle?: string;
  visionText?: string;
  missionTitle?: string;
  missionText?: string;
}

export default function Educationlights({
  subheading = "At anglictinanastredni.cz, we help students shine brighter , one lesson at a time.",
  foundingTitle = "Our Founding Story",
  foundingText = `Anglictinanastredni.cz was born from a simple idea , to make English learning for Maturita students easier, smarter, and more engaging.

Founded by passionate educators who understand the real challenges students face, our platform connects teachers and learners through interactive lessons, grammar guides, and personalized exercises.

What started as a small initiative to support exam preparation has grown into a complete learning community , helping students gain confidence, improve faster, and succeed with joy.`,
  visionTitle = "Our Vision",
  visionText = "To build a modern and inspiring platform where students, teachers, and schools connect through learning , creating a brighter future, one lesson at a time.",
  missionTitle = "Our Mission",
  missionText = "To make English learning simple, engaging, and accessible for every student , empowering them to learn with confidence and achieve success in their Maturita exams.",
}: AboutSectionProps) {
  return (
    <section className="w-full py-15">
      <div className="container mx-auto space-y-10 px-4">
        {/* Top Heading */}
        <h2 className="heading text-center ">
          Education lights the way for every
          <span className="text-primary"> learner</span>
        </h2>
        <p className="subheading text-center text-muted-foreground">
          {subheading}
        </p>

        {/* Divider */}
        <hr className="border border-background" />

        {/* Founding Story */}
        <div className="grid md:grid-cols-[250px_1fr] gap-8">
          <h3 className="font-semibold text-xl text-foreground">
            {foundingTitle}
          </h3>
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
            {foundingText}
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-4 pt-4">
          <div className="text-center md:text-left space-y-2">
            <h3 className="font-semibold text-xl text-foreground">
              {visionTitle}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {visionText}
            </p>
          </div>

          <div className="text-center md:text-left space-y-2 col-span-1 md:col-span-1">
            <h3 className="font-semibold text-xl text-foreground">
              {missionTitle}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {missionText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
