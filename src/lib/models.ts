export interface ModelConfig {
  id: string;
  name: string;
  maxNewTokens: number;
}

export const MODEL_TIERS: ModelConfig[] = [
  {
    id: "Qwen/Qwen2.5-Coder-32B-Instruct",
    name: "Qwen Coder 32B",
    maxNewTokens: 4096,
  },
  {
    id: "Qwen/Qwen2.5-72B-Instruct",
    name: "Qwen 72B",
    maxNewTokens: 4096,
  },
  {
    id: "meta-llama/Llama-3.3-70B-Instruct",
    name: "Llama 3.3 70B",
    maxNewTokens: 4096,
  },
  {
    id: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    name: "Mixtral 8x7B",
    maxNewTokens: 4096,
  },
  {
    id: "google/gemma-2-2b-it",
    name: "Gemma 2 2B",
    maxNewTokens: 4096,
  },
];

export interface FormatPromptConfig {
  formatId: string;
  formatName: string;
  documentClass: string;
  packages: string[];
  styleTips: string;
}

const FORMAT_PROMPTS: Record<string, FormatPromptConfig> = {
  ieee: {
    formatId: "ieee",
    formatName: "IEEE Conference",
    documentClass: "\\documentclass[conference]{IEEEtran}",
    packages: ["amsmath", "amssymb", "amsfonts", "graphicx", "textcomp", "cite"],
    styleTips:
      "Use \\section{}, \\subsection{}. Author blocks use \\IEEEauthorblockN and \\IEEEauthorblockA. Two-column layout. Numbered references with [N] style.",
  },
  apa: {
    formatId: "apa",
    formatName: "APA 7th Edition",
    documentClass: "\\documentclass[man]{apa7}",
    packages: ["amsmath", "graphicx", "natbib"],
    styleTips:
      "Use running head, author note. Citations use (Author, Year). Double-spaced, Times New Roman 12pt implied.",
  },
  mla: {
    formatId: "mla",
    formatName: "MLA 9th Edition",
    documentClass: "\\documentclass[12pt]{article}",
    packages: ["geometry", "setspace", "graphicx"],
    styleTips:
      "1-inch margins, double-spaced, Works Cited page. In-text: (Author Page). Header with last name and page number.",
  },
  chicago: {
    formatId: "chicago",
    formatName: "Chicago Manual of Style",
    documentClass: "\\documentclass[12pt]{article}",
    packages: ["geometry", "setspace", "graphicx", "natbib"],
    styleTips:
      "Footnotes/endnotes for citations. Bibliography at end. Title page with centered title.",
  },
  ama: {
    formatId: "ama",
    formatName: "AMA (American Medical Association)",
    documentClass: "\\documentclass[12pt]{article}",
    packages: ["geometry", "graphicx", "amsmath"],
    styleTips:
      "Superscript numbered references. Structured abstract (Objective, Methods, Results, Conclusions). References numbered in order of citation.",
  },
  vancouver: {
    formatId: "vancouver",
    formatName: "Vancouver",
    documentClass: "\\documentclass[12pt]{article}",
    packages: ["geometry", "graphicx", "amsmath"],
    styleTips:
      "Numbered references in order of appearance. Superscript or bracketed numbers. Abbreviate journal names.",
  },
  harvard: {
    formatId: "harvard",
    formatName: "Harvard Referencing",
    documentClass: "\\documentclass[12pt]{article}",
    packages: ["geometry", "graphicx", "natbib"],
    styleTips:
      "Author-date in-text citations: (Author Year). Reference list alphabetical. No footnotes for citations.",
  },
  acs: {
    formatId: "acs",
    formatName: "ACS (American Chemical Society)",
    documentClass: "\\documentclass{article}",
    packages: ["chemfig", "mhchem", "amsmath", "graphicx"],
    styleTips:
      "Superscript numbered references. Chemical formulas with mhchem. Structured sections typical of chemistry papers.",
  },
  cse: {
    formatId: "cse",
    formatName: "CSE (Council of Science Editors)",
    documentClass: "\\documentclass[12pt]{article}",
    packages: ["geometry", "graphicx", "amsmath"],
    styleTips:
      "Citation-sequence or name-year system. Number references in order of first citation. Scientific nomenclature in italics.",
  },
  custom: {
    formatId: "custom",
    formatName: "Custom Format",
    documentClass: "\\documentclass[12pt]{article}",
    packages: ["geometry", "graphicx", "amsmath"],
    styleTips: "Use standard LaTeX article class with common packages.",
  },
};

