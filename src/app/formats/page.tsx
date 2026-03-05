"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Brain,
  Landmark,
  HeartPulse,
  Microscope,
  Cpu,
  GraduationCap,
  FlaskConical,
  Leaf,
  Settings,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { FORMAT_OPTIONS } from "@/lib/constants";

const FORMAT_DETAILS: Record<
  string,
  { rules: string[]; fields: string[]; example: string }
> = {
  apa: {
    rules: [
      "Author-date in-text citations",
      "References list alphabetical",
      "Double-spaced, 1-inch margins",
      "Times New Roman 12pt or similar",
      "Running head on every page",
    ],
    fields: ["Psychology", "Education", "Social Sciences", "Nursing"],
    example:
      "(Smith & Jones, 2024, p. 42)",
  },
  mla: {
    rules: [
      "Author-page in-text citations",
      "Works Cited list at end",
      "Double-spaced throughout",
      "1-inch margins, header with last name",
      "Title centered, no bold",
    ],
    fields: ["Literature", "Cultural Studies", "Languages", "Philosophy"],
    example: '(Smith 42)',
  },
  chicago: {
    rules: [
      "Footnotes/endnotes or author-date",
      "Bibliography or References list",
      "Block quotes for 100+ words",
      "Subheadings in title case",
      "Page numbers in header or footer",
    ],
    fields: ["History", "Arts", "Publishing", "Business"],
    example: "Smith, John. Title. City: Publisher, 2024.",
  },
  ama: {
    rules: [
      "Superscript numbered citations",
      "References numbered in order of appearance",
      "Abbreviate journal names",
      "Structured abstract required",
      "SI units preferred",
    ],
    fields: ["Medicine", "Health Sciences", "Biology", "Pharmacology"],
    example: "Smith J, Jones B. Title. JAMA. 2024;331(1):42-48.",
  },
  vancouver: {
    rules: [
      "Sequential numbered references",
      "Numbers in parentheses or superscript",
      "Abbreviate journal titles",
      "Up to 6 authors, then et al.",
      "ICMJE-compliant format",
    ],
    fields: ["Biomedical", "Clinical", "Public Health", "Epidemiology"],
    example: "1. Smith J, Jones B. Title. BMJ. 2024;384:e073256.",
  },
  ieee: {
    rules: [
      "Two-column layout",
      "Numbered references in square brackets",
      "Conference paper title formatting",
      "Abstract under 200 words",
      "Keywords section after abstract",
    ],
    fields: [
      "Electrical Engineering",
      "Computer Science",
      "Signal Processing",
      "Robotics",
    ],
    example: '[1] J. Smith, "Title," in Proc. IEEE Conf., 2024.',
  },
  harvard: {
    rules: [
      "Author-date in-text citations",
      "Reference list alphabetical",
      "Sentence case for titles",
      "Include DOI where available",
      "Hanging indent for references",
    ],
    fields: ["Business", "Economics", "Sociology", "General Academic"],
    example: "Smith, J. (2024) Title. Journal, 12(3), pp. 42–48.",
  },
  acs: {
    rules: [
      "Superscript numbered or author-date",
      "Abbreviate journal titles (CAS style)",
      "Italic genus/species names",
      "Structured abstracts for research articles",
      "SI units and IUPAC nomenclature",
    ],
    fields: ["Chemistry", "Biochemistry", "Materials Science", "Polymers"],
    example: "Smith, J.; Jones, B. J. Am. Chem. Soc. 2024, 146, 1234.",
  },
  cse: {
    rules: [
      "Citation-sequence or name-year system",
      "References numbered or alphabetical",
      "Abbreviate journal titles",
      "No italics for species after first use",
      "Number-based cross-references",
    ],
    fields: ["Biology", "Earth Sciences", "Environmental Science", "Genetics"],
    example: "1. Smith J, Jones B. Title. Science. 2024;383:42–48.",
  },
  custom: {
    rules: [
      "You define citation style",
      "Custom margin and spacing rules",
      "Choose your font and size",
      "Define section ordering",
      "Set your own reference format",
    ],
    fields: ["Any Discipline", "Specific Journal", "Thesis", "Custom Template"],
    example: "Your rules, your format, your way.",
  },
};

const ICONS: Record<string, React.ReactNode> = {
  brain: <Brain className="h-6 w-6" />,
  "book-open": <BookOpen className="h-6 w-6" />,
  landmark: <Landmark className="h-6 w-6" />,
  "heart-pulse": <HeartPulse className="h-6 w-6" />,
  microscope: <Microscope className="h-6 w-6" />,
  cpu: <Cpu className="h-6 w-6" />,
  "graduation-cap": <GraduationCap className="h-6 w-6" />,
  "flask-conical": <FlaskConical className="h-6 w-6" />,
  leaf: <Leaf className="h-6 w-6" />,
  settings: <Settings className="h-6 w-6" />,
};

