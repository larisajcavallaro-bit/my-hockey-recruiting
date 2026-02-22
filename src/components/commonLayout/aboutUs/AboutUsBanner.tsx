import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Banner = () => {
  return (
    <div
      className="h-[60vh] md:h-[calc(100vh-80px)] flex items-center relative"
      style={{
        backgroundImage:
          "url(/icons/commonLayout/aboutUs/banner_bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Image
        src="/icons/commonLayout/aboutUs/bg_girl.png"
        alt="Banner Background"
        width={700}
        height={700}
        className="absolute bottom-0 right-0 h-45 w-50 md:h-130 md:w-150 object-cover z-0"
      />
      {/* Banner Content */}
      <div className="flex flex-col gap-6 md:gap-8 container mx-auto px-6 md:px-12 lg:px-20 text-center md:text-left z-10">
        <h1 className="text-background text-3xl md:text-5xl lg:text-7xl font-bold w-full md:w-9/12 mx-auto md:mx-0">
          Empowering Student and Teachers to Succeed in the English Msturita
          exam
        </h1>

        <p className="text-background text-lg md:text-xl lg:text-2xl w-full md:w-8/12 mx-auto md:mx-0">
          Boost Your English Proficiency for Maturita Triumph Thorough
          Preparation for Assurance and Achievement
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start">
          <Link href="/#buy-Tickets">
            <Button
              size={"lg"}
              className="w-full rounded-lg text-foreground sm:w-auto"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/#faq">
            <Button
              size={"lg"}
              className="w-full rounded-lg sm:w-auto bg-transparent border border-background hover:bg-background/10"
            >
              Explore Topics
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
