// Semua teks website ada di file ini dan di cases.ts.
// Ganti di sini, jangan di komponen. Inline format yang didukung di paragraf:
// `kode`, *miring*, **tebal**, [teks link](https://url).

export const profile = {
  name: "Jessen William",
  shortName: "Will",
  role: "Computer Science student at BINUS University",
  location: "Jakarta, Indonesia, Mandarin",
  email: "jessen.william23@gmail.com",
  github: "https://github.com/Jessssswill",
  linkedin: "https://www.linkedin.com/in/jessen-william-879785315",
  description:
    "Jessen William (Will), Computer Science student at BINUS University. Full-stack TypeScript with NestJS and Next.js, plus Flutter. Founder of Trisenpai. Joining the Apple Developer Academy in Bali in March 2027.",
};

export const intro = {
  kicker: "Jessen William · Software Engineering, BINUS University",
  headline: "I'm Will. I like building software that real people end up using.",
  /** Words in the headline that get the highlighter stroke. */
  headlineMark: "real people",
  paragraphs: [
    "So far that has been a paid coding bootcamp for first-year students, a voucher system a pastry brand used at its event, and a real-time board game platform for a software architecture class. Most of it is TypeScript: NestJS on the server, React and Next.js on the client, and Flutter when it has to live on a phone.",
    "I'm in my third year of Computer Science at BINUS University in Jakarta. From March 2027 I'll be at the Apple Developer Academy in Bali.",
  ],
  facts: [
    { label: "Now", value: "5th semester, Software Engineering stream" },
    { label: "Next", value: "Apple Developer Academy, Bali, from March 2027" },
    { label: "Open to", value: "Freelance web and backend work" },
  ],
};

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  line: string;
  /** Short version of the line, for the list at the top of the homepage. */
  short: string;
  /** One line of proof next to it: numbers or facts, nothing vague. */
  proof: string;
  year: string;
  context: string;
  role: string;
  team: string;
  stack: string[];
  /** Label for the stack row. Defaults to "Stack". */
  stackLabel?: string;
  summary: string;
  figure: {
    title: string;
    caption: string;
  };
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "playhub",
    title: "PlayHub",
    line: "Real-time board games in the browser, built to practise software architecture properly.",
    short: "Real-time board games in the browser",
    proof: "Lead dev · 11 GoF patterns · 142 tests",
    year: "2026",
    context: "Software Architecture course",
    role: "Lead developer and architect",
    team: "Team of 5",
    stack: ["NestJS 11", "Next.js 16", "Socket.io", "TypeORM", "Jest"],
    summary:
      "Two players join a session and play tic-tac-toe, Connect Four or chess, and every move is pushed to both screens over WebSockets. The course graded the structure more than the games, so the backend has four layers with clear boundaries, eleven Gang of Four patterns that each do one specific job, and 142 tests. I designed the architecture and built most of what runs today.",
    figure: {
      title: "Trace one move through the backend",
      caption:
        "Click a square. Your move takes the same path it takes in PlayHub's NestJS backend, and almost every stop is one of the patterns. Try moving as a stranger or pausing the session: the guards reject it with the real error messages from the code. O is played by a browser port of PlayHub's minimax adapter.",
    },
    links: [{ label: "Source", href: "https://github.com/Jessssswill/PlayHub-SoftwareArchitecture" }],
  },
  {
    slug: "okachu",
    title: "OKACHU",
    line: "A voucher system for a pastry brand's event, built solo for a real client.",
    short: "Voucher system for a real client",
    proof: "Built solo · used at their event",
    // TODO(Will): cek lagi tahunnya
    year: "2026",
    context: "Freelance",
    role: "Solo developer",
    team: "Just me",
    stack: ["React", "Vite", "NestJS", "Prisma", "MySQL", "Railway", "Vercel"],
    summary:
      "OKACHU is an artisan choux pastry brand from Dumai, Riau, run by a team of high school students for a national competition. They wanted visitors to type in a voucher code and win a random character sticker. I built the whole thing, from the phone-first claim page to the API, the database and the deployment, and it was used at their event. It was my first real client, and the first time a race condition actually mattered.",
    figure: {
      title: "Two phones, one voucher",
      caption:
        "Two people type the same code and tap at the same moment. With a naive read-then-write, both requests see an unused voucher and both win. The version I shipped lets the database check and write in a single statement, so only one claim can succeed.",
    },
    links: [{ label: "okachu.vercel.app", href: "https://okachu.vercel.app" }],
  },
  {
    slug: "trisenpai",
    title: "Trisenpai",
    line: "A paid coding bootcamp for first-year students, started with two friends.",
    short: "Paid C bootcamp I started",
    proof: "Founder · ~20 students · 17 sessions",
    year: "2025",
    context: "Student business",
    role: "Founder and lead instructor",
    team: "Team of 3",
    stack: ["C", "Canva", "YouTube", "Discord", "HTML", "Tailwind", "Three.js"],
    summary:
      "A lot of first-year students at BINUS struggle with Algorithm and Programming, the course where they meet C for the first time. In July 2025 I started Trisenpai with a co-instructor and a friend who handled payments. I made all 15 slide decks and 15 recorded lessons, built the website, and taught the classes together with my co-instructor. The first batch had about 20 paying students.",
    figure: {
      title: "Batch one, session by session",
      caption:
        "17 evening sessions for new students, from 21 July to 27 August 2025. Two were full exam simulations built from past midterm and final problems, each followed by a session on the answers. Pick a session to see what it covered.",
    },
    links: [{ label: "trisenpai.vercel.app", href: "https://trisenpai.vercel.app" }],
  },
  {
    slug: "splitit",
    title: "SplitIt",
    line: "Split a bill by who ordered what, then keep track of who has actually paid.",
    short: "Split bills by who ordered what",
    proof: "Backend dev · NestJS, Prisma, JWT",
    year: "2026",
    context: "Software Engineering course",
    role: "Backend developer",
    team: "Team of 3",
    stack: ["NestJS", "Prisma", "MySQL", "JWT", "React", "Zustand"],
    summary:
      "A group expense app, a bit like Splitwise. I wrote the backend: sign-up and login with bcrypt and JWT, the schema for friends, groups and expenses, and the per-item split logic. Every expense stores one split per person with what they ordered, and each split moves from unpaid, to paid with a photo of the transfer, to confirmed by whoever paid the bill.",
    figure: {
      title: "One receipt, three splits",
      caption:
        "Tap an item to change who ordered it. Each person ends up with one ExpenseSplit row, the same shape as in the Prisma schema. Then use the links under each row to run the payment flow: upload a transfer photo, and let the payer confirm or decline it.",
    },
    links: [{ label: "Source", href: "https://github.com/maltzu-edward/SplitIt" }],
  },
];

