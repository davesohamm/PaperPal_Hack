"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Settings,
  Type,
  AlignLeft,
  Hash,
  BookOpen,
  Layout,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";

interface FormState {
  paperTitle: string;
  citationStyle: string;
  fontFamily: string;
  fontSize: string;
  lineSpacing: string;
  margins: string;
  pageSize: string;
  columns: string;
  abstractRequired: boolean;
  keywordsRequired: boolean;
  sectionNumbering: string;
  referenceFormat: string;
  headerContent: string;
  footerContent: string;
  titleAlignment: string;
  figurePosition: string;
  tableStyle: string;
  customInstructions: string;
}

const defaultForm: FormState = {
  paperTitle: "",
  citationStyle: "numbered",
  fontFamily: "times",
  fontSize: "12",
  lineSpacing: "double",
  margins: "1inch",
  pageSize: "letter",
  columns: "single",
  abstractRequired: true,
  keywordsRequired: true,
  sectionNumbering: "roman",
  referenceFormat: "numbered",
  headerContent: "running-title",
  footerContent: "page-number",
  titleAlignment: "center",
  figurePosition: "inline",
  tableStyle: "bordered",
  customInstructions: "",
};

function SelectField({
  label,
  icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-medium text-ink-600 mb-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-paper-200 bg-white/80 py-3 pl-4 pr-10 text-sm text-ink-800 outline-none transition-all focus:border-accent/40 focus:ring-2 focus:ring-accent/10 cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300 pointer-events-none" />
      </div>
    </div>
  );
}

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-xl border border-paper-200/60 bg-white/60 p-4 cursor-pointer transition-colors hover:bg-white"
      onClick={() => onChange(!checked)}
    >
      <div>
        <p className="text-sm font-medium text-ink-700">{label}</p>
        <p className="text-xs text-ink-400 mt-0.5">{description}</p>
      </div>
      <div
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-paper-300"
        }`}
      >
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </div>
    </div>
  );
}

export default function CustomFormatPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(defaultForm);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    router.push(`/upload?format=custom`);
  };

  return (
    <main className="min-h-screen bg-paper-50">
      <Navbar />

      <div className="pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Link
              href="/formats"
              className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-ink-600 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to formats
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                <Settings className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="font-display text-3xl tracking-tight text-ink-900">
                  Custom Format
                </h1>
                <p className="text-sm text-ink-400">
                  Define every detail of your formatting style
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            {/* Typography Section */}
            <div className="rounded-2xl border border-paper-200/60 bg-white p-6 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-5">
                Typography
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Font Family"
                  icon={<Type className="h-3.5 w-3.5" />}
                  value={form.fontFamily}
                  onChange={(v) => update("fontFamily", v)}
                  options={[
                    { value: "times", label: "Times New Roman" },
                    { value: "arial", label: "Arial" },
                    { value: "palatino", label: "Palatino" },
                    { value: "computer-modern", label: "Computer Modern" },
                    { value: "garamond", label: "Garamond" },
                    { value: "helvetica", label: "Helvetica" },
                  ]}
                />
                <SelectField
                  label="Font Size"
                  icon={<Type className="h-3.5 w-3.5" />}
                  value={form.fontSize}
                  onChange={(v) => update("fontSize", v)}
                  options={[
                    { value: "10", label: "10pt" },
                    { value: "11", label: "11pt" },
                    { value: "12", label: "12pt" },
                    { value: "14", label: "14pt" },
                  ]}
                />
                <SelectField
                  label="Line Spacing"
                  icon={<AlignLeft className="h-3.5 w-3.5" />}
                  value={form.lineSpacing}
                  onChange={(v) => update("lineSpacing", v)}
                  options={[
                    { value: "single", label: "Single" },
                    { value: "1.5", label: "1.5 spacing" },
                    { value: "double", label: "Double" },
                  ]}
                />
                <SelectField
                  label="Title Alignment"
                  icon={<AlignLeft className="h-3.5 w-3.5" />}
                  value={form.titleAlignment}
                  onChange={(v) => update("titleAlignment", v)}
                  options={[
                    { value: "center", label: "Centered" },
                    { value: "left", label: "Left-aligned" },
                    { value: "flush-left", label: "Flush Left (no indent)" },
                  ]}
                />
              </div>
            </div>

            {/* Page Layout Section */}
            <div className="rounded-2xl border border-paper-200/60 bg-white p-6 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-5">
                Page Layout
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Page Size"
                  icon={<Layout className="h-3.5 w-3.5" />}
                  value={form.pageSize}
                  onChange={(v) => update("pageSize", v)}
                  options={[
                    { value: "letter", label: "US Letter (8.5 × 11)" },
                    { value: "a4", label: "A4 (210 × 297mm)" },
                  ]}
                />
                <SelectField
                  label="Margins"
                  icon={<Layout className="h-3.5 w-3.5" />}
                  value={form.margins}
                  onChange={(v) => update("margins", v)}
                  options={[
                    { value: "0.5inch", label: "0.5 inch" },
                    { value: "0.75inch", label: "0.75 inch" },
                    { value: "1inch", label: "1 inch" },
                    { value: "1.25inch", label: "1.25 inch" },
                  ]}
                />
                <SelectField
                  label="Columns"
                  icon={<Layout className="h-3.5 w-3.5" />}
                  value={form.columns}
                  onChange={(v) => update("columns", v)}
                  options={[
                    { value: "single", label: "Single column" },
                    { value: "double", label: "Two columns" },
                  ]}
                />
                <SelectField
                  label="Section Numbering"
                  icon={<Hash className="h-3.5 w-3.5" />}
                  value={form.sectionNumbering}
                  onChange={(v) => update("sectionNumbering", v)}
                  options={[
                    { value: "roman", label: "Roman (I, II, III)" },
                    { value: "arabic", label: "Arabic (1, 2, 3)" },
                    { value: "none", label: "No numbering" },
                  ]}
                />
              </div>
            </div>

            {/* Citations & References */}
            <div className="rounded-2xl border border-paper-200/60 bg-white p-6 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-5">
                Citations & References
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Citation Style"
                  icon={<BookOpen className="h-3.5 w-3.5" />}
                  value={form.citationStyle}
                  onChange={(v) => update("citationStyle", v)}
                  options={[
                    { value: "numbered", label: "Numbered [1]" },
                    { value: "superscript", label: "Superscript¹" },
                    { value: "author-date", label: "Author-Date (Smith, 2024)" },
                    { value: "author-page", label: "Author-Page (Smith 42)" },
                    { value: "footnote", label: "Footnotes" },
                  ]}
                />
                <SelectField
                  label="Reference Format"
                  icon={<BookOpen className="h-3.5 w-3.5" />}
                  value={form.referenceFormat}
                  onChange={(v) => update("referenceFormat", v)}
                  options={[
                    { value: "numbered", label: "Numbered list" },
                    { value: "alphabetical", label: "Alphabetical" },
                    { value: "chronological", label: "Chronological" },
                  ]}
                />
              </div>
            </div>

            {/* Header / Footer */}
            <div className="rounded-2xl border border-paper-200/60 bg-white p-6 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-5">
                Header & Footer
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Header Content"
                  icon={<Layout className="h-3.5 w-3.5" />}
                  value={form.headerContent}
                  onChange={(v) => update("headerContent", v)}
                  options={[
                    { value: "running-title", label: "Running title" },
                    { value: "author-name", label: "Author name" },
                    { value: "page-number", label: "Page number" },
                    { value: "none", label: "No header" },
                  ]}
                />
                <SelectField
                  label="Footer Content"
                  icon={<Layout className="h-3.5 w-3.5" />}
                  value={form.footerContent}
                  onChange={(v) => update("footerContent", v)}
                  options={[
                    { value: "page-number", label: "Page number" },
                    { value: "date", label: "Date" },
                    { value: "none", label: "No footer" },
                  ]}
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="rounded-2xl border border-paper-200/60 bg-white p-6 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-5">
                Sections
              </h3>
              <div className="space-y-3">
                <ToggleField
                  label="Abstract"
                  description="Include a structured abstract section"
                  checked={form.abstractRequired}
                  onChange={(v) => update("abstractRequired", v)}
                />
                <ToggleField
                  label="Keywords"
                  description="Include a keywords section after the abstract"
                  checked={form.keywordsRequired}
                  onChange={(v) => update("keywordsRequired", v)}
                />
              </div>
            </div>

            {/* Figures & Tables */}
            <div className="rounded-2xl border border-paper-200/60 bg-white p-6 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-5">
                Figures & Tables
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Figure Placement"
                  icon={<Layout className="h-3.5 w-3.5" />}
                  value={form.figurePosition}
                  onChange={(v) => update("figurePosition", v)}
                  options={[
                    { value: "inline", label: "Inline with text" },
                    { value: "top", label: "Top of page" },
                    { value: "bottom", label: "Bottom of page" },
                    { value: "end", label: "End of document" },
                  ]}
                />
                <SelectField
                  label="Table Style"
                  icon={<Layout className="h-3.5 w-3.5" />}
                  value={form.tableStyle}
                  onChange={(v) => update("tableStyle", v)}
                  options={[
                    { value: "bordered", label: "Full borders" },
                    { value: "booktabs", label: "Booktabs (top/bottom rules)" },
                    { value: "minimal", label: "Minimal (horizontal only)" },
                  ]}
                />
              </div>
            </div>

            {/* Custom Instructions */}
            <div className="rounded-2xl border border-paper-200/60 bg-white p-6 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-5">
                Additional Instructions
              </h3>
              <textarea
                value={form.customInstructions}
                onChange={(e) => update("customInstructions", e.target.value)}
                placeholder="Any other formatting rules or requirements not covered above..."
                rows={4}
                className="w-full rounded-xl border border-paper-200 bg-white/80 p-4 text-sm text-ink-800 placeholder:text-ink-300 outline-none transition-all focus:border-accent/40 focus:ring-2 focus:ring-accent/10 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between">
              <Link
                href="/formats"
                className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-700 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to formats
              </Link>
              <button
                onClick={handleSubmit}
                className="group flex items-center gap-2 rounded-full bg-ink-900 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-ink-800 hover:shadow-xl hover:shadow-ink-900/20 active:scale-[0.97]"
              >
                <Sparkles className="h-4 w-4" />
                Continue with Custom Format
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
