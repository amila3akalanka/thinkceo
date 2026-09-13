// Newest release first. The first entry's version must match package.json (checked by a test).
export type Release = {
  version: string;
  date: string;
  title: string;
  changes: { icon: string; text: string }[];
};

export const CHANGELOG: Release[] = [
  {
    version: "0.3.0",
    date: "September 2026",
    title: "Personal touch and easier sign-in",
    changes: [
      { icon: "user", text: "Add your name when you sign up, or any time in Profile. It shows across the app." },
      { icon: "mail", text: "Sign in with a code from your email, which works in any browser or device." },
      { icon: "check", text: "The login page now tells you when you're already signed in." },
      { icon: "info", text: "New About page with the app version and what changed." },
      { icon: "shield", text: "Fixed a console warning caused by browser extensions." },
    ],
  },
  {
    version: "0.2.0",
    date: "September 2026",
    title: "Learn, badges and career ranks",
    changes: [
      { icon: "graduation", text: "Learn tab: 14 short lessons across CEO Math, Investing, Real Estate, Accounting and Corporate Taxes, focused on Sri Lanka." },
      { icon: "calculator", text: "Calculation questions like ROI, break-even, stamp duty and VAT, with worked answers." },
      { icon: "award", text: "13 badges for playing cases and finishing lessons." },
      { icon: "crown", text: "Career rank from Intern to CEO, based on your XP." },
      { icon: "book", text: "Official sources and a fact-check date on every tax and legal lesson." },
    ],
  },
  {
    version: "0.1.0",
    date: "September 2026",
    title: "First release",
    changes: [
      { icon: "brain", text: "3-minute assessment with a leader profile and personalised learning path." },
      { icon: "target", text: "14 real business cases with what actually happened and the best move." },
      { icon: "sparkles", text: "AI coach explanations and XP, streaks and progress sync." },
    ],
  },
];
