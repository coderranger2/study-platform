import { Flashcard } from '../types';

export interface AiResponse {
  markdown: string;
  suggestedCards?: Omit<Flashcard, 'id' | 'deckId'>[];
  readingTimeMin?: number;
}

export async function askStudyBot(
  prompt: string,
  mode?: 'explain' | 'debug' | 'quiz' | 'outline' | 'socratic'
): Promise<AiResponse> {
  // Simulate retro modem/processing delay
  await new Promise((res) => setTimeout(res, 600));

  const lower = prompt.toLowerCase();

  if (mode === 'debug' || lower.includes('debug') || lower.includes('error') || lower.includes('bug')) {
    return {
      markdown: `### 🐞 Retro Debugger Analysis

I analyzed your code snippet! Here is what's happening:

\`\`\`typescript
// The Issue: Race condition or unhandled async state
async function fetchStudyNotes(id: string) {
  try {
    const res = await api.get(\`/notes/\${id}\`);
    // BUG FIX: Always verify res.data exists before mapping
    if (!res.data || !res.data.items) {
      return [];
    }
    return res.data.items.map((n: Note) => ({ ...n, synced: true }));
  } catch (err) {
    console.error("Failed to load notes:", err);
    return []; // Graceful fallback
  }
}
\`\`\`

**Key Takeaways:**
1. **Defensive Guards:** Ensure null-coalescing on nested JSON payload objects.
2. **Error Boundary:** Return fallback states rather than throwing uncaught rejection.
3. **Complexity:** Time $O(N)$, Space $O(N)$ where $N$ is count of items.`,
      suggestedCards: [
        {
          question: "How do you prevent uncaught async rejections in TypeScript?",
          answer: "Wrap in try/catch and return an explicit fallback or error result type.",
          hint: "Think about error boundary pattern",
          mastery: 0,
        },
        {
          question: "What is defensive null-checking in modern JS?",
          answer: "Using optional chaining (?.) and nullish coalescing (??) before property access.",
          hint: "Safe property traversal",
          mastery: 0,
        }
      ]
    };
  }

  if (mode === 'quiz' || lower.includes('quiz') || lower.includes('test me')) {
    return {
      markdown: `### 🧠 Pop Quiz Time!

Let's test your active recall:

**Question 1:** What is the primary difference between a Process and a Thread?
> *Hint:* Think about address spaces and memory sharing.

**Question 2:** In CSS, what does the 90s beveled border effect rely on?
> *Answer:* Dual highlights: \`border-top/left: #fff\` (light source) and \`border-bottom/right: #404040\` (drop shadow).

**Question 3:** What is the 20-20-20 rule in ergonomics?
> *Answer:* Every 20 minutes, look at something 20 feet away for 20 seconds.

*Click "Convert to Flashcards" below to add these straight to your study deck!*`,
      suggestedCards: [
        {
          question: "Process vs. Thread: Memory Space",
          answer: "Processes run in separate memory spaces; threads within the same process share memory and address space.",
          hint: "Shared vs. isolated memory",
          mastery: 0,
        },
        {
          question: "What creates the classic 90s OS 3D beveled button illusion?",
          answer: "Light border on top/left (#ffffff) and dark border on bottom/right (#404040) creates an illuminated raised surface.",
          hint: "Photometric lighting convention",
          mastery: 0,
        },
        {
          question: "What is the Ergonomic 20-20-20 Rule?",
          answer: "Every 20 minutes, focus eyes on an object 20 feet away for 20 seconds to prevent digital eye strain.",
          hint: "Optometry standard for screen fatigue",
          mastery: 0,
        }
      ]
    };
  }

  if (mode === 'explain' || lower.includes('eli5') || lower.includes('explain simply')) {
    return {
      markdown: `### 💡 Simple Breakdown (ELI5)

Imagine you are running a busy retro campus diner:

1. **The CPU is the Short-Order Cook**: Super fast, but can only flip one pancake at a time.
2. **RAM is the Countertop**: Right next to the cook! Everything being worked on right now sits here.
3. **Hard Drive / SSD is the Basement Storage**: Huge capacity, but walking downstairs to fetch a box takes way longer.
4. **Cache is the Cook's Toolbelt**: The spatula and salt shaker in hands. Zero fetch time.

> **Mnemonic Tip:** **C-R-D** (Countertop = RAM, Desk = L1 Cache, Deposit Basement = Disk).`,
      suggestedCards: [
        {
          question: "In the diner analogy, what represents RAM?",
          answer: "The kitchen countertop: fast, immediate access for currently active tasks, but cleared when closing.",
          hint: "Volatile fast workspace",
          mastery: 0,
        },
        {
          question: "Why is CPU Cache faster than main RAM?",
          answer: "Cache resides directly on the CPU silicon die, reducing physical transit latency to sub-nanoseconds.",
          hint: "Physical proximity to processing core",
          mastery: 0,
        }
      ]
    };
  }

  // General default answer
  return {
    markdown: `### 🎓 CampusOS 98 Study Partner

Great inquiry! Here is a structured breakdown:

- **Core Concept:** Active recall and spaced repetition form the biological basis of synaptic long-term potentiation.
- **Key Equation:** Ebbinghaus Retention Curve:
  $$R = e^{-\\frac{t}{S}}$$
  where $R$ is retention, $S$ is memory stability, and $t$ is elapsed time.
- **Actionable Step:** Break study periods into **50-minute deep sprints** followed by **10-minute sensory rest**.

Feel free to ask me to *Quiz you*, *Explain with an analogy*, or *Generate flashcards*!`,
    suggestedCards: [
      {
        question: "What is the Ebbinghaus Retention formula?",
        answer: "R = e^(-t/S), indicating exponential decay of retained memories without active review.",
        hint: "Exponential memory decay curve",
        mastery: 0,
      },
      {
        question: "What is Spaced Repetition?",
        answer: "A learning technique where reviews are spaced at increasing intervals right before memory decays.",
        hint: "Optimized review scheduling",
        mastery: 0,
      }
    ]
  };
}

