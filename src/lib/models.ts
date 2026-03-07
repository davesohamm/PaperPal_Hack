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

/* ── Format Definitions ── */

export interface FormatPromptConfig {
  formatId: string;
  formatName: string;
  documentClass: string;
  packages: string[];
  masterPrompt: string;
  preambleHints: string;
  citationStyle: string;
}

const FORMAT_PROMPTS: Record<string, FormatPromptConfig> = {
  apa: {
    formatId: "apa",
    formatName: "APA 7th Edition",
    documentClass: "\\documentclass[12pt]{article}",
    packages: [
      "geometry", "setspace", "times", "graphicx", "natbib", "fancyhdr",
      "titlesec", "indentfirst",
    ],
    preambleHints: `\\geometry{margin=1in}
\\doublespacing
\\pagestyle{fancy}
\\fancyhf{}
\\rhead{\\thepage}
\\titleformat{\\section}{\\normalfont\\bfseries\\centering}{}{0em}{}
\\titleformat{\\subsection}{\\normalfont\\bfseries}{}{0em}{}`,
    citationStyle: "author-date: (Smith, 2020) or Smith (2020). Add page for quotes: (Smith, 2020, p. 45).",
    masterPrompt: `The output must look like a real APA 7th Edition paper:
- 12pt Times New Roman, 1-inch margins on all sides, double spacing EVERYWHERE including references.
- Title page: title centered bold near top half, author name below, institutional affiliation below that. Page numbers top-right on every page.
- Title in bold Title Case, centered.
- Section headings: Level 1 = centered bold, Level 2 = left-aligned bold, Level 3 = left-aligned bold italic.
- Paragraphs left-aligned with 0.5-inch first line indent.
- In-text citations: author-date format (Smith, 2020) or narrative Smith (2020). Page numbers for direct quotes (Smith, 2020, p. 45).
- Formal, objective tone. Avoid first person unless necessary.
- References section titled "References" centered bold. Hanging indent. Alphabetical by surname.
- Reference format: Author, A. A. (Year). Article title in sentence case. \\textit{Journal Title in Title Case}, \\textit{volume}(issue), pages.
- Articles NOT italicized, journal names and volume numbers ARE italicized.
- Overall: minimalistic, consistent, clean, readable.`,
  },

  mla: {
    formatId: "mla",
    formatName: "MLA 9th Edition",
    documentClass: "\\documentclass[12pt]{article}",
    packages: [
      "geometry", "setspace", "times", "graphicx", "fancyhdr", "indentfirst",
    ],
    preambleHints: `\\geometry{margin=1in}
\\doublespacing
\\pagestyle{fancy}
\\fancyhf{}
\\rhead{\\thepage}`,
    citationStyle: "author-page: (Smith 45). No year in in-text citations.",
    masterPrompt: `The output must look like a real MLA 9th Edition paper:
- 12pt Times New Roman, double spacing, 1-inch margins, left-aligned text throughout.
- NO title page. First page starts with four-line header top-left: author name, instructor name, course title, date.
- Paper title centered below header in Title Case — NO bold, NO underline, NO italics unless required by the title itself.
- Page numbers top-right with author's last name (e.g. "Smith 1").
- Paragraphs indented 0.5 inches at first line.
- In-text citations: author-page format (Smith 45). NO year. NO comma between author and page.
- Long quotes formatted as block quotes indented 1 inch from margin.
- End page titled "Works Cited" centered. Entries: Last name, First name. "Article Title." \\textit{Journal Title}, vol., no., year, pp.
- Hanging indent, alphabetical order.
- Visually simple, readable, clean.`,
  },

  chicago: {
    formatId: "chicago",
    formatName: "Chicago Manual of Style",
    documentClass: "\\documentclass[12pt]{article}",
    packages: [
      "geometry", "setspace", "times", "graphicx", "fancyhdr",
      "indentfirst", "footmisc",
    ],
    preambleHints: `\\geometry{margin=1in}
\\doublespacing
\\pagestyle{fancy}
\\fancyhf{}
\\rhead{\\thepage}`,
    citationStyle: "footnotes with superscript numbers. Full citation in footnotes. Bibliography at end.",
    masterPrompt: `The output must look like a real Chicago Manual of Style paper:
- 12pt Times New Roman, double spacing, 1-inch margins.
- Title page: title centered, sometimes bold. Page numbers top-right or bottom-center.
- KEY FEATURE: superscript numbers in text corresponding to footnotes at page bottom (use \\footnote{}).
- Footnotes contain FULL citation: author, title, journal, volume, year, pages.
- Body text stays clean since citations go in footnotes, not parentheses.
- Long quotes as indented block quotes.
- Section headings permitted but not as strictly structured as APA.
- "Bibliography" at end, alphabetical by surname. Format: Last name, First name. "Article Title." \\textit{Journal Title} volume (Year): pages.
- Emphasizes scholarly authority, extensive footnote detail, traditional academic layout.`,
  },

  harvard: {
    formatId: "harvard",
    formatName: "Harvard Referencing",
    documentClass: "\\documentclass[12pt]{article}",
    packages: [
      "geometry", "setspace", "times", "graphicx", "natbib", "fancyhdr",
      "indentfirst",
    ],
    preambleHints: `\\geometry{margin=1in}
\\doublespacing
\\pagestyle{fancy}
\\fancyhf{}
\\rhead{\\thepage}`,
    citationStyle: "author-date WITHOUT comma: (Smith 2020). Page for quotes: (Smith 2020, p. 45).",
    masterPrompt: `The output must look like a real Harvard style paper:
- 12pt Times New Roman, double spacing, 1-inch margins. Page numbers top-right.
- Title page optional: title, author, institution, date. Title centered Title Case, usually bold.
- Section headings left-aligned, bold.
- Paragraphs indented first line, consistent spacing.
- In-text citations: author-date WITHOUT comma between author and year — (Smith 2020) NOT (Smith, 2020). Page numbers for quotes: (Smith 2020, p. 45).
- Analytical, evidence-based academic tone.
- "References" at end, alphabetical by surname. Hanging indent.
- Reference format: Surname, Initials. Year. Article title sentence case. \\textit{Journal Title}, volume(issue), pages.
- Similar to APA but less rigid in formatting rules and punctuation.`,
  },

  ieee: {
    formatId: "ieee",
    formatName: "IEEE Conference",
    documentClass: "\\documentclass[conference]{IEEEtran}",
    packages: [
      "amsmath", "amssymb", "amsfonts", "graphicx", "textcomp", "cite",
    ],
    preambleHints: "",
    citationStyle: "numbered square brackets [1], [2] in order of first appearance.",
    masterPrompt: `The output must look like a real IEEE conference/journal paper:
- TWO-COLUMN LAYOUT. Times New Roman or similar serif, 10-11pt, single spacing within paragraphs, slight spacing between sections. Narrow margins.
- First page: large centered title, author names, affiliations, sometimes emails below.
- Author blocks use \\IEEEauthorblockN{Name} and \\IEEEauthorblockA{Affiliation}.
- Section headings BOLD and NUMBERED with Roman numerals: I. INTRODUCTION, II. METHODOLOGY, III. RESULTS.
- Subsections labeled A., B., C. in bold italic.
- Figures and tables embedded within columns, labeled clearly.
- KEY FEATURE: numbered citations in square brackets [1], [2], [3] corresponding to numbered reference list at end, ordered by FIRST APPEARANCE in text.
- References: author initials then last name, "Article title," \\textit{Journal/Conference}, vol., no., pp., year.
- Emphasizes technical clarity, structured sections, efficient page space.`,
  },

  ama: {
    formatId: "ama",
    formatName: "AMA (American Medical Association)",
    documentClass: "\\documentclass[12pt]{article}",
    packages: [
      "geometry", "setspace", "times", "graphicx", "amsmath", "fancyhdr",
      "indentfirst",
    ],
    preambleHints: `\\geometry{margin=1in}
\\doublespacing
\\pagestyle{fancy}
\\fancyhf{}
\\rhead{\\thepage}`,
    citationStyle: "superscript numbers: text$^{1}$. References numbered by order of appearance.",
    masterPrompt: `The output must look like a real AMA (American Medical Association) paper:
- 11-12pt Times New Roman, double spacing, 1-inch margins.
- Title page: article title centered Title Case, author names, affiliations, corresponding author info.
- Sections: Abstract, Introduction, Methods, Results, Discussion — structured scientific sections.
- Standard paragraphs, left-aligned, clear spacing.
- KEY FEATURE: SUPERSCRIPT numeric citations — e.g. "Machine learning improves healthcare\\textsuperscript{1}". Use \\textsuperscript{N} for citations, NOT [N].
- Numbers correspond to reference list numbered by ORDER OF APPEARANCE, NOT alphabetical.
- Reference format: Author initials (no periods), article title, abbreviated journal name, year;volume(issue):pages.
- Reflects clinical/biomedical research structure, clarity, precision.`,
  },

  vancouver: {
    formatId: "vancouver",
    formatName: "Vancouver",
    documentClass: "\\documentclass[12pt]{article}",
    packages: [
      "geometry", "setspace", "times", "graphicx", "amsmath", "fancyhdr",
      "indentfirst",
    ],
    preambleHints: `\\geometry{margin=1in}
\\doublespacing
\\pagestyle{fancy}
\\fancyhf{}
\\rhead{\\thepage}`,
    citationStyle: "numbered in parentheses (1) or superscripts, by order of appearance.",
    masterPrompt: `The output must look like a real Vancouver style paper:
- 12pt Times New Roman, double spacing, 1-inch margins.
- Structured title page and abstract. Scientific sections: Introduction, Methods, Results, Discussion.
- Headings bold or clearly separated.
- Standard paragraph indentation and alignment.
- KEY FEATURE: numeric citations in parentheses (1) or sometimes superscripts. Numbers correspond to reference list ordered by FIRST APPEARANCE.
- Reference format: Surname Initials. Article title. Journal Name. Year;volume(issue):pages.
- Similar to AMA but journal names not always abbreviated.
- Highly structured, scientific, clinical-publication appearance.`,
  },

  acs: {
    formatId: "acs",
    formatName: "ACS (American Chemical Society)",
    documentClass: "\\documentclass[12pt]{article}",
    packages: [
      "geometry", "setspace", "times", "graphicx", "amsmath", "mhchem",
      "fancyhdr", "indentfirst",
    ],
    preambleHints: `\\geometry{margin=1in}
\\doublespacing
\\pagestyle{fancy}
\\fancyhf{}
\\rhead{\\thepage}`,
    citationStyle: "superscript numbers: text$^{1}$. References numbered by order of appearance.",
    masterPrompt: `The output must look like a real ACS (American Chemical Society) paper:
- 12pt Times New Roman or similar serif, double spacing for manuscripts, standard margins.
- Title centered at top, author names and affiliations below.
- Sections: Abstract, Introduction, Experimental Methods, Results, Discussion, Conclusion.
- Figures, chemical structures, tables, equations integrated throughout.
- KEY FEATURE: SUPERSCRIPT numeric citations — "Chemical modeling improved\\textsuperscript{1}". Use \\textsuperscript{N}.
- Reference list numbered by order of appearance.
- Reference format: Surname, Initials. Article title. \\textit{Abbrev. J. Name} \\textbf{Year}, volume, pages.
- Chemistry journals abbreviate titles per standard indexing.
- Include molecular diagrams and reaction schemes where relevant.`,
  },

  cse: {
    formatId: "cse",
    formatName: "CSE (Council of Science Editors)",
    documentClass: "\\documentclass[12pt]{article}",
    packages: [
      "geometry", "setspace", "times", "graphicx", "amsmath", "fancyhdr",
      "indentfirst",
    ],
    preambleHints: `\\geometry{margin=1in}
\\doublespacing
\\pagestyle{fancy}
\\fancyhf{}
\\rhead{\\thepage}`,
    citationStyle: "Name-Year: (Smith 2020) or Citation-Sequence: (1). References alphabetical or by appearance.",
    masterPrompt: `The output must look like a real CSE (Council of Science Editors) paper:
- 12pt Times New Roman, double spacing, 1-inch margins. Page numbers in header/footer.
- Title page, abstract, then structured sections: Introduction, Methods, Results, Discussion.
- Headings clearly labeled, bold or numbered.
- Consistent paragraph spacing, clear academic tone.
- CSE supports multiple systems: Name-Year (Smith 2020) or Citation-Sequence (1).
- Name-Year: references alphabetical. Citation-Sequence: references numbered by first appearance.
- Reference format: Surname Initials. Year. Article title. Journal Name. volume(issue):pages.
- Reflects biology/environmental science: scientific clarity, structured methodology, detailed references.`,
  },

  custom: {
    formatId: "custom",
    formatName: "Custom Format",
    documentClass: "\\documentclass[12pt]{article}",
    packages: ["geometry", "graphicx", "amsmath", "setspace", "times"],
    preambleHints: `\\geometry{margin=1in}
\\doublespacing`,
    citationStyle: "standard numbered or author-date as appropriate.",
    masterPrompt: `Generate a clean, standard academic paper with:
- 12pt Times New Roman, double spacing, 1-inch margins.
- Centered title, author, sections with clear headings.
- Standard paragraph formatting and citations.`,
  },
};

