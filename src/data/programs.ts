/**
 * SINGLE SOURCE OF TRUTH for all G-Dnyasa programme information.
 *
 * Powers: programme cards, programme detail modals, the Join Now enrolment
 * selector, and the AI assistant's knowledge base.
 *
 * Source document: "GDNYASA PROGRAMMES (1)".
 * Do not duplicate this information anywhere else.
 */

export type ProgramId =
  | "full-course"
  | "masterclass"
  | "career-guidance"
  | "pyq-solving";

export interface ProgramPlan {
  /** Visual tier name kept from the existing G-Dnyasa design language. */
  gem?: string;
  name: string;
  price: number;
  badgeClass?: string;
}

export interface ProgramJourneyStep {
  label: string;
  detail: string;
}

export interface Program {
  id: ProgramId;
  title: string;
  /** Value passed to the enrolment form. */
  enrollmentValue: string;
  startingPrice: number;
  tagline?: string;
  shortDescription: string;
  /** Full description paragraphs. */
  description: string[];
  /** "What you'll experience" — approach / methodology / journey. */
  experienceTitle?: string;
  experienceIntro?: string;
  experienceSteps?: ProgramJourneyStep[];
  experienceNote?: string;
  /** "What you'll get" checklist. */
  features: string[];
  plans?: ProgramPlan[];
  startDate?: string;
  schedule: string[];
  slots?: string[];
  /** Status note shown when a detailed schedule is not published yet. */
  status?: string;
  /** lucide-react icon name used by the UI layer. */
  icon: "BookOpen" | "Target" | "Compass" | "ListChecks";
}

export const INR = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export const PROGRAMS: Program[] = [
  {
    id: "full-course",
    title: "Full Course",
    enrollmentValue: "Full Course",
    startingPrice: 1699,
    tagline: "Don't study everything. Understand it.",
    shortDescription:
      "Structured, topic-wise geology courses built around how concepts connect.",
    description: [
      "Geology is a subject where topics are connected.",
      "A mineralogy concept appears in petrology. Petrology connects with tectonics. Stratigraphy tells a story through time.",
      "Our full courses are designed to help you see those connections instead of memorising isolated facts.",
    ],
    experienceTitle: "Learning approach",
    experienceIntro: "Learn → Connect → Apply → Solve → Revise",
    experienceNote:
      "We start with the concept, connect it to real geology, apply it to questions, work through PYQs and then bring everything together through revision.",
    features: [
      "Structured topic-wise classes",
      "Conceptual explanations",
      "Visual examples and geological diagrams",
      "GATE/CSIR-NET/GSI relevant PYQs",
      "Practice questions",
      "Revision material",
      "Tests and assessments",
      "A clear study roadmap",
      "Guidance on what to study and what not to waste time on",
    ],
    plans: [
      { gem: "Quartz", name: "Basic", price: 1699, badgeClass: "badge-quartz" },
      { gem: "Garnet", name: "Silver", price: 2699, badgeClass: "badge-garnet" },
      { gem: "Diamond", name: "Gold", price: 4999, badgeClass: "badge-diamond" },
    ],
    startDate: "21 September 2026",
    schedule: ["Every Wednesday and Thursday", "7:00 PM – 9:00 PM"],
    icon: "BookOpen",
  },
  {
    id: "masterclass",
    title: "One Topic Masterclass",
    enrollmentValue: "One Topic Masterclass",
    startingPrice: 599,
    tagline: "Stuck on one topic? Don't buy an entire course!",
    shortDescription:
      "One focused live session on the single topic that just won't click.",
    description: [
      "We've all been there. You understand 80% of a subject...and then there's that one chapter.",
      "Phase diagrams. Miller indices. Stereographic projections. Optical properties. Fossil identification.",
      "Whatever it is—you keep postponing it because it just doesn't click.",
      "That's exactly what our One-Topic Masterclasses are for.",
    ],
    experienceTitle: "Core concept",
    experienceIntro: "One session. One difficult topic. One clear goal.",
    experienceSteps: [
      { label: "No unnecessary syllabus", detail: "" },
      { label: "No hours of unrelated theory", detail: "" },
      { label: "Just the part the student needs to understand", detail: "" },
    ],
    features: [
      "Focused live session",
      "Short revision notes",
      "Selected PYQs",
      "Practice questions",
      "Quick-reference sheet",
    ],
    schedule: ["Every Friday", "7:00 PM – 9:00 PM"],
    status: "Masterclass schedule will be put up shortly.",
    icon: "Target",
  },
  {
    id: "career-guidance",
    title: "Career Guidance",
    enrollmentValue: "Career Guidance",
    startingPrice: 399,
    shortDescription:
      "A one-to-one session that turns career confusion into a realistic next step.",
    description: [
      "Maybe you want to do a PhD. Maybe you want a government job. Maybe you're fascinated by GIS. Maybe field geology is your thing. Maybe you're still figuring it out.",
      "That's okay.",
      "Our Career Guidance is designed to help you understand your options and turn that confusion into a realistic next step.",
    ],
    experienceTitle: "Career guidance journey",
    experienceSteps: [
      {
        label: "Where are you now?",
        detail: "Your degree, experience, interests and current situation",
      },
      {
        label: "Where could you go?",
        detail: "Explore career paths that actually make sense for you",
      },
      {
        label: "What does each path require?",
        detail: "Exams, degrees, skills, experience and realistic timelines",
      },
      {
        label: "What's your next move?",
        detail:
          "Leave with a practical action plan—not just a list of career options",
      },
    ],
    features: [
      "One-to-one career guidance session",
      "Realistic approach to career",
      "Resume review and guidance",
    ],
    schedule: ["Every Monday", "7:00 PM – 9:00 PM"],
    slots: ["7:00 – 7:30 PM", "7:30 – 8:00 PM", "8:00 – 8:30 PM", "8:30 – 9:00 PM"],
    status: "Four slots available every Monday.",
    icon: "Compass",
  },
  {
    id: "pyq-solving",
    title: "PYQ Solving",
    enrollmentValue: "PYQ Solving",
    startingPrice: 1299,
    shortDescription:
      "Solve Previous Year Questions together with a group of fellow aspirants.",
    description: [
      "Don't feel like solving PYQs alone? Join a group of fellow aspirants to solve and understand Previous Year Questions for all your entrance exam needs.",
    ],
    experienceTitle: "PYQ methodology",
    experienceSteps: [
      { label: "01 — Read", detail: "What is the question actually asking?" },
      {
        label: "02 — Recognise",
        detail: "Which concept is hiding behind it?",
      },
      {
        label: "03 — Eliminate",
        detail: "Can we remove options before calculating?",
      },
      { label: "04 — Solve", detail: "What's the shortest reliable approach?" },
      {
        label: "05 — Learn",
        detail: "What should you remember from this question?",
      },
    ],
    features: [
      "GATE/NET/GSI solutions",
      "Live sessions",
      "Tips and tricks to solve PYQs",
      "Understanding the patterns",
    ],
    schedule: ["Every Thursday", "7:00 PM – 9:00 PM"],
    status: "Schedule will be put up shortly.",
    icon: "ListChecks",
  },
];

