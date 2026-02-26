/**
 * Rating criteria used across the app.
 *
 * COACH_REVIEW_CRITERIA: Used when parents/players rate coaches on the coach profile.
 * Five categories with descriptions, each rated 1–5 stars.
 *
 * PLAYER_EVALUATION_CRITERIA: Used when coaches rate players.
 * Source: player_evaluation lookup in /api/lookups (fallback to this list)
 */

export interface CoachReviewCriterionItem {
  id: string;
  title: string;
  description: string;
  icon: "target" | "brain" | "lightning" | "heart" | "users";
}

/** Criteria for parent/player → coach reviews (leave a rating form) */
export const COACH_REVIEW_CRITERIA: CoachReviewCriterionItem[] = [
  {
    id: "communication",
    title: "Positive Communication & Motivation",
    description:
      "How clearly and respectfully the coach communicates with players, and their ability to encourage effort, confidence, and growth—especially during challenges or mistakes.",
    icon: "target",
  },
  {
    id: "leadership",
    title: "Leadership Role Modeling",
    description:
      "The coach's ability to lead by example, set expectations, and model sportsmanship, accountability, and respect both on and off the ice.",
    icon: "brain",
  },
  {
    id: "patience",
    title: "Patience & Adaptability",
    description:
      "How well the coach adjusts to different learning styles, development stages, and game situations while maintaining a supportive environment.",
    icon: "lightning",
  },
  {
    id: "knowledge",
    title: "Hockey Knowledge & Teaching Skills",
    description:
      "The coach's understanding of the game and their ability to teach skills, concepts, and systems in a way that players can absorb and apply.",
    icon: "heart",
  },
  {
    id: "life-skills",
    title: "Focus on Life Skills & Development",
    description:
      "The extent to which the coach supports personal growth beyond hockey—building confidence, teamwork, resilience, and positive habits that carry off the ice.",
    icon: "users",
  },
];

export interface PlayerEvaluationCriterionItem {
  id: string;
  title: string;
  description: string;
  icon: "skating" | "shooting" | "passing" | "game-sense" | "work-ethic";
}

/** Criteria for coach → player evaluations (Performance Evaluation form) */
export const PLAYER_EVALUATION_CRITERIA: PlayerEvaluationCriterionItem[] = [
  {
    id: "skating",
    title: "Skating",
    description: "Speed, agility, edge work, and balance on ice",
    icon: "skating",
  },
  {
    id: "shooting",
    title: "Shooting",
    description: "Shot power, accuracy, and quick release",
    icon: "shooting",
  },
  {
    id: "passing",
    title: "Passing",
    description: "Vision, accuracy, and timing of passes",
    icon: "passing",
  },
  {
    id: "game-sense",
    title: "Game Sense",
    description: "Positioning, awareness, and hockey IQ",
    icon: "game-sense",
  },
  {
    id: "work-ethic",
    title: "Work Ethic",
    description: "Effort, attitude, and coachability",
    icon: "work-ethic",
  },
];

export type PlayerEvaluationCriterion =
  (typeof PLAYER_EVALUATION_CRITERIA)[number]["id"];
