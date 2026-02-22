"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Eye,
  Share2,
  Lock,
  RefreshCw,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PrivacyPolicyPage = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "overview",
        "info-collection",
        "data-sharing",
        "data-security",
        "protection",
        "rights",
        "changes",
      ];

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { id: "overview", label: "Overview", icon: Eye },
    {
      id: "info-collection",
      label: "How We Use Your Information",
      icon: FileText,
    },
    { id: "data-sharing", label: "Data Sharing", icon: Share2 },
    { id: "data-security", label: "Data Security", icon: Lock },
    { id: "protection", label: "modification of Protection", icon: Shield },
    { id: "rights", label: "Your Rights", icon: FileText },
    { id: "changes", label: "Changes to This Policy", icon: RefreshCw },
  ];

  return (
    <section className="py-15 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          My Hockey Recruiting <span className="text-primary">Privacy Policy</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          We prioritize your privacy by securely managing your data and only
          using it to improve our services, never sharing it without your
          consent.
        </p>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="shrink-0">
            <div className="sticky top-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Privacy Policy
                </h3>
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                          activeSection === item.id
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Overview Section */}
            <section id="overview" className="mb-16 scroll-mt-20">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Overview
              </h1>
              <p className="text-muted-foreground mb-6">
                We care about protecting personal information for us. We are
                committed to protecting the personal information you share with
                us when you use our website or learning services.
              </p>
              <p className="text-muted-foreground mb-8">
                This Privacy Policy explains how we collect, use, store, share,
                and safeguard your data. We do ensure a safe and responsible
                experience for all users.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground">
                    Personal Information: Name, email address, and contact
                    details.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground">
                    Account Information: Username, password, and user-generated
                    content.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground">
                    Learning Activity: lessons completed, quizzes taken, and
                    performance statistics.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground">
                    Data and Information: uploaded assignments, news, or shared
                    documents.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground">
                    Security details: technical data used to protect your
                    account from unauthorized access.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Your Information Section */}
            <section id="info-collection" className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                How We Use Your Information
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground">
                    To provide and deliver our learning materials.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground">
                    To provide support and respond to questions or feedback.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground">
                    To improve our features, services, and user interface.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground">
                    To send learning updates, class reminders, or promotional
                    information (with your consent).
                  </p>
                </div>
              </div>
            </section>

            {/* Data Sharing Section */}
            <section id="data-sharing" className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Data Sharing
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground">
                    Service Providers: for hosting, analytics, and secure
                    payments (if applicable).
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground">
                    Legal Authorities: Only if required by law or to protect our
                    rights.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Security Section */}
            <section id="data-security" className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Data Security
              </h2>
              <p className="text-muted-foreground mb-4">
                We use strong security measures and encrypted connections to
                protect your data from unauthorized access, misuse, or
                disclosure.
              </p>
              <p className="text-muted-foreground">
                Regular backups and secure storage ensure that your data
                and personal details are kept safe and protected.
              </p>
            </section>

            {/* Modification of Protection Section */}
            <section id="protection" className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Updates to This Policy
              </h2>
              <p className="text-muted-foreground mb-4">
                We may occasionally update this Privacy Policy to reflect
                improvements in our services or comply with new regulations.
              </p>
              <p className="text-muted-foreground mb-4">
                Any updates will be communicated on this page.
              </p>
              <p className="text-muted-foreground">
                If you continue using our website after a revision, it means you
                agree to the updated version of the policy.
              </p>
            </section>

            {/* Your Rights Section */}
            <section id="rights" className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Your Rights
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground">
                    Request access to your data.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground">
                    Ask for corrections or updates.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground">
                    Request deletion of your account and associated data.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Us Section */}
            <section id="changes" className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Contact Us
              </h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about this Privacy Policy or how your
                data is handled, please contact us.
              </p>
              <Button asChild>
                <Link href="/contact-us">Contact Us</Link>
              </Button>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;