export function getFormatPromptConfig(
  formatId: string
): FormatPromptConfig {
  return FORMAT_PROMPTS[formatId] || FORMAT_PROMPTS.custom;
}

/* ── Grounding Rules ── */

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

/* ── Prompt Builders ── */

export function buildPreamblePrompt(config: FormatPromptConfig): string {
  return `You are generating a LaTeX preamble for a ${config.formatName} academic paper.

=== DESTINATION FORMAT DESCRIPTION ===
${config.masterPrompt}

=== LATEX STRUCTURE ===
Start with: ${config.documentClass}
Include packages: ${config.packages.join(", ")}
${config.preambleHints ? `Add these formatting commands after packages:\n${config.preambleHints}` : ""}

After \\begin{document}, include:
- \\title{<exact title from user text>}
- \\author{<exact author names from user text, or empty if none>}
- \\maketitle

Citation style for this format: ${config.citationStyle}

${GROUNDING_RULES}`;
}

export function buildSectionPrompt(
  config: FormatPromptConfig,
  chunkIndex: number,
  totalChunks: number
): string {
  return `You are converting source text into LaTeX body content for a ${config.formatName} academic paper.
This is chunk ${chunkIndex + 1} of ${totalChunks}.

=== DESTINATION FORMAT DESCRIPTION ===
${config.masterPrompt}

=== WHAT TO DO ===
- Convert the source text into LaTeX using the exact formatting conventions described above.
- Use \\section{}, \\subsection{}, \\subsubsection{} with the heading style specified for ${config.formatName}.
- Keep ALL original text content EXACTLY as-is — only wrap it in LaTeX formatting.
- Citation style: ${config.citationStyle}
- Convert inline citations to the correct format for this style.
- Convert math to LaTeX math mode.

=== WHAT NOT TO DO ===
- Do NOT output \\documentclass, \\usepackage, \\begin{document}, or \\end{document}.
- Do NOT generate references, bibliography, or \\bibitem entries.
- Do NOT add text not in the source. Do NOT repeat content from other chunks.
- Do NOT add \\maketitle or title/author commands.

${GROUNDING_RULES}`;
}

