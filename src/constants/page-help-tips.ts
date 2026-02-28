/** Page-specific help tips for the floating help icon */
export const PAGE_HELP_TIPS: Record<string, { title: string; body: string }> = {
  "/parent-dashboard/overview": {
    title: "Your Dashboard",
    body: "This is your home base. You'll see upcoming events you've RSVP'd to, contact requests from coaches, and rating requests. Use the sidebar to explore.",
  },
  "/parent-dashboard/players": {
    title: "Your Players",
    body: "All players from the website will show here. You'll see their birth year, position, team and level if they have a gold or elite account. Coaches use this to find players for events and opportunities.",
  },
  "/parent-dashboard/coaches": {
    title: "Find Coaches",
    body: "Browse coaches by location, league, or team. Click a coach to see their profile and reviews. Gold members can request contact to connect directly.",
  },
  "/parent-dashboard/events": {
    title: "Events",
    body: "See upcoming camps, tryouts, and clinics from coaches. Click 'Going' to RSVP and add which player is attending. You'll get reminders before events.",
  },
  "/parent-dashboard/rating": {
    title: "Coach Ratings",
    body: "Request coaches to rate your player's skills. Coaches you've connected with can leave feedback. You can also track pending requests here.",
  },
  "/parent-dashboard/notifications": {
    title: "Notifications",
    body: "Stay updated on contact requests, new messages, and other activity. Click items to mark them as read.",
  },
  "/parent-dashboard/profile": {
    title: "Your Profile",
    body: "Update your account details, profile photo, and notification preferences. Add your child's player profile in the section below.",
  },
  "/parent-dashboard/setting": {
    title: "Settings",
    body: "Manage your account, notification preferences, and other settings.",
  },
  "/parent-dashboard/messages": {
    title: "Contact Us",
    body: "Have a question? Send us a message and we'll reply here. Great for verification issues, billing, or anything else.",
  },
  "/training": {
    title: "Training",
    body: "Find rinks and training facilities near you. Filter by ice time, synthetic ice, shooting lanes, and more.",
  },
  "/teams-and-schools": {
    title: "Teams & Programs",
    body: "Browse hockey teams and programs. Read reviews from other families and add your own experiences.",
  },
  "/blog": {
    title: "Blog",
    body: "Tips and insights for youth hockey families. Stay informed on recruiting, development, and more.",
  },
  // Coach dashboard
  "/coach-dashboard/overview": {
    title: "Your Dashboard",
    body: "Your home base. See upcoming events, contact requests from parents, and player verifications. Use the sidebar to explore.",
  },
  "/coach-dashboard/players": {
    title: "View Players",
    body: "Browse players on the platform. See birth year, position, team, and level for Gold and Elite accounts. Use this to find players for your events.",
  },
  "/coach-dashboard/teamManagement": {
    title: "Team Management",
    body: "Manage your roster—add players, verify credentials, and keep your team information up to date.",
  },
  "/coach-dashboard/events": {
    title: "Events",
    body: "Create and manage camps, tryouts, and clinics. Track RSVPs and see who's attending your events.",
  },
  "/coach-dashboard/rating": {
    title: "Submit Player Ratings",
    body: "Rate players you've worked with. Parents send rating requests—respond here to leave feedback on their skills.",
  },
  "/coach-dashboard/profile": {
    title: "Your Profile",
    body: "Update your coach profile, photo, team info, and credentials. Parents see this when browsing coaches.",
  },
  "/coach-dashboard/setting": {
    title: "Settings",
    body: "Manage your account, notification preferences, and other settings.",
  },
  "/coach-dashboard/notifications": {
    title: "Notifications",
    body: "Stay updated on contact requests, new messages, and other activity. Click items to mark them as read.",
  },
  "/coach-dashboard/messages": {
    title: "Contact Us",
    body: "Have a question? Send us a message and we'll reply here. Great for verification issues, billing, or anything else.",
  },
};

/** Get help tip for pathname (supports partial match for nested routes) */
export function getPageHelpTip(pathname: string): { title: string; body: string } | null {
  // Exact match
  const exact = PAGE_HELP_TIPS[pathname];
  if (exact) return exact;

  // Longest prefix match for nested routes (e.g. /parent-dashboard/coaches/abc123)
  const segments = pathname.split("/").filter(Boolean);
  let best: { title: string; body: string } | null = null;
  let bestLen = 0;

  for (const [key, tip] of Object.entries(PAGE_HELP_TIPS)) {
    const keySegments = key.split("/").filter(Boolean);
    const match = keySegments.every((s, i) => segments[i] === s);
    if (match && keySegments.length > bestLen) {
      best = tip;
      bestLen = keySegments.length;
    }
  }

  return best;
}