export default function FormatsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const activeFormat = FORMAT_OPTIONS.find((f) => f.id === selected);
  const activeDetails = selected ? FORMAT_DETAILS[selected] : null;

  return (
    <main className="min-h-screen bg-paper-50">
      <Navbar />

      <div className="pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-ink-600 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-14"
          >
            <h1 className="font-display text-4xl md:text-5xl tracking-tight text-ink-900">
              Citation Formats
            </h1>
            <p className="mt-3 text-ink-400 max-w-lg">
              Choose the formatting standard that matches your target journal or
              institution. Click any format to see its details and rules.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr,1.2fr] gap-8">
            {/* Format Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 auto-rows-min">
              {FORMAT_OPTIONS.map((fmt, i) => (
                <motion.button
                  key={fmt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.04 }}
                  onClick={() =>
                    setSelected(selected === fmt.id ? null : fmt.id)
                  }
                  className={`group relative flex flex-col items-start rounded-2xl border p-5 text-left transition-all duration-300 ${
                    selected === fmt.id
                      ? "border-transparent shadow-xl -translate-y-0.5"
                      : "border-paper-200/80 bg-white/60 hover:border-paper-300 hover:bg-white hover:shadow-md"
                  }`}
                  style={
                    selected === fmt.id
                      ? {
                          backgroundColor: `${fmt.color}08`,
                          borderColor: `${fmt.color}30`,
                          boxShadow: `0 20px 60px ${fmt.color}15`,
                        }
                      : undefined
                  }
                >
                  <div
                    className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300"
                    style={{
                      backgroundColor:
                        selected === fmt.id
                          ? `${fmt.color}18`
                          : `${fmt.color}0a`,
                      color: fmt.color,
                    }}
                  >
                    {ICONS[fmt.icon]}
                  </div>
                  <h3 className="font-semibold text-ink-800 text-sm">
                    {fmt.name}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-ink-400 leading-snug">
                    {fmt.fullName}
                  </p>

                  {selected === fmt.id && (
                    <motion.div
                      layoutId="selected-indicator"
                      className="absolute top-3 right-3"
                    >
                      <CheckCircle2
                        className="h-4 w-4"
                        style={{ color: fmt.color }}
                      />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <AnimatePresence mode="wait">
                {activeFormat && activeDetails ? (
                  <motion.div
                    key={activeFormat.id}
                    initial={{ opacity: 0, x: 20, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-3xl border border-paper-200/60 bg-white p-8 shadow-sm"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{
                          backgroundColor: `${activeFormat.color}12`,
                          color: activeFormat.color,
                        }}
                      >
                        {ICONS[activeFormat.icon]}
                      </div>
                      <div>
                        <h2 className="font-display text-2xl text-ink-900">
                          {activeFormat.name}
                        </h2>
                        <p className="text-sm text-ink-400">
                          {activeFormat.fullName}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-ink-500 mb-6">
                      {activeFormat.description}
                    </p>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-3">
                          Key Rules
                        </h4>
                        <ul className="space-y-2">
                          {activeDetails.rules.map((rule, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-sm text-ink-600"
                            >
                              <CheckCircle2
                                className="h-3.5 w-3.5 mt-0.5 shrink-0"
                                style={{ color: activeFormat.color }}
                              />
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-3">
                          Common Fields
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {activeDetails.fields.map((field) => (
                            <span
                              key={field}
                              className="rounded-full px-3 py-1 text-xs font-medium"
                              style={{
                                backgroundColor: `${activeFormat.color}0d`,
                                color: activeFormat.color,
                              }}
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-3">
                          Example Citation
                        </h4>
                        <div className="rounded-xl bg-paper-50 border border-paper-200/50 p-4">
                          <code className="text-sm font-mono text-ink-600">
                            {activeDetails.example}
                          </code>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={
                        activeFormat.id === "custom"
                          ? "/custom-format"
                          : `/upload?format=${activeFormat.id}`
                      }
                      className="group mt-8 flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition-all hover:shadow-lg active:scale-[0.97]"
                      style={{ backgroundColor: activeFormat.color }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {activeFormat.id === "custom"
                        ? "Configure Custom Format"
                        : `Convert to ${activeFormat.name}`}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-paper-200 p-16 text-center"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-paper-100">
                      <BookOpen className="h-7 w-7 text-ink-300" />
                    </div>
                    <h3 className="font-display text-xl text-ink-500">
                      Select a format
                    </h3>
                    <p className="mt-2 text-sm text-ink-300">
                      Click any format on the left to see its rules, fields, and
                      citation examples.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
