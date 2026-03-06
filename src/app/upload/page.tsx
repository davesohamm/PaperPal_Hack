"use client";

import { useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FolderUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { FORMAT_OPTIONS } from "@/lib/constants";

interface UploadedFile {
  id: string;
  file: File;
  type: "document" | "image";
  preview?: string;
}

interface ParsedDocument {
  text: string;
  sections: {
    title: string;
    abstract: string;
    body: string[];
    references: string;
  };
  fileName: string;
  fileSize: number;
  isTeX: boolean;
}

export default function UploadPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedFormat = searchParams.get("format") || "";
  const [selectedFormat, setSelectedFormat] = useState(preselectedFormat);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(preselectedFormat ? 2 : 1);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (incoming: FileList | null, type: "document" | "image") => {
      if (!incoming) return;
      const newFiles: UploadedFile[] = Array.from(incoming).map((file) => ({
        id: Math.random().toString(36).slice(2),
        file,
        type,
        preview:
          type === "image" ? URL.createObjectURL(file) : undefined,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    },
    []
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const hasDocument = files.some((f) => f.type === "document");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = e.dataTransfer.files;
      Array.from(droppedFiles).forEach((file) => {
        const isImage = file.type.startsWith("image/");
        const isDoc =
          file.name.endsWith(".docx") ||
          file.name.endsWith(".doc") ||
          file.name.endsWith(".tex") ||
          file.name.endsWith(".txt");
        if (isImage) addFiles(createFileList([file]), "image");
        else if (isDoc) addFiles(createFileList([file]), "document");
      });
    },
    [addFiles]
  );

  const handleConvert = async () => {
    const docFile = files.find((f) => f.type === "document");
    if (!docFile) return;

    setIsParsing(true);
    setParseError(null);

    try {
      const formData = new FormData();
      formData.append("file", docFile.file);

      const res = await fetch("/api/parse", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to parse document");
      }

      const parsed: ParsedDocument = await res.json();
      sessionStorage.setItem("paperpal_parsed", JSON.stringify(parsed));
      router.push(`/editor?format=${selectedFormat}`);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Failed to parse document");
      setIsParsing(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper-50">
      <Navbar />

      <div className="pt-28 pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
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

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              {[
                { n: 1, label: "Choose Format" },
                { n: 2, label: "Upload Files" },
                { n: 3, label: "Convert" },
              ].map((s, i) => (
                <div key={s.n} className="flex items-center gap-3">
                  {i > 0 && (
                    <div
                      className={`h-px w-8 transition-colors duration-300 ${
                        step >= s.n ? "bg-accent" : "bg-paper-200"
                      }`}
                    />
                  )}
                  <button
                    onClick={() => {
                      if (s.n === 1) setStep(1);
                      if (s.n === 2 && selectedFormat) setStep(2);
                      if (s.n === 3 && hasDocument && selectedFormat) setStep(3);
                    }}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
                      step === s.n
                        ? "bg-ink-900 text-white shadow-md"
                        : step > s.n
                          ? "bg-accent/10 text-accent"
                          : "bg-paper-100 text-ink-400"
                    }`}
                  >
                    {step > s.n ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <span>{s.n}</span>
                    )}
                    {s.label}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Step 1: Choose Format */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="font-display text-3xl md:text-4xl tracking-tight text-ink-900 mb-2">
                  Choose your target format
                </h1>
                <p className="text-ink-400 mb-8">
                  Select the citation and formatting style for your converted paper.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {FORMAT_OPTIONS.map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => {
                        setSelectedFormat(fmt.id);
                        setStep(2);
                      }}
                      className={`group relative flex flex-col items-center rounded-2xl border p-5 text-center transition-all duration-300 ${
                        selectedFormat === fmt.id
                          ? "border-transparent shadow-lg -translate-y-0.5"
                          : "border-paper-200/60 bg-white/60 hover:border-paper-300 hover:bg-white hover:shadow-md"
                      }`}
                      style={
                        selectedFormat === fmt.id
                          ? {
                              backgroundColor: `${fmt.color}08`,
                              borderColor: `${fmt.color}30`,
                              boxShadow: `0 15px 40px ${fmt.color}12`,
                            }
                          : undefined
                      }
                    >
                      <div
                        className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-colors"
                        style={{
                          backgroundColor: `${fmt.color}12`,
                          color: fmt.color,
                        }}
                      >
                        {fmt.name.charAt(0)}
                      </div>
                      <h3 className="text-sm font-semibold text-ink-800">
                        {fmt.name}
                      </h3>
                      <p className="mt-0.5 text-[10px] text-ink-400">
                        {fmt.description}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Upload Files */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="font-display text-3xl md:text-4xl tracking-tight text-ink-900 mb-2">
                  Upload your paper
                </h1>
                <p className="text-ink-400 mb-8">
                  Drop your source document (.docx or .tex) and any figures used
                  in the paper.
                </p>

                {/* Drag Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                    isDragging
                      ? "border-accent bg-accent/5 scale-[1.01]"
                      : "border-paper-300 bg-white/40 hover:border-paper-400 hover:bg-white/60"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                      className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-paper-100"
                    >
                      <FolderUp
                        className={`h-7 w-7 transition-colors ${isDragging ? "text-accent" : "text-ink-300"}`}
                      />
                    </motion.div>
                    <p className="text-sm font-medium text-ink-600 mb-1">
                      Drag and drop your files here
                    </p>
                    <p className="text-xs text-ink-400 mb-5">
                      Supports .docx, .tex, and image files (PNG, JPG)
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-full bg-ink-900 px-5 py-2.5 text-xs font-medium text-white transition-all hover:bg-ink-800 hover:shadow-lg active:scale-[0.97]"
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5" />
                          Choose Document
                        </span>
                      </button>
                      <button
                        onClick={() => imgInputRef.current?.click()}
                        className="rounded-full border border-ink-200 bg-white px-5 py-2.5 text-xs font-medium text-ink-700 transition-all hover:border-ink-300 hover:shadow-md active:scale-[0.97]"
                      >
                        <span className="flex items-center gap-2">
                          <ImageIcon className="h-3.5 w-3.5" />
                          Add Figures
                        </span>
                      </button>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx,.doc,.tex,.txt"
                    className="hidden"
                    onChange={(e) => {
                      addFiles(e.target.files, "document");
                      e.target.value = "";
                    }}
                  />
                  <input
                    ref={imgInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      addFiles(e.target.files, "image");
                      e.target.value = "";
                    }}
                  />
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-3">
                      Uploaded Files ({files.length})
                    </h3>
                    <AnimatePresence>
                      {files.map((f) => (
                        <motion.div
                          key={f.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-3 rounded-xl border border-paper-200/60 bg-white/80 px-4 py-3"
                        >
                          {f.type === "image" && f.preview ? (
                            <img
                              src={f.preview}
                              alt=""
                              className="h-8 w-8 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                              <FileText className="h-4 w-4 text-accent" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink-700 truncate">
                              {f.file.name}
                            </p>
                            <p className="text-[11px] text-ink-400">
                              {(f.file.size / 1024).toFixed(1)} KB ·{" "}
                              {f.type === "document" ? "Source" : "Figure"}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFile(f.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-paper-100 transition-colors"
                          >
                            <X className="h-3.5 w-3.5 text-ink-400" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-700 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Change format
                  </button>
                  <button
                    onClick={() => {
                      if (hasDocument) setStep(3);
                    }}
                    disabled={!hasDocument}
                    className={`group flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all ${
                      hasDocument
                        ? "bg-ink-900 text-white hover:bg-ink-800 hover:shadow-lg active:scale-[0.97]"
                        : "bg-paper-200 text-ink-400 cursor-not-allowed"
                    }`}
                  >
                    Continue
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirm & Convert */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="font-display text-3xl md:text-4xl tracking-tight text-ink-900 mb-2">
                  Ready to convert
                </h1>
                <p className="text-ink-400 mb-8">
                  Review your selection and start the conversion process.
                </p>

                <div className="rounded-3xl border border-paper-200/60 bg-white p-8 shadow-sm">
                  {/* Summary */}
                  <div className="space-y-5">
                    <div className="flex items-center justify-between pb-5 border-b border-paper-100">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-400">
                          Target Format
                        </p>
                        <p className="mt-1 font-display text-xl text-ink-900">
                          {FORMAT_OPTIONS.find((f) => f.id === selectedFormat)
                            ?.name || "—"}
                        </p>
                      </div>
                      <button
                        onClick={() => setStep(1)}
                        className="text-xs text-accent hover:text-accent-dark transition-colors"
                      >
                        Change
                      </button>
                    </div>

                    <div className="flex items-center justify-between pb-5 border-b border-paper-100">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-400">
                          Files
                        </p>
                        <p className="mt-1 text-sm text-ink-700">
                          {files.filter((f) => f.type === "document").length}{" "}
                          document
                          {files.filter((f) => f.type === "document").length !== 1 ? "s" : ""}
                          ,{" "}
                          {files.filter((f) => f.type === "image").length}{" "}
                          figure
                          {files.filter((f) => f.type === "image").length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => setStep(2)}
                        className="text-xs text-accent hover:text-accent-dark transition-colors"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-emerald-800">
                          AI-powered conversion
                        </p>
                        <p className="text-xs text-emerald-600 mt-0.5">
                          Your paper is processed by our AI pipeline and formatted into LaTeX.
                        </p>
                      </div>
                    </div>
                  </div>

                  {parseError && (
                    <div className="mt-4 flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 p-4">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Parsing failed</p>
                        <p className="text-xs text-red-600 mt-0.5">{parseError}</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleConvert}
                    disabled={isParsing}
                    className={`group mt-8 w-full flex items-center justify-center gap-3 rounded-full py-4 text-sm font-semibold text-white transition-all active:scale-[0.98] ${
                      isParsing
                        ? "bg-ink-600 cursor-wait"
                        : "bg-ink-900 hover:bg-ink-800 hover:shadow-2xl hover:shadow-ink-900/25"
                    }`}
                  >
                    {isParsing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Parsing document...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Start Conversion
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="mt-4 flex items-center gap-2 text-sm text-ink-500 hover:text-ink-700 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to files
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function createFileList(files: File[]): FileList {
  const dt = new DataTransfer();
  files.forEach((f) => dt.items.add(f));
  return dt.files;
}
