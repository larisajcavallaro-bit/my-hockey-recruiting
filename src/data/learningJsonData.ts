export const learningTextData = [
    {
        id: 1,
        title: "Advanced English Grammar",
        instructor: "Ms. Johnson",
        description: "Master advanced grammar concepts and improve You want all cards to stay equal height so the buttons always stay perfectly aligned in the grid, even when the description text is long",
        videosDuration: 8,
        type: "Easy",
        status: "complete",
        icon: "book",
    },
    {
        id: 2,
        title: "Creative Writing Essentials",
        instructor: "Mr. Smith",
        description: "Learn how to craft compelling stories and essays",
        videosDuration: 12,
        type: "Medium",
        status: "Uncomplete",
        icon: "book",
    },
    {
        id: 3,
        title: "Public Speaking Mastery",
        instructor: "Ms. Lee",
        description: "Develop confidence and clarity in front of any audience",
        videosDuration: 10,
        type: "Hard",
        status: "complete",
        icon: "book",
    },
    {
        id: 4,
        title: "Basic Spanish Language",
        instructor: "Mr. Gomez",
        description: "Start speaking Spanish with essential vocabulary and phrases",
        videosDuration: 15,
        type: "Easy",
        status: "Uncomplete",
        icon: "book",
    },
    {
        id: 5,
        title: "Digital Marketing 101",
        instructor: "Ms. Davis",
        description: "Learn the fundamentals of social media and online marketing",
        videosDuration: 20,
        type: "Medium",
        status: "Uncomplete",
        icon: "book",
    },
    {
        id: 6,
        title: "Introduction to Python",
        instructor: "Mr. Patel",
        description: "Start coding with Python and learn basic programming concepts",
        videosDuration: 18,
        type: "Easy",
        status: "Uncomplete",
        icon: "book",
    },
    {
        id: 7,
        title: "Photography Basics",
        instructor: "Ms. Brown",
        description: "Learn how to take stunning photos and understand camera settings",
        videosDuration: 14,
        type: "Medium",
        status: "Uncomplete",
        icon: "book",
    },
    {
        id: 8,
        title: "Financial Literacy",
        instructor: "Mr. Wilson",
        description: "Understand personal finance, budgeting, and investments",
        videosDuration: 16,
        type: "Hard",
        status: "Uncomplete",
        icon: "book",
    },
    {
        id: 9,
        title: "Yoga for Beginners",
        instructor: "Ms. Patel",
        description: "Start your wellness journey with simple yoga exercises",
        videosDuration: 9,
        type: "Easy",
        status: "complete",
        icon: "book",
    }
];
export const learningTopics = [
    // Course 1: Advanced English Grammar
    {
        id: 1,
        title: "Introduction to Grammar",
        foreignKey: 1, // belongs to course id: 1  (you can adjust as needed)
        content:
            "Learn the fundamental grammar concepts including parts of speech, sentence structure, and common errors.",
    },
    {
        id: 2,
        title: "Parts of Speech",
        foreignKey: 1,
        content:
            "Understand nouns, verbs, adjectives, adverbs, and how they function in sentence formation.",
    },
    {
        id: 3,
        title: "Sentence Structure",
        foreignKey: 1,
        content:
            "Explore simple, compound, complex, and compound-complex sentences with usage examples.",
    },
    {
        id: 4,
        title: "Advanced Tenses",
        foreignKey: 1,
        content:
            "Learn about perfect, continuous, and perfect continuous tenses to express time more accurately.",
    },
    {
        id: 5,
        title: "Common Grammar Mistakes",
        foreignKey: 1,
        content:
            "Identify frequent errors in writing and speaking and learn strategies to avoid them.",
    },

    // Course 2: Creative Writing Essentials
    {
        id: 6,
        title: "Storytelling Basics",
        foreignKey: 2,
        content:
            "Understand narrative structure, plot development, and character building for compelling stories.",
    },
    {
        id: 7,
        title: "Writing Styles",
        foreignKey: 2,
        content:
            "Learn different writing styles, tones, and voices for essays, short stories, and articles.",
    },
    {
        id: 8,
        title: "Editing and Proofreading",
        foreignKey: 2,
        content:
            "Master techniques to refine your writing, improve clarity, and eliminate errors.",
    },

    // Course 3: Public Speaking Mastery
    {
        id: 9,
        title: "Overcoming Stage Fright",
        foreignKey: 3,
        content:
            "Practical tips to build confidence and reduce anxiety before speaking to an audience.",
    },

    // Course 4: Basic Spanish Language
    {
        id: 12,
        title: "Spanish Alphabet & Pronunciation",
        foreignKey: 4,
        content:
            "Learn how to pronounce letters and words correctly in Spanish.",
    },
    {
        id: 13,
        title: "Common Phrases",
        foreignKey: 4,
        content:
            "Practice everyday Spanish phrases for greetings, introductions, and small talk.",
    },
    {
        id: 14,
        title: "Numbers & Dates",
        foreignKey: 4,
        content:
            "Learn how to count, say dates, and express time in Spanish.",
    },

    // Course 5: Digital Marketing 101
    {
        id: 15,
        title: "Introduction to Digital Marketing",
        foreignKey: 5,
        content:
            "Understand the basics of online marketing and how digital campaigns work.",
    },
    {
        id: 16,
        title: "Social Media Marketing",
        foreignKey: 5,
        content:
            "Learn strategies for promoting brands on social media platforms effectively.",
    },
    {
        id: 17,
        title: "SEO Basics",
        foreignKey: 5,
        content:
            "Discover how to optimize websites and content to rank higher in search engines.",
    },
];
