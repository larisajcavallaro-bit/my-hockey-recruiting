import AboutUsBanner from "@/components/commonLayout/aboutUs/AboutUsBanner";
import Educationlights from "@/components/commonLayout/aboutUs/Educationlights";
import KeyFeatures from "@/components/commonLayout/aboutUs/KeyFeatures";
import MeetTheFounder from "@/components/commonLayout/aboutUs/MeetTheFounder";
import WhoWeHelp from "@/components/commonLayout/aboutUs/WhoWeHelp";
// import WhatOurStudentsSay from '@/components/commonLayout/home/WhatOurStudentsSay/WhatOurStudentsSay'
import React from "react";

export default function page() {
  return (
    <section>
      <AboutUsBanner />
      <Educationlights />
      <KeyFeatures /> {/* make this props data from backend if needed */}
      <WhoWeHelp />
      {/* <WhatOurStudentsSay /> */}
      <MeetTheFounder
        name="Eva Srostlikova"
        imageUrl="/icons/commonLayout/aboutUs/user.jpg"
      />
    </section>
  );
}
