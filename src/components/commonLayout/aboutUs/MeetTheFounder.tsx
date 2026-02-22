"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface FounderSectionProps {
  name?: string;
  title?: string;
  description1?: string;
  description2?: string;
  imageUrl?: string;
}

export default function MeetTheFounder({
  name = "Eva",
  title = "Meet the Founder",
  description1 = "I'm an English teacher passionate about helping students achieve success in their Maturita exams.",
  description2 = "This platform was created to make English learning more interactive, practical, and effective for students.",
  imageUrl = "/icons/commonLayout/aboutUs/user.jpg",
}: FounderSectionProps) {
  return (
    <section className="py-15 bg-background">
      <div className="container mx-auto px-4">
        <Card className="rounded-2xl p-2 shadow-md bg-background w-full lg:max-w-3xl mx-auto">
        <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
          {/* Image */}
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden shrink-0">
            <Image
              src={imageUrl}
              alt="Founder photo"
              width={150}
              height={150}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Text */}
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              {title}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              I’m <strong>{name}</strong>, {description1}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">{description2}</p>
          </div>
        </CardContent>
      </Card>
      </div>
    </section>
  );
}
