// Isi halaman /work/[slug]. Tiap project = daftar blok yang dirender berurutan.
// Blok "figure" = diagram interaktif project itu.

export type Block =
  | { type: "h"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; file?: string; lang: string; code: string }
  | { type: "table"; head: string[]; rows: string[][]; numeric?: number[] }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "note"; text: string }
  | { type: "figure" };

export const cases: Record<string, Block[]> = {
  playhub: [
    { type: "h", text: "What it is" },
    {
      type: "p",
      text: "PlayHub is a browser platform for two-player board games. You create a session, the other player joins, and both of you see every move as it happens. It runs tic-tac-toe, Connect Four and chess, with a lobby, a move history, and an architecture page that explains the code base with diagrams.",
    },
    {
      type: "p",
      text: "It was the main project for my Software Architecture course, where the grade was about the design and not about the games. So the backend is organised to make every design decision easy to find: one folder per layer, classes named after the pattern they implement, and a test file for each pattern.",
    },
    { type: "h", text: "Four layers" },
    {
      type: "list",
      items: [
        "**Presentation.** The REST controller, DTO validation with class-validator, and the Socket.io gateway that pushes events to players.",
        "**Business.** The game engine facade, the session lifecycle states, the rules for each game, the builder and factories, and the event bus.",
        "**Persistence.** Storage adapters (in memory, or TypeORM on SQLite) and the two proxies that guard and cache access to the engine.",
        "**Infrastructure.** Configuration, the session registry, and the adapters for the AI opponents.",
      ],
    },
    { type: "h", text: "The path of a move" },
    {
      type: "p",
      text: "A move is a `POST /sessions/:id/move`. It goes through the authorization proxy, into the facade, through the session's current state and the move validator, and then into the game itself. The game broadcasts the result as an event, and the gateway sends it to everyone in the session's Socket.io room. The diagram below follows exactly that path.",
    },
    { type: "figure" },
    {
      type: "p",
      text: "The order of a turn lives in one place. Every game extends the same abstract class and only fills in its own rules, which is the Template Method pattern doing what it is meant for:",
    },
    {
      type: "code",
      file: "backend/src/business/domain/games/game.abstract.ts",
      lang: "ts",
      code: `export abstract class Game {
  executeTurn(state: GameState, move: Move, emitter: GameEventEmitter): TurnResult {
    this.validateMove(state, move);
    const newState = this.applyMove(state, move);
    const endResult = this.checkEndCondition(newState);
    emitter.emit('move.applied', { newState, move, endResult });
    if (endResult.isOver) {
      emitter.emit('game.finished', { endResult });
    }
    return { newState, endResult };
  }

  protected abstract validateMove(state: GameState, move: Move): void;
  protected abstract applyMove(state: GameState, move: Move): GameState;
  protected abstract checkEndCondition(state: GameState): EndCondition;
}`,
    },
    { type: "h", text: "Eleven patterns, one job each" },
    {
      type: "table",
      head: ["Pattern", "What it does here"],
      rows: [
        ["Singleton", "One `GameRegistry` holds every active session in memory for the lifetime of the app."],
        ["Prototype", "`GameState.clone()` lets the engine try a move without touching the real state."],
        ["Builder", "`GameSessionBuilder` assembles a session step by step: players, time control, private or public, spectators."],
        ["Abstract Factory", "One factory per game produces a board, rules and an initial state that belong together."],
        ["Template Method", "`Game.executeTurn()` fixes the order of a turn. Each game only fills in the steps."],
        ["State", "Waiting, in progress, paused and finished are state objects, not a chain of if statements."],
        ["Observer", "A per-session event emitter and a global event bus carry domain events to the WebSocket gateway."],
        ["Facade", "`GameEngineFacade` hides the coordination between registry, factories, builder, states and engines."],
        ["Proxy (protection)", "Rejects moves from anyone who isn't a player in the session, before they reach the facade."],
        ["Proxy (cache)", "Caches `getState()` for one second and clears itself when a move is applied."],
        ["Adapter", "Random, minimax and external AI engines sit behind one `IAIEngine` interface, so they can be swapped."],
      ],
    },
    {
      type: "stats",
      items: [
        { value: "11", label: "GoF patterns" },
        { value: "142", label: "tests across 17 spec files" },
        { value: "3", label: "games on one engine" },
        { value: "1,700+", label: "lines of handoff docs" },
      ],
    },
    { type: "h", text: "My part" },
    {
      type: "p",
      text: "I led a team of five. I designed the layers and the pattern map, built the architecture and most of the code that runs today, and wrote the handoff documentation (five files, a little over 1,700 lines) so the rest of the team could pick up features without having to ask me where things go.",
    },
    { type: "h", text: "What I'd do next" },
    {
      type: "list",
      items: [
        "Moves currently go in over REST and come back over the socket. Sending commands over the socket as well would make a move one message instead of two.",
        "The minimax adapter exists and is tested, but there is no button to play against it yet. The demo on this page is the first place you can.",
        "Minimax only covers tic-tac-toe. Chess has a random-move adapter, and Connect Four has no AI yet.",
      ],
    },
  ],

  okachu: [
    { type: "h", text: "The brief" },
    {
      type: "p",
      text: "OKACHU is an artisan choux pastry brand from Dumai, Riau, run by a team of high school students for a national competition. At their event, customers received voucher codes. Typing a code on your phone should reveal a random character sticker, and every code should only ever work once.",
    },
    {
      type: "p",
      text: "This was my first real client. Not a class assignment, not a tutorial. Someone had a real need, the people using it were not technical, and it had to work on the day.",
    },
    { type: "h", text: "What I built" },
    {
      type: "list",
      items: [
        "A phone-first claim page in React and Vite: enter the code, get your character.",
        "A NestJS API with Prisma, on a MySQL database hosted on Railway.",
        "An admin endpoint to manage the voucher pool, and a script that generated the 100 codes.",
        "The deployment: frontend on Vercel, backend on Railway, with environment variables and CORS set up between them.",
      ],
    },
    { type: "h", text: "The race condition" },
    {
      type: "p",
      text: "The obvious way to claim a voucher is to read it, check `isUsed`, then write. That is fine when people take turns. At an event they don't. Two phones can read the same unused voucher before either write lands, and then both of them win.",
    },
    { type: "figure" },
    {
      type: "p",
      text: "The fix is to stop asking first. `updateMany` with `isUsed: false` inside the `where` clause turns the check and the write into a single `UPDATE ... WHERE code = ? AND isUsed = false`. The database applies it to the row once. The second request matches zero rows, and the API answers with a 409.",
    },
    {
      type: "code",
      lang: "ts",
      code: `// claim atomically: the filter on isUsed is part of the write
const result = await this.prisma.voucher.updateMany({
  where: { code, isUsed: false },
  data: { isUsed: true, claimedAt: new Date(), characterId },
});

// count 0 means it was already claimed, or the code doesn't exist
if (result.count === 0) {
  throw new ConflictException('Voucher already claimed or invalid');
}`,
    },
    { type: "h", text: "What I learned" },
    {
      type: "list",
      items: [
        "Real client work is different from a class project. People who aren't technical need very clear screens and no jargon, and it simply has to work on the day.",
        "Race conditions are not a textbook topic. The schema has one or two tables, and it still taught me the difference between `update` and a filtered `updateMany`.",
        "Deployment is part of the job: two hosts, environment variables, CORS, and keeping secrets out of git. I learned that last one the hard way.",
      ],
    },
  ],

  trisenpai: [
    { type: "h", text: "Why I started it" },
    {
      type: "p",
      text: "Algorithm and Programming is the first-semester course at BINUS where most students write C for the first time, and a lot of my friends struggled with it. The pace on campus is fine if you have coded before and rough if you haven't. Trisenpai was meant to fill that gap with seniors teaching juniors, people who had just survived the same course.",
    },
    { type: "h", text: "How it ran" },
    {
      type: "list",
      items: [
        "Three of us: me, a co-instructor, and a friend who handled registration and payments.",
        "17 evening sessions from 21 July to 27 August 2025, from the basics of C through pointers, recursion, structs, files, sorting and searching.",
        "Two full exam simulations built from past midterm and final problems, each followed by a session going through the answers and common mistakes.",
        "I made all 15 slide decks in Canva and recorded 15 video lessons, and we taught the live sessions between the two of us.",
        "Students worked in a Discord server with channels for lesson material, code submissions and a ticket system for questions.",
      ],
    },
    { type: "figure" },
    { type: "h", text: "Pricing" },
    {
      type: "p",
      text: "We sold three packages, and signing up with friends was cheaper per person. The landing page put it as *belajar bareng teman lebih seru dan hemat*: studying with friends is more fun, and cheaper.",
    },
    {
      type: "table",
      head: ["Package", "Price", "Per person"],
      numeric: [1, 2],
      rows: [
        ["Solo (Paket Jomblo)", "Rp150.000", "Rp150.000"],
        ["Duo (Paket Bucin)", "Rp280.000", "Rp140.000"],
        ["Trio (Paket Keluarga Mesra)", "Rp400.000", "Rp133.000"],
      ],
    },
    {
      type: "stats",
      items: [
        { value: "~20", label: "paying students in batch one" },
        { value: "17", label: "live sessions" },
        { value: "15", label: "slide decks" },
        { value: "15", label: "recorded lessons" },
      ],
    },
    { type: "h", text: "The website" },
    {
      type: "p",
      text: "The site handles the course outline, registration and the module pages students see after logging in. I kept it a multi-page static site on purpose. It is mostly content, so a single-page app would have been overkill, and static pages load fast and deploy anywhere. It uses Tailwind and plain JavaScript, with a Three.js intro on the landing page. The login is a demo that keeps state in localStorage, since real accounts would need a backend.",
    },
    { type: "h", text: "Where it is now" },
    {
      type: "p",
      text: "The first batch ran to the end, and Trisenpai has been on a break since. I'm not teaching anymore, and a relaunch under a new team and a new name is planned.",
    },
    { type: "h", text: "What I learned" },
    {
      type: "list",
      items: [
        "Teaching is not the same as knowing. Explaining pointers to beginners forced me to understand them properly.",
        "Three people in one repo needs a git workflow, even for a static site.",
      ],
    },
  ],

  splitit: [
    { type: "h", text: "What it does" },
    {
      type: "p",
      text: "SplitIt is a group expense app, a bit like Splitwise. You add friends, make a group, and log what you spent. Instead of dividing a bill evenly, every person is charged for what they actually ordered. The app then keeps track of who has paid, with a photo of the transfer as proof, until whoever paid the bill confirms it. It also has in-group chat, dark mode, and receipt scanning.",
    },
    {
      type: "p",
      text: "It was the final project for our Software Engineering course, built by three of us. I was the backend developer.",
    },
    { type: "h", text: "My part: the backend" },
    {
      type: "list",
      items: [
        "Sign-up and login, with passwords hashed by bcrypt and sessions carried by JWT.",
        "The relational schema in Prisma: users, friendships, groups and members, messages, expenses and their splits.",
        "The per-item split logic and the payment flow on top of it.",
        "The balance summary: two Prisma aggregates that add up what you owe and what you are owed.",
      ],
    },
    { type: "figure" },
    { type: "h", text: "The data model" },
    {
      type: "p",
      text: "An expense belongs to a group and has one payer. Every person in it gets one `ExpenseSplit` with their amount and what they ordered, and the payment state lives on that row:",
    },
    {
      type: "code",
      file: "splitit-backend/prisma/schema.prisma",
      lang: "prisma",
      code: `model Expense {
  id        String         @id @default(uuid())
  title     String         // e.g. "KFC Lunch"
  amount    Float          // total bill
  groupId   String
  payerId   String         // who paid first
  splits    ExpenseSplit[] // one per person
}

model ExpenseSplit {
  id           String    @id @default(uuid())
  expenseId    String
  userId       String
  amount       Float     // how much this person owes
  description  String?   // what they ordered
  isPaid       Boolean   @default(false)
  isValidated  Boolean   @default(false)
  paymentProof String?   // photo of the transfer
  paidAt       DateTime?
}`,
    },
    {
      type: "p",
      text: "Uploading a proof sets `isPaid`, stores the photo and stamps `paidAt`. The payer can then validate the split, or decline it, which clears all three so the debt shows up again.",
    },
    { type: "h", text: "What I learned" },
    {
      type: "list",
      items: [
        "How NestJS modules keep a growing API organised: auth, friends, groups, expenses and messages each in their own module.",
        "Prisma migrations, and modelling many-to-many relations like friendships and group members.",
        "The trade-offs between JWT and server sessions, and why we went with JWT.",
        "Working in a team with git branches, and testing the backend like someone else depends on it, because someone did.",
      ],
    },
  ],
};
