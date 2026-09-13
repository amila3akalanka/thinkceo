import type { Scenario } from "@/lib/types";

// Curated, fact-checked cases. New drafts come from scripts/generate-scenario.ts
// and must be reviewed before they are added here.
export const SCENARIOS: Scenario[] = [
  // ── Competitive Strategy ─────────────────────────────────────────────
  {
    id: "blockbuster-netflix-2000",
    module: "strategy",
    difficulty: 1,
    company: "Blockbuster",
    year: 2000,
    icon: "film",
    setup:
      "You run Blockbuster: thousands of video stores and about $5B in revenue. Netflix, a small DVD-by-mail startup losing money, offers to sell itself to you for $50M and run your online business.",
    question: "What do you do?",
    options: [
      { id: "a", text: "Pass. Stores are the business; online is a niche.", score: 20, traits: {} },
      { id: "b", text: "Buy Netflix for $50M and let them run online.", score: 95, traits: { strategy: 3, risk: 2 } },
      { id: "c", text: "Build your own online service in-house, slowly.", score: 50, traits: { strategy: 2, risk: 1 } },
      { id: "d", text: "Wait a few years and see if online takes off.", score: 25, traits: {} },
    ],
    bestOptionId: "b",
    actualOptionId: "a",
    actualOutcome:
      "Blockbuster passed. It launched its own online service in 2004, years late. It filed for bankruptcy in 2010, while Netflix grew into a global streaming giant.",
    whyBest: [
      "$50M was tiny next to Blockbuster's revenue: a cheap option on the future.",
      "Netflix already had the team and model; building from scratch cost years.",
      "Protecting today's profits hid how customers would rent tomorrow.",
    ],
    lesson: "Small bets on disruptors are cheap insurance.",
    source: { title: "Wikipedia: Blockbuster LLC", url: "https://en.wikipedia.org/wiki/Blockbuster_LLC" },
  },
  {
    id: "kodak-digital-1975",
    module: "strategy",
    difficulty: 2,
    company: "Kodak",
    year: 1975,
    icon: "camera",
    setup:
      "A Kodak engineer builds the first digital camera. It's toaster-sized and slow, but it takes photos without film. Kodak earns most of its profit from selling film.",
    question: "What's your move?",
    options: [
      { id: "a", text: "Shelve it. Don't hurt our film profits.", score: 15, traits: {} },
      { id: "b", text: "Invest to lead digital, even if it eats film sales.", score: 90, traits: { strategy: 3, risk: 3 } },
      { id: "c", text: "Patent and license it, but stay focused on film.", score: 45, traits: { strategy: 1, risk: 1 } },
      { id: "d", text: "Sell the invention to a rival.", score: 20, traits: { risk: 1 } },
    ],
    bestOptionId: "b",
    actualOptionId: "a",
    actualOutcome:
      "Kodak kept film first. It profited from digital patents but never led the market. As digital cameras and phones replaced film, Kodak filed for bankruptcy in 2012.",
    whyBest: [
      "If a technology will kill your product, better you own it than a rival.",
      "Film profits hid how fast the market would shift.",
      "Early investment would have built the skills Kodak later lacked.",
    ],
    lesson: "Disrupt yourself before someone else does.",
    source: { title: "Wikipedia: Steven Sasson", url: "https://en.wikipedia.org/wiki/Steven_Sasson" },
  },
  {
    id: "intel-memory-1985",
    module: "strategy",
    difficulty: 3,
    company: "Intel",
    year: 1985,
    icon: "cpu",
    setup:
      "Intel was built on memory chips, but Japanese rivals sell them cheaper and Intel is losing money. Its newer microprocessor business, supplying PCs, is growing.",
    question: "What do you do?",
    options: [
      { id: "a", text: "Exit memory chips. Go all-in on microprocessors.", score: 95, traits: { strategy: 3, decisive: 3, risk: 2 } },
      { id: "b", text: "Slash memory prices to fight back.", score: 25, traits: { competitive: 3, risk: 2 } },
      { id: "c", text: "Lobby for trade protection and wait.", score: 30, traits: {} },
      { id: "d", text: "Keep both businesses and cut costs everywhere.", score: 45, traits: { strategy: 1 } },
    ],
    bestOptionId: "a",
    actualOptionId: "a",
    actualOutcome:
      "Andy Grove asked: what would a new CEO do? The answer was leave memory. Intel exited, cut thousands of jobs, and became the world's leading PC processor maker.",
    whyBest: [
      "It could not win a price war on memory.",
      "Money and talent moved to the business with a real edge.",
      "Attachment to the founding product was the main obstacle.",
    ],
    lesson: "Ask what a new CEO would do, then do it.",
    source: { title: "Wikipedia: Andy Grove", url: "https://en.wikipedia.org/wiki/Andy_Grove" },
  },

  // ── Money Matters ────────────────────────────────────────────────────
  {
    id: "airbnb-cereal-2008",
    module: "finance",
    difficulty: 1,
    company: "Airbnb",
    year: 2008,
    icon: "house",
    setup:
      "Your home-sharing startup has few users, investors keep saying no, and the founders are thousands of dollars in credit card debt. The US election is weeks away.",
    question: "How do you survive?",
    options: [
      { id: "a", text: "Quit and get jobs.", score: 10, traits: {} },
      { id: "b", text: "Put more on credit cards and keep going.", score: 30, traits: { risk: 3 } },
      { id: "c", text: "Sell election-themed cereal boxes to fund the startup.", score: 85, traits: { risk: 1, decisive: 2, competitive: 2 } },
      { id: "d", text: "Pivot to selling hotel software.", score: 35, traits: { strategy: 1 } },
    ],
    bestOptionId: "c",
    actualOptionId: "c",
    actualOutcome:
      "They sold \"Obama O's\" and \"Cap'n McCain's\" cereal at $40 a box, raising about $30K. The hustle impressed Y Combinator, which funded them in 2009.",
    whyBest: [
      "It bought runway without giving up equity or adding debt.",
      "Scrappiness showed investors the founders would not quit.",
      "Earning cash beats borrowing when revenue is uncertain.",
    ],
    lesson: "Runway buys time to find what works.",
    source: { title: "Wikipedia: Airbnb", url: "https://en.wikipedia.org/wiki/Airbnb" },
  },
  {
    id: "southwest-turn-1972",
    module: "finance",
    difficulty: 2,
    company: "Southwest Airlines",
    year: 1972,
    icon: "plane",
    setup:
      "Your small airline must sell one of its four planes to pay the bills. But your schedule needs four planes to keep every route running.",
    question: "What do you do?",
    options: [
      { id: "a", text: "Cut routes and shrink the schedule.", score: 40, traits: {} },
      { id: "b", text: "Turn each plane around at the gate in 10 minutes.", score: 90, traits: { strategy: 3, customer: 1, decisive: 2 } },
      { id: "c", text: "Lease a pricey replacement plane.", score: 35, traits: { risk: 2 } },
      { id: "d", text: "Raise fares to cover the gap.", score: 20, traits: {} },
    ],
    bestOptionId: "b",
    actualOptionId: "b",
    actualOutcome:
      "Crews learned to unload, clean, and board in about 10 minutes, so three planes flew a four-plane schedule. Fast turns became Southwest's cost edge; it stayed profitable 47 years in a row.",
    whyBest: [
      "More flights per plane lowers the cost of every seat.",
      "It kept revenue and customers while cutting assets.",
      "A crisis became a lasting operating advantage.",
    ],
    lesson: "Squeeze more from your assets before buying new ones.",
    source: { title: "Wikipedia: Southwest Airlines", url: "https://en.wikipedia.org/wiki/Southwest_Airlines" },
  },
  {
    id: "lego-refocus-2004",
    module: "finance",
    difficulty: 2,
    company: "LEGO",
    year: 2004,
    icon: "blocks",
    setup:
      "LEGO is losing money and close to bankruptcy. It has theme parks, video games, clothing, and thousands of unique brick parts that are costly to make.",
    question: "As the new CEO, what do you do?",
    options: [
      { id: "a", text: "Expand into more new businesses to grow out of it.", score: 15, traits: { risk: 3 } },
      { id: "b", text: "Cut complexity, sell the theme parks, refocus on bricks.", score: 90, traits: { strategy: 3, decisive: 3 } },
      { id: "c", text: "Cut prices to boost sales volume.", score: 30, traits: { competitive: 2 } },
      { id: "d", text: "Sell the company to a bigger toy maker.", score: 25, traits: {} },
    ],
    bestOptionId: "b",
    actualOptionId: "b",
    actualOutcome:
      "CEO Jørgen Vig Knudstorp cut the number of unique parts, sold control of the Legoland parks, and refocused on the brick. LEGO returned to profit in 2005 and later became the world's largest toy maker.",
    whyBest: [
      "Complexity was eating margins: thousands of parts, each made in small volumes.",
      "Selling non-core assets raised cash and bought time.",
      "Focus went back to what customers loved most: the brick.",
    ],
    lesson: "When cash is short, focus beats expansion.",
    source: { title: "Wikipedia: The Lego Group", url: "https://en.wikipedia.org/wiki/The_Lego_Group" },
  },

  // ── Risk & Bets ──────────────────────────────────────────────────────
  {
    id: "new-coke-1985",
    module: "risk",
    difficulty: 2,
    company: "Coca-Cola",
    year: 1985,
    icon: "soda",
    setup:
      "Coca-Cola keeps losing share to sweeter Pepsi. In about 200,000 blind taste tests, people preferred a new, sweeter Coke formula over the original.",
    question: "What do you launch?",
    options: [
      { id: "a", text: "Replace the original formula with the new one.", score: 20, traits: { risk: 3, decisive: 3 } },
      { id: "b", text: "Launch the new taste alongside the original.", score: 85, traits: { strategy: 2, customer: 3 } },
      { id: "c", text: "Keep the formula; out-market Pepsi instead.", score: 60, traits: { competitive: 2 } },
      { id: "d", text: "Cut prices to win back share.", score: 30, traits: { competitive: 2 } },
    ],
    bestOptionId: "b",
    actualOptionId: "a",
    actualOutcome:
      "Coke replaced the original. Loyal fans revolted with hundreds of thousands of angry calls and letters. After 79 days, the old formula returned as \"Coca-Cola Classic.\"",
    whyBest: [
      "Taste tests measured sips, not emotional attachment to a brand.",
      "Adding a product keeps loyal fans while testing the new one.",
      "Removing an icon made the bet public and hard to undo.",
    ],
    lesson: "Data can miss what customers feel.",
    source: { title: "Wikipedia: New Coke", url: "https://en.wikipedia.org/wiki/New_Coke" },
  },
  {
    id: "fedex-blackjack-1973",
    module: "risk",
    difficulty: 3,
    company: "FedEx",
    year: 1973,
    icon: "truck",
    setup:
      "FedEx is new and burning cash. The bank account is down to about $5,000, a $24,000 jet fuel bill is due Monday, and investors have said no.",
    question: "What do you do?",
    options: [
      { id: "a", text: "Fly to Las Vegas and gamble the last $5,000.", score: 25, traits: { risk: 3, decisive: 3 } },
      { id: "b", text: "Tell suppliers the truth and negotiate time to pay.", score: 85, traits: { strategy: 2, decisive: 2, customer: 1 } },
      { id: "c", text: "Ground the planes until new funding arrives.", score: 40, traits: {} },
      { id: "d", text: "Sell a plane to raise cash fast.", score: 55, traits: { decisive: 2 } },
    ],
    bestOptionId: "b",
    actualOptionId: "a",
    actualOutcome:
      "Founder Fred Smith flew to Las Vegas and won $27,000 at blackjack, covering the fuel bill. FedEx soon raised new funding and survived. It worked, but it was luck, not strategy.",
    whyBest: [
      "A good outcome doesn't make a good decision; he could have lost it all.",
      "Suppliers often prefer a short delay to losing a customer.",
      "Honest negotiation buys time and keeps options open.",
    ],
    lesson: "Judge decisions by the process, not just the outcome.",
    source: { title: "Wikipedia: Frederick W. Smith", url: "https://en.wikipedia.org/wiki/Frederick_W._Smith" },
  },

  // ── Growth Plays ─────────────────────────────────────────────────────
  {
    id: "starbucks-reset-2008",
    module: "growth",
    difficulty: 2,
    company: "Starbucks",
    year: 2008,
    icon: "coffee",
    setup:
      "Starbucks opened stores so fast that coffee quality and service slipped. Customer visits are falling, the stock has dropped sharply, and a recession is starting.",
    question: "As returning CEO, what do you do?",
    options: [
      { id: "a", text: "Keep opening stores fast to hit growth targets.", score: 15, traits: { risk: 2, competitive: 2 } },
      { id: "b", text: "Close weak stores and retrain baristas on quality.", score: 90, traits: { strategy: 3, customer: 3, decisive: 2 } },
      { id: "c", text: "Cut prices to win customers back.", score: 35, traits: { competitive: 2 } },
      { id: "d", text: "Add more food and merchandise for revenue.", score: 40, traits: {} },
    ],
    bestOptionId: "b",
    actualOptionId: "b",
    actualOutcome:
      "Howard Schultz closed about 600 US stores and shut 7,100 stores for an afternoon to retrain baristas. Sales and the stock recovered within about two years.",
    whyBest: [
      "Fast growth had diluted the experience customers paid a premium for.",
      "Closing weak stores freed cash going into a recession.",
      "Price cuts would have cheapened a premium brand.",
    ],
    lesson: "Growth that hurts the core is not growth.",
    source: { title: "Wikipedia: Howard Schultz", url: "https://en.wikipedia.org/wiki/Howard_Schultz" },
  },
  {
    id: "microsoft-cloud-2014",
    module: "growth",
    difficulty: 3,
    company: "Microsoft",
    year: 2014,
    icon: "cloud",
    setup:
      "Microsoft still earns most of its profit from Windows and Office, but people are moving to iPhones and Android. Amazon leads cloud computing. You are the new CEO.",
    question: "Where do you steer?",
    options: [
      { id: "a", text: "Protect Windows: keep Office exclusive to Windows.", score: 20, traits: {} },
      { id: "b", text: "Put Office on every device and bet big on cloud.", score: 90, traits: { strategy: 3, customer: 2, risk: 2 } },
      { id: "c", text: "Double down on Microsoft phones to beat the iPhone.", score: 15, traits: { competitive: 3, risk: 3 } },
      { id: "d", text: "Cut R&D and return cash to shareholders.", score: 35, traits: {} },
    ],
    bestOptionId: "b",
    actualOptionId: "b",
    actualOutcome:
      "Satya Nadella launched Office for iPad, pushed hard into Azure cloud, and wrote off the Nokia phone deal. Microsoft passed $1 trillion in market value in 2019.",
    whyBest: [
      "Customers had already chosen their devices; meet them there.",
      "Cloud was the next platform, and Azure could compete.",
      "Exclusivity only protects you while you dominate.",
    ],
    lesson: "Go where customers are, not where you were.",
    source: { title: "Wikipedia: Satya Nadella", url: "https://en.wikipedia.org/wiki/Satya_Nadella" },
  },

  // ── Crisis Leadership ────────────────────────────────────────────────
  {
    id: "tylenol-recall-1982",
    module: "crisis",
    difficulty: 1,
    company: "Johnson & Johnson",
    year: 1982,
    icon: "pill",
    setup:
      "Seven people in Chicago die after taking Tylenol capsules that someone laced with cyanide. It's not your factory's fault, but Tylenol is your top-selling product.",
    question: "What do you do?",
    options: [
      { id: "a", text: "Recall every bottle nationwide and warn the public.", score: 95, traits: { customer: 3, decisive: 3 } },
      { id: "b", text: "Recall only in the Chicago area.", score: 40, traits: {} },
      { id: "c", text: "Say it's not your fault and keep selling.", score: 10, traits: { competitive: 1 } },
      { id: "d", text: "Quietly remove stock and avoid the press.", score: 15, traits: {} },
    ],
    bestOptionId: "a",
    actualOptionId: "a",
    actualOutcome:
      "Johnson & Johnson recalled about 31 million bottles, costing roughly $100M, and relaunched with tamper-resistant packaging. Tylenol regained most of its market share within about a year.",
    whyBest: [
      "Putting safety first protected long-term trust.",
      "Fast, open action stopped rumors from filling the silence.",
      "New packaging turned the crisis into an industry standard.",
    ],
    lesson: "In a crisis, trust is the asset to protect.",
    source: { title: "Wikipedia: Chicago Tylenol murders", url: "https://en.wikipedia.org/wiki/Chicago_Tylenol_murders" },
  },
  {
    id: "dominos-turnaround-2009",
    module: "crisis",
    difficulty: 2,
    company: "Domino's",
    year: 2009,
    icon: "pizza",
    setup:
      "Domino's sales are weak, and customers are brutal online: they say the crust tastes like cardboard. Your ads still say the pizza is great.",
    question: "What's your response?",
    options: [
      { id: "a", text: "Ignore it. Critics are a loud minority.", score: 15, traits: {} },
      { id: "b", text: "Run a new ad campaign about quality.", score: 30, traits: { competitive: 1 } },
      { id: "c", text: "Admit it publicly, rebuild the recipe, show critics in ads.", score: 90, traits: { customer: 3, risk: 2, decisive: 2 } },
      { id: "d", text: "Offer deep discounts.", score: 40, traits: { competitive: 2 } },
    ],
    bestOptionId: "c",
    actualOptionId: "c",
    actualOutcome:
      "Domino's aired ads showing harsh customer reviews and its new recipe. Sales jumped the next year, and the stock rose more than 20 times over the following decade.",
    whyBest: [
      "Honesty made the new recipe believable.",
      "Fixing the product beats marketing a bad one.",
      "Critics became part of the comeback story.",
    ],
    lesson: "Fix the product, then tell the truth about it.",
    source: { title: "Wikipedia: Domino's", url: "https://en.wikipedia.org/wiki/Domino%27s" },
  },

  // ── Pricing Power ────────────────────────────────────────────────────
  {
    id: "itunes-99-cents-2003",
    module: "pricing",
    difficulty: 1,
    company: "Apple",
    year: 2003,
    icon: "music",
    setup:
      "Millions download music free and illegally. Record labels are scared, and there's no easy legal way to buy songs online. You make the iPod.",
    question: "What do you offer?",
    options: [
      { id: "a", text: "Sell single songs legally for 99 cents each.", score: 90, traits: { strategy: 3, customer: 3 } },
      { id: "b", text: "A monthly subscription for all music.", score: 50, traits: { risk: 2 } },
      { id: "c", text: "Free music paid for by ads.", score: 35, traits: { risk: 2 } },
      { id: "d", text: "Stay out; just sell iPods.", score: 20, traits: {} },
    ],
    bestOptionId: "a",
    actualOptionId: "a",
    actualOutcome:
      "Apple opened the iTunes Store at 99 cents a song. It sold about a million songs in its first week and helped make the iPod a must-have.",
    whyBest: [
      "A simple, low price made buying easier than stealing.",
      "Labels agreed because every song earned money.",
      "Songs sold iPods, and iPods sold songs.",
    ],
    lesson: "Make the right choice the easy choice.",
    source: { title: "Wikipedia: iTunes Store", url: "https://en.wikipedia.org/wiki/ITunes_Store" },
  },
  {
    id: "amazon-prime-2005",
    module: "pricing",
    difficulty: 2,
    company: "Amazon",
    year: 2005,
    icon: "package",
    setup:
      "Amazon wants customers to shop more often. Fast shipping is expensive, and finance worries free shipping will lose money on every heavy order.",
    question: "What do you launch?",
    options: [
      { id: "a", text: "$79 a year for unlimited free two-day shipping.", score: 90, traits: { strategy: 3, customer: 3, risk: 2 } },
      { id: "b", text: "Keep charging shipping on every order.", score: 30, traits: {} },
      { id: "c", text: "Lower the free-shipping minimum a little.", score: 50, traits: { customer: 1 } },
      { id: "d", text: "Charge extra for faster shipping per order.", score: 40, traits: {} },
    ],
    bestOptionId: "a",
    actualOptionId: "a",
    actualOutcome:
      "Amazon launched Prime at $79 a year. Members shopped far more often, making the shipping cost worth it. Prime passed 200 million members worldwide by 2021.",
    whyBest: [
      "A yearly fee makes members want to get their money's worth.",
      "More orders and loyalty outweighed the extra shipping cost.",
      "Removing friction changes habits, not just one order.",
    ],
    lesson: "Price to change behavior, not just to cover cost.",
    source: { title: "Wikipedia: Amazon Prime", url: "https://en.wikipedia.org/wiki/Amazon_Prime" },
  },
];
