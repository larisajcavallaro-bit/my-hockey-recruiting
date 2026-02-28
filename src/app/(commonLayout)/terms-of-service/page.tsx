"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  UserCheck,
  Scale,
  CreditCard,
  Shield,
  RefreshCw,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TermsOfServicePage = () => {
  const [activeSection, setActiveSection] = useState("acceptance");

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
        "acceptance",
        "service",
        "accounts",
        "conduct",
        "subscription",
        "intellectual-property",
        "disclaimer",
        "liability",
        "termination",
        "changes",
        "contact",
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
    { id: "acceptance", label: "Acceptance of Terms", icon: BookOpen },
    { id: "service", label: "Description of Service", icon: FileText },
    { id: "accounts", label: "User Accounts", icon: UserCheck },
    { id: "conduct", label: "User Conduct", icon: Scale },
    { id: "subscription", label: "Subscription & Payments", icon: CreditCard },
    { id: "intellectual-property", label: "Intellectual Property", icon: Shield },
    { id: "disclaimer", label: "Disclaimer", icon: Shield },
    { id: "liability", label: "Limitation of Liability", icon: Scale },
    { id: "termination", label: "Termination", icon: RefreshCw },
    { id: "changes", label: "Changes to Terms", icon: RefreshCw },
    { id: "contact", label: "Contact Us", icon: FileText },
  ];

  const bullet = (
    <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
      <div className="w-2 h-2 rounded-full bg-primary" />
    </div>
  );

  return (
    <section className="py-10 md:py-15 bg-background overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
          My Hockey Recruiting{" "}
          <span className="text-primary">Terms of Service</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          By using My Hockey Recruiting, you agree to these terms. Please read
          them carefully before creating an account or using our platform.
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="shrink-0 w-full lg:w-auto">
            <div className="lg:sticky lg:top-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Terms of Service
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
          <div className="flex-1 min-w-0 max-w-4xl">
            {/* Acceptance of Terms */}
            <section
              id="acceptance"
              className="mb-16 scroll-mt-20"
            >
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Acceptance of Terms
              </h1>
              <p className="text-muted-foreground mb-6">
                By accessing or using My Hockey Recruiting (“the Platform”), you
                agree to be bound by these Terms of Service. If you do not agree
                with any part of these terms, you may not use our services.
              </p>
              <p className="text-muted-foreground">
                These terms apply to all users, including parents, coaches,
                players, and training operators who use our platform.
              </p>
            </section>

            {/* Description of Service */}
            <section
              id="service"
              className="mb-16 scroll-mt-20"
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Description of Service
              </h2>
              <p className="text-muted-foreground mb-6">
                My Hockey Recruiting provides a platform to connect families,
                coaches, and training locations in youth hockey. Our services
                include:
              </p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  {bullet}
                  <p className="text-foreground">
                    Coach directories, profiles, and verification.
                  </p>
                </div>
                <div className="flex gap-3">
                  {bullet}
                  <p className="text-foreground">
                    Player profiles, stats, and recruiting visibility.
                  </p>
                </div>
                <div className="flex gap-3">
                  {bullet}
                  <p className="text-foreground">
                    Event listings, tryouts, camps, and RSVP management.
                  </p>
                </div>
                <div className="flex gap-3">
                  {bullet}
                  <p className="text-foreground">
                    Training listings and reviews.
                  </p>
                </div>
                <div className="flex gap-3">
                  {bullet}
                  <p className="text-foreground">
                    Subscription plans for enhanced visibility and features.
                  </p>
                </div>
              </div>
            </section>

            {/* User Accounts */}
            <section
              id="accounts"
              className="mb-16 scroll-mt-20"
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                User Accounts
              </h2>
              <p className="text-muted-foreground mb-6">
                To access certain features, you must create an account. You are
                responsible for:
              </p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  {bullet}
                  <p className="text-foreground">
                    Providing accurate and current information.
                  </p>
                </div>
                <div className="flex gap-3">
                  {bullet}
                  <p className="text-foreground">
                    Maintaining the security of your password and account.
                  </p>
                </div>
                <div className="flex gap-3">
                  {bullet}
                  <p className="text-foreground">
                    All activity that occurs under your account.
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mt-6">
                You must be at least 18 years old or have parental consent to
                create an account. Coach verification may require additional
                steps to confirm credentials.
              </p>
            </section>

            {/* User Conduct */}
            <section
              id="conduct"
              className="mb-16 scroll-mt-20"
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                User Conduct
              </h2>
              <p className="text-muted-foreground mb-6">
                You agree not to use the Platform to:
              </p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  {bullet}
                  <p className="text-foreground">
                    Post false, misleading, or fraudulent information.
                  </p>
                </div>
                <div className="flex gap-3">
                  {bullet}
                  <p className="text-foreground">
                    Harass, abuse, or harm other users.
                  </p>
                </div>
                <div className="flex gap-3">
                  {bullet}
                  <p className="text-foreground">
                    Violate any applicable laws or regulations.
                  </p>
                </div>
                <div className="flex gap-3">
                  {bullet}
                  <p className="text-foreground">
                    Attempt to gain unauthorized access to the Platform or other
                    accounts.
                  </p>
                </div>
              </div>
            </section>

            {/* Subscription & Payments */}
            <section
              id="subscription"
              className="mb-16 scroll-mt-20"
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Subscription & Payments
              </h2>
              <p className="text-muted-foreground mb-6">
                Some features require a paid subscription. By subscribing, you
                agree to:
              </p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  {bullet}
                  <p className="text-foreground">
                    Pay all fees associated with your chosen plan.
                  </p>
                </div>
                <div className="flex gap-3">
                  {bullet}
                  <p className="text-foreground">
                    Automatic renewal unless cancelled before the renewal date.
                  </p>
                </div>
                <div className="flex gap-3">
                  {bullet}
                  <p className="text-foreground">
                    Refund policies as stated at the time of purchase.
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section
              id="intellectual-property"
              className="mb-16 scroll-mt-20"
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Intellectual Property
              </h2>
              <p className="text-muted-foreground mb-4">
                My Hockey Recruiting and its content, including logos, design,
                and software, are protected by intellectual property laws. You
                may not copy, modify, or distribute our materials without
                written permission.
              </p>
              <p className="text-muted-foreground">
                You retain ownership of content you submit, but grant us a
                license to use, display, and distribute it in connection with
                the Platform.
              </p>
            </section>

            {/* Disclaimer */}
            <section
              id="disclaimer"
              className="mb-16 scroll-mt-20"
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Disclaimer
              </h2>
              <p className="text-muted-foreground">
                The Platform is provided “as is.” We do not guarantee the
                accuracy of user-submitted content, including coach
                credentials, training information, or event details. Users are
                responsible for verifying information before making decisions.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section
              id="liability"
              className="mb-16 scroll-mt-20"
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Limitation of Liability
              </h2>
              <p className="text-muted-foreground">
                To the fullest extent permitted by law, My Hockey Recruiting
                shall not be liable for any indirect, incidental, special, or
                consequential damages arising from your use of the Platform. Our
                total liability shall not exceed the amount you paid for
                services in the twelve months preceding the claim.
              </p>
            </section>

            {/* Termination */}
            <section
              id="termination"
              className="mb-16 scroll-mt-20"
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Termination
              </h2>
              <p className="text-muted-foreground mb-4">
                We may suspend or terminate your account if you violate these
                terms or for any other reason at our discretion. You may cancel
                your account at any time through your account settings.
              </p>
              <p className="text-muted-foreground">
                Upon termination, your right to use the Platform ceases
                immediately. Provisions that by their nature should survive
                will remain in effect.
              </p>
            </section>

            {/* Changes to Terms */}
            <section
              id="changes"
              className="mb-16 scroll-mt-20"
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Changes to Terms
              </h2>
              <p className="text-muted-foreground mb-4">
                We may update these Terms of Service from time to time. We will
                notify you of material changes by posting the updated terms on
                this page and updating the “Last updated” date.
              </p>
              <p className="text-muted-foreground">
                Your continued use of the Platform after changes are posted
                constitutes acceptance of the revised terms.
              </p>
            </section>

            {/* Contact Us */}
            <section
              id="contact"
              className="mb-16 scroll-mt-20"
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Contact Us
              </h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about these Terms of Service, please
                contact us.
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

export default TermsOfServicePage;
