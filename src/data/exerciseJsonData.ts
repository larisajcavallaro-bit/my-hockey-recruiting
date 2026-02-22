import { Exercise } from "@/type";

export const getExerciseData: Exercise[] = [
  {
    id: 1,
    title: "Advanced English Grammar",
    subtitle: "Grammar Exercises",
    totalQuestions: 4,
    type: "Hard",
    progress: 80,
    status: "In Progress",
    icon: "book",
    timeLimit: 20,
    passingScore: 70,
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "Which sentence is grammatically correct?",
        choices: [
          { id: "A", text: "She don't like coffee." },
          { id: "B", text: "She doesn't likes coffee." },
          { id: "C", text: "She doesn't like coffee." },
          { id: "D", text: "She don't likes coffee." }
        ],
        correctAnswer: "C",
        explanation: "'Doesn't' is used with third-person singular subjects.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 2,
        type: "true-false",
        question: "The past participle of 'go' is 'went'.",
        correctAnswer: false,
        explanation: "The past participle of 'go' is 'gone'. 'Went' is simple past.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 3,
        type: "fill-blank",
        question: "Yesterday I ___ to the mall with my friends.",
        correctAnswer: "went",
        explanation: "Simple past tense is required.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 4,
        type: "multiple-choice",
        question: "Choose the correct form: 'He ___ a book every month.'",
        choices: [
          { id: "A", text: "reads" },
          { id: "B", text: "read" },
          { id: "C", text: "reading" },
          { id: "D", text: "has readed" }
        ],
        correctAnswer: "A",
        explanation: "'Reads' is correct for third-person singular in present tense.",
        userAnswer: undefined,
        isCorrect: undefined
      }
    ]
  },
  {
    id: 2,
    title: "Basic English Vocabulary",
    subtitle: "Vocabulary Exercises",
    totalQuestions: 10,
    type: "Medium",
    progress: 60,
    status: "In Progress",
    icon: "book-open",
    timeLimit: 15,
    passingScore: 70,
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "Choose the synonym of 'happy'.",
        choices: [
          { id: "A", text: "Sad" },
          { id: "B", text: "Joyful" },
          { id: "C", text: "Angry" },
          { id: "D", text: "Tired" }
        ],
        correctAnswer: "B",
        explanation: "'Joyful' means happy.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 2,
        type: "fill-blank",
        question: "The opposite of 'cold' is ___.",
        correctAnswer: "hot",
        explanation: "Opposite of cold is hot.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 3,
        type: "true-false",
        question: "'Quick' is an adjective.",
        correctAnswer: true,
        explanation: "Quick describes a noun, so it's an adjective.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 4,
        type: "short-answer",
        question: "Write a synonym for 'big'.",
        correctAnswer: "large",
        explanation: "Large is a synonym for big.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 5,
        type: "multiple-choice",
        question: "Select the correct word to complete: 'I ___ a pen.'",
        choices: [
          { id: "A", text: "has" },
          { id: "B", text: "have" },
          { id: "C", text: "had" },
          { id: "D", text: "having" }
        ],
        correctAnswer: "B",
        explanation: "'Have' is correct with 'I'.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 6,
        type: "true-false",
        question: "'Elephant' is smaller than a cat.",
        correctAnswer: false,
        explanation: "Elephant is much bigger than a cat.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 7,
        type: "fill-blank",
        question: "A baby dog is called a ___.",
        correctAnswer: "puppy",
        explanation: "A baby dog is called a puppy.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 8,
        type: "short-answer",
        question: "Write the plural of 'child'.",
        correctAnswer: "children",
        explanation: "Plural of child is children.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 9,
        type: "multiple-choice",
        question: "Choose the correct spelling:",
        choices: [
          { id: "A", text: "Recieve" },
          { id: "B", text: "Receive" },
          { id: "C", text: "Recive" },
          { id: "D", text: "Receve" }
        ],
        correctAnswer: "B",
        explanation: "'Receive' is the correct spelling.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 10,
        type: "true-false",
        question: "'Apple' is a fruit.",
        correctAnswer: true,
        explanation: "Apple is a type of fruit.",
        userAnswer: undefined,
        isCorrect: undefined
      }
    ]
  },
  {
    id: 3,
    title: "Intermediate English Grammar",
    subtitle: "Grammar Practice",
    totalQuestions: 10,
    type: "Medium",
    progress: 50,
    status: "In Progress",
    icon: "book",
    timeLimit: 20,
    passingScore: 70,
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "Which is the correct past tense of 'run'?",
        choices: [
          { id: "A", text: "ran" },
          { id: "B", text: "runned" },
          { id: "C", text: "running" },
          { id: "D", text: "run" }
        ],
        correctAnswer: "A",
        explanation: "The past tense of 'run' is 'ran'.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 2,
        type: "fill-blank",
        question: "She ___ going to school every day.",
        correctAnswer: "is",
        explanation: "Use 'is' for third-person singular present continuous.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 3,
        type: "true-false",
        question: "'They is happy.' is correct.",
        correctAnswer: false,
        explanation: "Use 'They are happy.'",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 4,
        type: "short-answer",
        question: "Correct this sentence: 'He don't like apples.'",
        correctAnswer: "He doesn't like apples.",
        explanation: "'Doesn't' is correct for third-person singular.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 5,
        type: "multiple-choice",
        question: "Choose correct: 'I have ___ my homework.'",
        choices: [
          { id: "A", text: "do" },
          { id: "B", text: "done" },
          { id: "C", text: "did" },
          { id: "D", text: "doing" }
        ],
        correctAnswer: "B",
        explanation: "'Done' is used for present perfect.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 6,
        type: "true-false",
        question: "'A dozen' means 10.",
        correctAnswer: false,
        explanation: "A dozen means 12.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 7,
        type: "fill-blank",
        question: "I have never ___ to Japan.",
        correctAnswer: "been",
        explanation: "Use 'been' in present perfect tense.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 8,
        type: "multiple-choice",
        question: "Pick the correct sentence:",
        choices: [
          { id: "A", text: "He have a car." },
          { id: "B", text: "He has a car." },
          { id: "C", text: "He haves a car." },
          { id: "D", text: "He has got car." }
        ],
        correctAnswer: "B",
        explanation: "'He has a car' is correct.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 9,
        type: "short-answer",
        question: "Correct the sentence: 'She don't knows me.'",
        correctAnswer: "She doesn't know me.",
        explanation: "Use 'doesn't' and base form 'know'.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 10,
        type: "true-false",
        question: "The word 'quickly' is an adjective.",
        correctAnswer: false,
        explanation: "'Quickly' is an adverb.",
        userAnswer: undefined,
        isCorrect: undefined
      }
    ]
  },

  // 4th exercise
  {
    id: 4,
    title: "English Reading Comprehension",
    subtitle: "Reading Exercises",
    totalQuestions: 10,
    type: "Medium",
    progress: 0,
    status: "Not Started",
    icon: "book",
    timeLimit: 25,
    passingScore: 70,
    questions: [
      {
        id: 1,
        type: "short-answer",
        question: "What is the main idea of the passage?",
        correctAnswer: "The main idea is about environmental protection.",
        explanation: "Identify the overall topic or message of the passage.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 2,
        type: "multiple-choice",
        question: "Which sentence is true according to the passage?",
        choices: [
          { id: "A", text: "It says nothing about pollution." },
          { id: "B", text: "It emphasizes environmental protection." },
          { id: "C", text: "It talks about cooking." },
          { id: "D", text: "It is about sports." }
        ],
        correctAnswer: "B",
        explanation: "Read carefully and identify what the passage emphasizes.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 3,
        type: "true-false",
        question: "The passage mentions recycling.",
        correctAnswer: true,
        explanation: "Recycling is discussed in the passage.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 4,
        type: "fill-blank",
        question: "The Earth is ___ for all living beings.",
        correctAnswer: "important",
        explanation: "Contextual vocabulary from the passage.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 5,
        type: "multiple-choice",
        question: "Who should protect the environment?",
        choices: [
          { id: "A", text: "Only government" },
          { id: "B", text: "Only scientists" },
          { id: "C", text: "Everyone" },
          { id: "D", text: "No one" }
        ],
        correctAnswer: "C",
        explanation: "Everyone is responsible for protecting the environment.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 6,
        type: "short-answer",
        question: "Give one example of reducing pollution.",
        correctAnswer: "Using public transport instead of cars.",
        explanation: "The answer should be practical and related to the passage.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 7,
        type: "fill-blank",
        question: "Planting trees helps to ___ the air quality.",
        correctAnswer: "improve",
        explanation: "Contextual vocabulary from passage.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 8,
        type: "multiple-choice",
        question: "Which of these is a renewable energy source?",
        choices: [
          { id: "A", text: "Coal" },
          { id: "B", text: "Wind" },
          { id: "C", text: "Petrol" },
          { id: "D", text: "Natural Gas" }
        ],
        correctAnswer: "B",
        explanation: "Wind energy is renewable.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 9,
        type: "true-false",
        question: "The passage encourages littering.",
        correctAnswer: false,
        explanation: "Littering is discouraged.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 10,
        type: "short-answer",
        question: "Write a sentence to summarize the passage.",
        correctAnswer: "The passage talks about protecting the environment and recycling.",
        explanation: "Summarize the main points in one sentence.",
        userAnswer: undefined,
        isCorrect: undefined
      }
    ]
  },

  // 5th exercise
  {
    id: 5,
    title: "English Idioms & Phrases",
    subtitle: "Idioms Exercises",
    totalQuestions: 5,
    type: "Medium",
    progress: 0,
    status: "Not Started",
    icon: "book",
    timeLimit: 15,
    passingScore: 70,
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "What does 'Break the ice' mean?",
        choices: [
          { id: "A", text: "To literally break ice" },
          { id: "B", text: "To start a conversation" },
          { id: "C", text: "To be angry" },
          { id: "D", text: "To leave" }
        ],
        correctAnswer: "B",
        explanation: "It means to start a conversation in a social situation.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 2,
        type: "fill-blank",
        question: "To 'hit the ___' means to be very lucky.",
        correctAnswer: "jackpot",
        explanation: "Contextual idiom meaning.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 3,
        type: "true-false",
        question: "'Piece of cake' means something difficult.",
        correctAnswer: false,
        explanation: "It means something very easy.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 4,
        type: "short-answer",
        question: "Explain the idiom 'Under the weather'.",
        correctAnswer: "Feeling sick or unwell.",
        explanation: "It refers to health.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 5,
        type: "multiple-choice",
        question: "Choose correct meaning: 'Costs an arm and a leg'",
        choices: [
          { id: "A", text: "Very cheap" },
          { id: "B", text: "Very expensive" },
          { id: "C", text: "Moderate price" },
          { id: "D", text: "No cost" }
        ],
        correctAnswer: "B",
        explanation: "It means very expensive.",
        userAnswer: undefined,
        isCorrect: undefined
      }
    ]
  },

  // 6th exercise
  {
    id: 6,
    title: "English Listening & Comprehension",
    subtitle: "Listening Exercises",
    totalQuestions: 10,
    type: "Medium",
    progress: 0,
    status: "Not Started",
    icon: "headphones",
    timeLimit: 25,
    passingScore: 70,
    questions: [
      {
        id: 1,
        type: "short-answer",
        question: "What is the main point of the audio?",
        correctAnswer: "The audio talks about daily routines.",
        explanation: "Summarize what was discussed.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 2,
        type: "multiple-choice",
        question: "What is John doing in the morning?",
        choices: [
          { id: "A", text: "Sleeping" },
          { id: "B", text: "Exercising" },
          { id: "C", text: "Cooking" },
          { id: "D", text: "Studying" }
        ],
        correctAnswer: "B",
        explanation: "Audio mentions morning exercise.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 3,
        type: "true-false",
        question: "He eats breakfast before going to work.",
        correctAnswer: true,
        explanation: "Audio clearly states this.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 4,
        type: "fill-blank",
        question: "He usually wakes up at ___ a.m.",
        correctAnswer: "6",
        explanation: "Audio mentions exact time.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 5,
        type: "multiple-choice",
        question: "What does he do after breakfast?",
        choices: [
          { id: "A", text: "Reads newspaper" },
          { id: "B", text: "Goes jogging" },
          { id: "C", text: "Goes to work" },
          { id: "D", text: "Watches TV" }
        ],
        correctAnswer: "C",
        explanation: "Audio sequence of daily routine.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 6,
        type: "true-false",
        question: "He drinks coffee in the morning.",
        correctAnswer: true,
        explanation: "Audio mentions coffee consumption.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 7,
        type: "fill-blank",
        question: "His favorite hobby is ___.",
        correctAnswer: "reading",
        explanation: "Audio mentions hobby.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 8,
        type: "short-answer",
        question: "List two tasks he does in the afternoon.",
        correctAnswer: "Works on reports and attends meetings.",
        explanation: "Audio mentions afternoon activities.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 9,
        type: "multiple-choice",
        question: "What time does he finish work?",
        choices: [
          { id: "A", text: "5 PM" },
          { id: "B", text: "6 PM" },
          { id: "C", text: "7 PM" },
          { id: "D", text: "8 PM" }
        ],
        correctAnswer: "B",
        explanation: "Audio mentions end of work time.",
        userAnswer: undefined,
        isCorrect: undefined
      },
      {
        id: 10,
        type: "true-false",
        question: "He goes to sleep at 10 PM.",
        correctAnswer: true,
        explanation: "Audio mentions bedtime.",
        userAnswer: undefined,
        isCorrect: undefined
      }
    ]
  }
];