export const getProgram = (id: string): Program | undefined =>
  PROGRAMS.find((p) => p.id === id);

export const getProgramByEnrollmentValue = (value: string): Program | undefined =>
  PROGRAMS.find((p) => p.enrollmentValue === value);

export const PROGRAM_OPTIONS = PROGRAMS.map((p) => p.enrollmentValue);

/** Plain-text rendering of a programme, used to seed the assistant knowledge. */
export function programToKnowledgeText(p: Program): string {
  const lines: string[] = [];
  lines.push(`${p.title} — starting at ${INR(p.startingPrice)}.`);
  if (p.tagline) lines.push(`Tagline: "${p.tagline}"`);
  lines.push(...p.description);
  if (p.experienceIntro) lines.push(`${p.experienceTitle}: ${p.experienceIntro}`);
  if (p.experienceNote) lines.push(p.experienceNote);
  if (p.experienceSteps?.length) {
    lines.push(
      ...p.experienceSteps.map((s) =>
        s.detail ? `${s.label} ${s.detail}` : s.label
      )
    );
  }
  lines.push(`What you'll get: ${p.features.join("; ")}.`);
  if (p.plans?.length) {
    lines.push(
      `Plans: ${p.plans
        .map((pl) => `${pl.name} — ${INR(pl.price)}`)
        .join(", ")}.`
    );
  }
  if (p.startDate) lines.push(`Course starts: ${p.startDate}.`);
  lines.push(`Schedule: ${p.schedule.join(", ")}.`);
  if (p.slots?.length) lines.push(`Available slots: ${p.slots.join(", ")}.`);
  if (p.status) lines.push(p.status);
  return lines.join("\n");
}
