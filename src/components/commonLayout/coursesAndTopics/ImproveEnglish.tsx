import React from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImproveEnglish = () => {
  return (
    <section className="bg-background2 py-15">
      <div className="container mx-auto px-4">
        <div className="bg-card max-w-xl mx-auto rounded-lg shadow-lg p-8">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Ready to Improve Your English?
          </h2>

          {/* Description */}
          <p className="text-muted-foreground mb-6">
            Join a class or try a practice test and start your journey to
            mastering English today.
          </p>

          {/* CTA Button */}
          <Button className="w-full text-foreground font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
            Free Registration
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ImproveEnglish;
