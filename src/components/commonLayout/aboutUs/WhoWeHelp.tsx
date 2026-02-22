import React from "react";
import { BookOpen, School, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WhoWeHelp() {
  const features = [
    {
      icon: BookOpen,
      title: "Students",
      description:
        "Practice English topics, take interactive tests, and track your progress towards exam success.",
    },
    {
      icon: Users,
      title: "Teachers",
      description:
        "Create classes, upload materials, and assign exercises to your students with ease.",
    },
    {
      icon: School,
      title: "Schools",
      description:
        "Provide your institution with structured, easy-to-use digital resources.",
    },
  ];

  return (
    <section className="py-15 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="heading text-center ">
          Who We <span className="text-primary">Help</span>
        </h2>
        <p className="subheading text-center text-muted-foreground">
          Start your journey to exam success in three simple steps
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="p-6"
              style={{
                backgroundImage:
                  "url(/icons/commonLayout/WhyChooseOurPlatform/card_background.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <CardHeader className="text-center p-0">
                <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-lg bg-primary/20 text-primary relative mx-auto">
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-2xl font-bold text-background">
                  {feature.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 text-left">
                <p className="text-md text-background">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