export function generateSmartSummary(rawText: string): {
  title: string;
  summaryBullets: string[];
  keyTerms: { term: string; def: string }[];
  suggestedCards: Omit<Flashcard, 'id' | 'deckId'>[];
} {
  const words = rawText.split(/\s+/).filter(Boolean);
  const title = words.slice(0, 5).join(' ') || 'Study Notes Summary';

  return {
    title: `Executive Study Digest: ${title.slice(0, 28)}...`,
    summaryBullets: [
      "Core Mechanism: Primary operational principles and foundational definitions highlighted for rapid visual scanning.",
      "Architectural Trade-offs: Resource allocation balances latency, throughput, and cognitive load.",
      "Critical Path: Immediate milestones require structured decomposition and active recall cycles.",
      "Practical Implication: Applying spaced intervals optimizes retention efficiency by over 200% compared to cramming."
    ],
    keyTerms: [
      {
        term: "Spaced Repetition",
        def: "Reviewing material at exponentially expanding intervals to optimize long-term memory consolidation."
      },
      {
        term: "Cognitive Load",
        def: "The total amount of mental effort being used in the working memory during comprehension."
      },
      {
        term: "Bionic Fixation",
        def: "Bolding the initial letters of words to guide ocular saccades and increase reading speed."
      },
      {
        term: "Pomodoro Cadence",
        def: "Time-boxing deep focus into structured work bursts followed by cognitive decompression."
      }
    ],
    suggestedCards: [
      {
        question: "What does Bionic Reading enhance?",
        answer: "It bolds the first 2-3 letters of each word, letting the brain predict the rest and reducing ocular fatigue.",
        hint: "Ocular saccade guidance",
        mastery: 0,
      },
      {
        question: "What defines Cognitive Load Theory in EdTech?",
        answer: "Working memory has finite capacity; minimizing extraneous noise frees mental bandwidth for germane schema acquisition.",
        hint: "Working memory limits",
        mastery: 0,
      },
      {
        question: "What is the biological benefit of 5-10 minute Pomodoro breaks?",
        answer: "It allows the default mode network (DMN) to passively consolidate neural connections and reset dopamine levels.",
        hint: "Neural consolidation",
        mastery: 0,
      }
    ]
  };
}
