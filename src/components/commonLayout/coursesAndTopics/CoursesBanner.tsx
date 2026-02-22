

import Image from "next/image";
import React from "react";

const CoursesBanner = () => {
  return (
    <div
      className="h-[60vh] md:h-[calc(100vh-80px)] flex items-center relative"
      style={{
        backgroundImage:
          "url(/icons/commonLayout/coursesTopic/banner_background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Image
        src="/icons/commonLayout/privacyPolicy/banner_girl.png"
        alt="Banner Background"
        width={700}
        height={700}
        className="absolute bottom-0 right-0 h-45 w-50 md:h-130 md:w-150 object-cover z-0"
      />
      {/* Banner Content */}
      <div className="flex flex-col gap-6 md:gap-8 container mx-auto px-6 md:px-12 lg:px-20 text-center md:text-left z-10">
        <h1 className="text-background text-3xl md:text-5xl lg:text-7xl font-bold w-full md:w-9/12 mx-auto md:mx-0">
          Explore English Topics Learn, Practice, and Master Your Skills
        </h1>

        <p className="text-background text-lg md:text-xl lg:text-2xl w-full md:w-8/12 mx-auto md:mx-0">
          Choose from curated lessons, grammar guides, and Maturita preparation
          topics.
        </p>

        {/* <div className="w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search Topics / Grammar / Lessons"
              className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CoursesBanner;