export function buildClosingPrompt(_config: FormatPromptConfig): string {
  return `DO NOT USE THIS PROMPT. References are handled by the system.`;
}

/* ── Reference Formatter (code-based, no LLM) ── */

export function formatReferencesAsTeX(referencesText: string): string {
  if (!referencesText || referencesText.trim().length === 0) {
    return "\\end{document}";
  }

  const lines = referencesText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const headerIndex = lines.findIndex((l) =>
    /^references$/i.test(l) || /^bibliography$/i.test(l) || /^works cited$/i.test(l)
  );
  const refLines = headerIndex >= 0 ? lines.slice(headerIndex + 1) : lines;

  if (refLines.length === 0) {
    return "\\end{document}";
  }

  const bibItems: string[] = [];
  let currentRef = "";
  let refCount = 0;

  for (const line of refLines) {
    const startsWithNumber =
      /^\[?\d+\]?\s/.test(line) || /^\(\d+\)\s/.test(line);

    if (startsWithNumber) {
      if (currentRef) {
        refCount++;
        const cleaned = currentRef
          .replace(/^\[?\d+\]?\s*/, "")
          .replace(/^\(\d+\)\s*/, "")
          .trim();
        bibItems.push(`\\bibitem{ref${refCount}} ${escapeTeX(cleaned)}`);
      }
      currentRef = line;
    } else {
      currentRef += " " + line;
    }
  }

  if (currentRef) {
    refCount++;
    const cleaned = currentRef
      .replace(/^\[?\d+\]?\s*/, "")
      .replace(/^\(\d+\)\s*/, "")
      .trim();
    bibItems.push(`\\bibitem{ref${refCount}} ${escapeTeX(cleaned)}`);
  }

  if (bibItems.length === 0) {
    refCount++;
    bibItems.push(
      `\\bibitem{ref${refCount}} ${escapeTeX(refLines.join(" "))}`
    );
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
