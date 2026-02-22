"use client"

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

export default function Faq() {

    const defaultFaqs: FAQ[] = [
      {
        id: 1,
        question: "How do I know the draw is fair?",
        answer:
          "All draws are conducted using a certified random number generator to ensure complete fairness and transparency.",
      },
      {
        id: 2,
        question: "When will I receive my prize?",
        answer:
          "Prizes are delivered within 7–14 business days after the winner is confirmed.",
      },
      {
        id: 3,
        question: "Are there any hidden costs?",
        answer:
          "No. The ticket price covers everything. There are no hidden fees.",
      },
      {
        id: 4,
        question: "Can I buy multiple tickets?",
        answer:
          "Yes! You can purchase as many tickets as you like to increase your chances of winning.",
      },
      {
        id: 5,
        question: "What happens if I don’t win?",
        answer:
          "If you don’t win, you can still participate in upcoming draws. Every ticket contributes to supporting good causes.",
      },
      {
        id: 6,
        question: "How secure are my payments?",
        answer:
          "All payments are processed through secure, encrypted payment gateways for your protection.",
      },
      {
        id: 7,
        question: "Can I transfer my prize to someone else?",
        answer:
          "Yes, most prizes can be transferred. Please contact support for assistance.",
      },
      {
        id: 8,
        question: "What if the minimum ticket sales aren’t reached?",
        answer:
          "If the minimum sales requirement is not met, all participants will be fully refunded.",
      },
    ];
    const [faqs, setFaqs] = useState<FAQ[]>(defaultFaqs);

  return (
    <section className="py-15 bg-background1">
        <div className="container mx-auto px-4">
            <h2 className="heading text-center ">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>
        <p className="subheading text-center text-muted-foreground">
          Still searching for something? Check out the Wope&apos;s wiki or get in touch with us!
        </p>
        


            <div className="max-w-2xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="bg-background my-4 rounded-lg px-4">
            <AccordionTrigger className=" text-md">{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
          </div>
    </section>
  )
}