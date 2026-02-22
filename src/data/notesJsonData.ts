import { NotesData } from "@/type";

export const notesData: NotesData = {
  title: "Grammar Explanation & Notes",
  subtitle: "Comprehensive grammar guides with examples and explanations",
  topics: [
    {
      id: "tenses",
      title: "Tenses",
      items: [
        "Present Simple",
        "Present Continuous",
        "Present Perfect",
        "Past Simple",
        "Past Continuous",
        "Future Tenses"
      ]
    },
    {
      id: "conditionals",
      title: "Conditionals",
      items: [
        "Zero Conditional",
        "First Conditional",
        "Second Conditional",
        "Third Conditional",
        "Mixed Conditionals"
      ]
    },
    {
      id: "articles",
      title: "Articles",
      items: [
        "Definite Article",
        "Indefinite Article",
        "Zero Article"
      ]
    },
    {
      id: "passive-voice",
      title: "Passive Voice",
      items: [
        "Passive in Different Tenses",
        "Passive with Modals"
      ]
    }
  ],
  grammarSection: {
    id: "present-simple",
    title: "Present Simple",
    description: "Detailed explanation with examples",
    content: {
      title: "1. Matching Exercise: Types of Houses",
      description: "Instructions: Match the house descriptions (A–L) with the correct house types (1–12). Write your answers like this: A–3, B–7, etc.",
      exercises: {
        title: "Exercise Items",
        instructions: "",
        items: [
          "A. A small wooden structure in the forest, often without modern plumbing, used for weekend stays or holidays.",
          "B. A large, private house with no shared walls, often found in the countryside or suburbs.",
          "C. A narrow, multi-storey house in a row of identical buildings, usually found in cities.",
          "D. A prefabricated structure that can be transported, usually cheaper and sometimes located in trailer parks.",
          "E. A traditional rural home, often with timber or stone features, renovated and used for recreation.",
          "F. A modern home in newly developed residential areas on the outskirts of cities, usually with a garden, garage, and BBQ area.",
          "G. A very basic, self-made structure, built from cheap or recycled materials, often lacking electricity and sanitation.",
          "H. A low, one-storey home with a simple layout and often a front porch.",
          "I. A housing unit that shares one wall with another, usually found in suburbs, offering more privacy"
        ]
      }
    }
  }
};