export type OtherWork = {
  year: string;
  title: string;
  what: string;
  stack: string;
  context: string;
  href?: string;
};

export const otherWork: OtherWork[] = [
  {
    year: "2026",
    title: "GenPeak Impact",
    what: "A Flutter shop for game weapons that we turned into a small RPG, with elemental gear and boss fights feeding back into the shop.",
    stack: "Flutter, Express, MySQL",
    context: "Mobile Hybrid Solution course, team of 2",
    href: "https://github.com/Jessssswill/Genpeak-Impact",
  },
  {
    year: "2026",
    title: "AsalKenyang",
    what: "Offline-first recipe, budget and meal planning app for students who live in a kos.",
    stack: "Flutter, Riverpod, Drift, Express, Prisma",
    context: "Mobile Application Development, team of 3",
    href: "https://github.com/BryanWidjaja/AsalKenyang",
  },
  {
    year: "2026",
    title: "Rental System refactor",
    what: "Before and after versions of a Java rental system, removing eight design smells, plus a 17-page report.",
    stack: "Java",
    context: "Code Reengineering course, group lead",
    href: "https://github.com/Jessssswill/AOL-code-reengineering-RentalSystem-",
  },
  {
    // TODO(Will): kalau videonya udah di-upload, isi href-nya
    year: "2026",
    title: "Binus Square promo",
    what: "A 30-second promo for my dorm, edited in code from 93 raw clips.",
    stack: "Remotion, React, TypeScript",
    context: "Personal",
  },
  {
    year: "2025",
    title: "Feedback Quest",
    what: "Feedback system for BNCC events, with an admin dashboard, filters and CSV export.",
    stack: "React, Express",
    context: "BNCC Research and Development",
    href: "https://github.com/Jessssswill/BNCC-Feedback-Quest",
  },
  {
    year: "Now",
    title: "Qi Cultivation",
    what: "A Roblox action game I'm making with three friends. Right now I'm moving 81 Luau scripts over to typed roblox-ts.",
    stack: "Luau, roblox-ts, Rojo",
    context: "Personal, in progress",
    href: "https://github.com/Jessssswill/RobloxCultivation",
  },
];

