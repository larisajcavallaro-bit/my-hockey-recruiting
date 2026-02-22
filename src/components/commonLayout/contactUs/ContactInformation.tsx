"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { LocationLink } from "@/components/ui/LocationLink";

const contactAddress = "123 Industrial Blvd, Safety City, SC 12345, United States";

export default function ContactInformation() {
  const contactDetails = [
    {
      title: "Email Us",
      description: "Send us an email anytime",
      icon: Mail,
      highlight: "support@onschedule.ca",
      link: "mailto:support@onschedule.ca",
    },
    {
      title: "Call Us",
      description: "Mon–Fri, 9AM–5PM EST",
      icon: Phone,
      highlight: "+1 (800) CRANE-01",
      link: "tel:+18002726301",
    },
  ];

  return (
    <div className="space-y-4 border p-4 rounded-2xl">
      {contactDetails.map((item, index) => (
        <Card
          key={index}
          className="border border-border shadow-sm hover:shadow-md transition-all duration-200"
        >
          <CardContent className="p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-foreground">
              <item.icon className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-base">{item.title}</h3>
            </div>

            <p className="text-sm text-muted-foreground">{item.description}</p>

            {item.highlight ? (
              <Link
                href={item.link}
                className="text-primary font-medium hover:underline wrap-break-word"
              >
                {item.highlight}
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {item.description.includes("\n")
                  ? item.description
                  : item.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-foreground">
            <h3 className="font-semibold text-base">Visit Us</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Click for directions to our office
          </p>
          <LocationLink address={contactAddress} />
        </CardContent>
      </Card>
    </div>
  );
}
