import Footer from "@/components/commonLayout/home/footer/Footer";
import Header from "@/components/commonLayout/home/header/Header";
import React from "react";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