export function getFormatPromptConfig(
  formatId: string
): FormatPromptConfig {
  return FORMAT_PROMPTS[formatId] || FORMAT_PROMPTS.custom;
}

const GROUNDING_RULES = `
ABSOLUTE RULES — VIOLATION WILL PRODUCE GARBAGE OUTPUT:
1. Output ONLY valid LaTeX code. No explanations, no commentary, no markdown code fences.
2. NEVER invent, fabricate, or hallucinate ANY content — no fake authors, no fake references, no placeholder text.
3. NEVER add "Author, et al." or "Title of the paper" or "Journal Name Volume (Year): pages" or any template/placeholder text.
4. NEVER generate example references, sample data, or dummy entries.
5. If a piece of information is not in the source text, DO NOT include it at all. Just skip it.
6. Reproduce the source text EXACTLY — same words, same data, same meaning. Only change the formatting to LaTeX.
7. Your job is ONLY to convert formatting. You are a formatter, not a writer.
8. Do NOT repeat or duplicate content that already appeared in a previous section.`;

export function buildPreamblePrompt(config: FormatPromptConfig): string {
  return `Generate ONLY the LaTeX preamble for a ${config.formatName} paper.

Output must start with: ${config.documentClass}
Include these packages: ${config.packages.join(", ")}
Then \\begin{document}

Extract the title from the user text and put it in \\title{}.
Extract author names from the user text and put them in \\author{}. If no author is found, use \\author{}.
After \\begin{document}, include \\maketitle.

${config.styleTips}
${GROUNDING_RULES}`;
}

export function buildSectionPrompt(
  config: FormatPromptConfig,
  chunkIndex: number,
  totalChunks: number
): string {
  return `Convert the following source text (chunk ${chunkIndex + 1} of ${totalChunks}) into LaTeX body content for a ${config.formatName} paper.

WHAT TO DO:
- Convert the text into LaTeX using \\section{}, \\subsection{}, \\subsubsection{} as appropriate.
- Keep ALL original text content exactly as-is — just wrap it in LaTeX formatting.
- Convert any inline citations like [1], [2] etc. to \\cite{refN} format.
- Convert mathematical expressions to LaTeX math mode.

WHAT NOT TO DO:
- Do NOT output \\documentclass, \\usepackage, \\begin{document}, or \\end{document}.
- Do NOT generate any references or bibliography.
- Do NOT add any text that is not in the source.
- Do NOT repeat content from other chunks.

${config.styleTips}
${GROUNDING_RULES}`;
}

export function buildClosingPrompt(_config: FormatPromptConfig): string {
  return `DO NOT USE THIS PROMPT. References are handled by the system.`;
}

export function formatReferencesAsTeX(referencesText: string): string {
  if (!referencesText || referencesText.trim().length === 0) {
    return "\\end{document}";
  }

  const lines = referencesText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const headerIndex = lines.findIndex((l) =>
    /^references$/i.test(l) || /^bibliography$/i.test(l)
  );
  const refLines = headerIndex >= 0 ? lines.slice(headerIndex + 1) : lines;

  if (refLines.length === 0) {
    return "\\end{document}";
  }

  const bibItems: string[] = [];
  let currentRef = "";
  let refCount = 0;

  for (const line of refLines) {
    const startsWithNumber = /^\[?\d+\]?\s/.test(line) || /^\(\d+\)\s/.test(line);

    if (startsWithNumber) {
      if (currentRef) {
        refCount++;
        const cleaned = currentRef.replace(/^\[?\d+\]?\s*/, "").replace(/^\(\d+\)\s*/, "").trim();
        bibItems.push(`\\bibitem{ref${refCount}} ${escapeTeX(cleaned)}`);
      }
      currentRef = line;
    } else {
      currentRef += " " + line;
    }
  }

  if (currentRef) {
    refCount++;
    const cleaned = currentRef.replace(/^\[?\d+\]?\s*/, "").replace(/^\(\d+\)\s*/, "").trim();
    bibItems.push(`\\bibitem{ref${refCount}} ${escapeTeX(cleaned)}`);
  }

  if (bibItems.length === 0) {
    refCount++;
    bibItems.push(`\\bibitem{ref${refCount}} ${escapeTeX(refLines.join(" "))}`);
  }

  return `\n\\begin{thebibliography}{${bibItems.length}}
${bibItems.join("\n\n")}
\\end{thebibliography}

\\end{document}`;
}

function escapeTeX(text: string): string {
  return text
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_");
}