export const about = {
  paragraphs: [
    "I'm Jessen William, but almost everyone calls me Will. I study Computer Science at BINUS University in the Software Engineering stream, and I'll graduate in 2028.",
    "Most of what I know I learned by building something for someone and finding out what breaks. Teaching at Trisenpai changed how I work. You can't explain pointers to twenty tired first-years at eight in the evening unless you really get them yourself, so now I try to understand things well enough to explain them. That's also why the projects here come with diagrams you can poke at.",
    "I live at Binus Square, BINUS's student housing in Jakarta, where I'm a floor coordinator. That means looking after the people on my floor and helping run events like Jester's Night Tricks, which brought out more than a hundred residents. Outside class I'm making a Roblox action game with three friends.",
  ],
};

export type Role = {
  when: string;
  title: string;
  org: string;
  note?: string;
};

export const experience: Role[] = [
  {
    when: "From Mar 2027",
    title: "Learner",
    org: "Apple Developer Academy @ BINUS, Bali",
    note: "Taken as my internship through BINUS.",
  },
  {
    when: "Since Aug 2025",
    title: "Floor coordinator",
    org: "Binus Square",
    note: "Residents on my floor, plus community events for 100+ people.",
  },
  {
    when: "Jul 2025 to 2026",
    title: "Founder and lead instructor",
    org: "Trisenpai",
    note: "Paid C bootcamp for first-year students. About 20 students in the first batch.",
  },
  {
    // TODO(Will): cek lagi tahunnya
    when: "2026",
    title: "Freelance web developer",
    org: "OKACHU",
    note: "Voucher claim system, built and deployed solo.",
  },
  {
    when: "2025 to 2026",
    title: "Research and Development member",
    org: "BNCC, Bina Nusantara Computer Club",
    note: "Internal tools like Feedback Quest.",
  },
  {
    when: "2024 to 2028",
    title: "B.Sc. Computer Science",
    org: "BINUS University",
    note: "Software Engineering stream.",
  },
];

export const tools: { group: string; items: string[] }[] = [
  { group: "Main stack", items: ["TypeScript", "NestJS", "React", "Next.js", "Prisma", "MySQL", "PostgreSQL", "Git"] },
  { group: "Also shipped with", items: ["Flutter", "Dart", "Express", "Socket.io", "Laravel", "Java", "C", "Tailwind CSS", "Jest"] },
  { group: "Design and video", items: ["Figma", "Canva", "Remotion"] },
  { group: "Ways of working", items: ["Layered architecture", "GoF patterns", "REST and WebSocket APIs", "Vercel and Railway deploys"] },
];

export const contact = {
  line: "Email is the fastest way to reach me. I reply in English or Bahasa Indonesia.",
};
