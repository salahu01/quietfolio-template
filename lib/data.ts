/**
 * All personal content for the home page lives here. Replace the sample values with your own.
 * Case studies and blog posts live in content/work.json and content/blog.json.
 */
export const profile = {
  name: "Alex Morgan",
  short: "Alex",
  role: "Full Stack Developer",
  location: "Anywhere, Earth",
  timezone: "UTC",
  email: "hello@example.com",
  github: "https://github.com/octocat",
  githubUser: "octocat", // powers the GitHub activity graph
  linkedin: "https://www.linkedin.com/in/your-handle",
  x: "https://x.com/your_handle",
  resume: "/resume", // the generated /resume page; point to your own PDF URL if you prefer
  avatar: "/img/avatar.jpeg",
  // Optional, used for structured data. Leave empty strings to omit.
  region: "",
  country: "",
  about: [
    "Hi, I'm Alex, a full-stack developer who enjoys building products that pair clean interfaces with solid, scalable backends.",
    "I work mostly with TypeScript, React, Next.js, Node.js and PostgreSQL, and I like taking an idea from a rough sketch all the way to a deployed product.",
    "This is sample content from the quietfolio template. Edit lib/data.ts, content/work.json and content/blog.json to make it yours.",
  ],
  snapshot: [
    "Building full-stack products.",
    "Designing clean, fast interfaces.",
    "Writing about engineering.",
    "Always learning something new.",
  ],
};

export type Category = "Web" | "Mobile" | "Desktop" | "Tooling";

export const projectFilters: ("All" | Category)[] = ["All", "Web", "Mobile", "Desktop", "Tooling"];

export const projects: {
  title: string;
  image: string;
  year: string;
  category: Category;
  featured?: boolean;
  status: "LIVE" | "WIP" | "PRIVATE";
  description: string;
  tags: string[];
  live?: string;
  repo?: string;
  /** Path of a case study in content/work.json, e.g. "/work/northwind-dashboard". */
  caseStudy?: string;
}[] = [
  {
    title: "Northwind Dashboard",
    image: "/img/projects/northwind-dashboard.jpg",
    year: "2026",
    category: "Web",
    featured: true,
    status: "LIVE",
    description:
      "A sample analytics dashboard: real-time charts, role-based access and CSV export, built as a fast single-page app on a typed API.",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    live: "https://example.com",
    repo: "https://github.com/octocat/Hello-World",
    caseStudy: "/work/northwind-dashboard",
  },
  {
    title: "Pocket Budget",
    image: "/img/projects/pocket-budget.jpg",
    year: "2025",
    category: "Mobile",
    featured: true,
    status: "LIVE",
    description:
      "A sample personal-finance app that works offline first: log spending in seconds and sync when a connection returns.",
    tags: ["React Native", "SQLite", "TypeScript"],
    live: "https://example.com",
    caseStudy: "/work/pocket-budget",
  },
  {
    title: "Plainfile CLI",
    image: "/img/projects/plainfile-cli.jpg",
    year: "2025",
    category: "Tooling",
    featured: true,
    status: "LIVE",
    description:
      "A sample command-line tool that keeps folders of plain text files in sync, with conflict resolution and a dry-run mode.",
    tags: ["Node.js", "CLI", "TypeScript"],
    repo: "https://github.com/octocat/Hello-World",
    caseStudy: "/work/plainfile-cli",
  },
  {
    title: "Orbit Notes",
    image: "/img/projects/orbit-notes.jpg",
    year: "2026",
    category: "Desktop",
    status: "WIP",
    description:
      "A sample desktop notes app with local-first storage and instant search. This entry has no case study, which is fine.",
    tags: ["Electron", "React", "SQLite"],
    repo: "https://github.com/octocat/Hello-World",
  },
];

export const experience = [
  {
    role: "Senior Full Stack Developer",
    company: "Acme Corp",
    period: "2023 – Present",
    body: "Sample entry. Lead a small team building customer-facing web products, from architecture and APIs to CI/CD and performance budgets.",
  },
  {
    role: "Full Stack Developer",
    company: "Globex",
    period: "2020 – 2023",
    body: "Sample entry. Built and shipped internal tools and a public dashboard used by thousands of people every week.",
  },
];

export const stackGroups: Record<string, string[]> = {
  Languages: ["TypeScript", "JavaScript", "Python", "SQL"],
  Frontend: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
  Backend: ["Node.js", "PostgreSQL", "Redis", "GraphQL", "REST"],
  "DevOps & Cloud": ["Docker", "GitHub Actions", "Vercel", "Netlify"],
  Tools: ["Git", "Figma", "Playwright", "Vitest"],
};
