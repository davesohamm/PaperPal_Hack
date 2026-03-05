"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  ChevronDown,
  Eye,
  Code,
  Columns2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Loader2,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Copy,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { FORMAT_OPTIONS } from "@/lib/constants";

const SAMPLE_TEX = `\\documentclass[conference]{IEEEtran}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{graphicx}
\\usepackage{textcomp}

\\begin{document}

\\title{Attention-Based Neural Architecture for\\\\
Multi-Modal Document Understanding}

\\author{
  \\IEEEauthorblockN{Jane Smith}
  \\IEEEauthorblockA{Department of Computer Science\\\\
  Stanford University\\\\
  Stanford, CA 94305\\\\
  jane.smith@stanford.edu}
  \\and
  \\IEEEauthorblockN{John Doe}
  \\IEEEauthorblockA{Research Lab\\\\
  Google DeepMind\\\\
  Mountain View, CA\\\\
  john.doe@deepmind.com}
}

\\maketitle

\\begin{abstract}
We present a novel attention-based architecture for 
multi-modal document understanding that achieves 
state-of-the-art results on three benchmark datasets.
Our approach combines visual features from document
images with textual features using a cross-attention
mechanism, enabling the model to jointly reason about
layout and content. Experiments demonstrate a 4.2\\%
improvement over previous methods on DocVQA.
\\end{abstract}

\\begin{IEEEkeywords}
document understanding, attention mechanism, 
multi-modal learning, neural networks
\\end{IEEEkeywords}

\\section{Introduction}

Document understanding is a fundamental task in 
natural language processing that requires models
to comprehend both textual content and visual
layout information \\cite{smith2024}. Recent advances
in transformer architectures have shown promise,
but challenges remain in handling diverse document
formats and complex layouts.

\\section{Methodology}

\\subsection{Cross-Attention Mechanism}

Our model employs a cross-attention layer that
enables information flow between visual and 
textual representations:

\\begin{equation}
  \\text{Attn}(Q, K, V) = 
  \\text{softmax}\\left(
    \\frac{QK^T}{\\sqrt{d_k}}
  \\right)V
\\end{equation}

where $Q$ represents query vectors from the text
encoder, and $K$, $V$ are derived from the visual
feature extractor.

\\section{Results}

Our method achieves the following performance on
standard benchmarks:

\\begin{table}[h]
\\centering
\\caption{Performance Comparison}
\\begin{tabular}{lcc}
\\hline
Method & DocVQA & InfographicsVQA \\\\
\\hline
Baseline & 78.3 & 42.1 \\\\
LayoutLM & 82.1 & 45.6 \\\\
\\textbf{Ours} & \\textbf{86.3} & \\textbf{49.8} \\\\
\\hline
\\end{tabular}
\\end{table}

\\section{Conclusion}

We introduced a cross-attention architecture for
multi-modal document understanding. Future work
will explore scaling to longer documents and
additional modalities.

\\bibliographystyle{IEEEtran}
\\bibliography{refs}

\\end{document}`;

export default function EditorPage() {
  const searchParams = useSearchParams();
  const formatId = searchParams.get("format") || "ieee";
  const format = FORMAT_OPTIONS.find((f) => f.id === formatId) || FORMAT_OPTIONS[5];

  const [viewMode, setViewMode] = useState<"split" | "code" | "preview">("split");
  const [zoom, setZoom] = useState(100);
  const [isConverting, setIsConverting] = useState(true);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [texCode, setTexCode] = useState("");
  const [showDownloadAuth, setShowDownloadAuth] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const steps = [
      { progress: 15, delay: 400 },
      { progress: 35, delay: 900 },
      { progress: 55, delay: 1500 },
      { progress: 75, delay: 2200 },
      { progress: 90, delay: 2800 },
      { progress: 100, delay: 3500 },
    ];

    steps.forEach(({ progress, delay }) => {
      setTimeout(() => setConversionProgress(progress), delay);
    });

    const timer = setTimeout(() => {
      setIsConverting(false);
      setTexCode(SAMPLE_TEX);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(texCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setShowDownloadAuth(true);
  };

  return (
    <main className="h-screen flex flex-col bg-paper-50 overflow-hidden">
      <Navbar />

      {/* Editor Toolbar */}
      <div className="flex-shrink-0 mt-16 border-b border-paper-200/60 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <Link
              href="/upload"
              className="flex items-center gap-1.5 text-xs text-ink-400 hover:text-ink-600 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back
            </Link>

            <div className="h-4 w-px bg-paper-200" />

            <div className="flex items-center gap-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold"
                style={{
                  backgroundColor: `${format.color}15`,
                  color: format.color,
                }}
              >
                {format.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-ink-700">
                {format.name} Format
              </span>
            </div>

            <div className="h-4 w-px bg-paper-200" />

            {!isConverting && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
                Converted
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg bg-paper-100 p-0.5">
              {[
                { mode: "code" as const, icon: <Code className="h-3.5 w-3.5" />, label: "Code" },
                { mode: "split" as const, icon: <Columns2 className="h-3.5 w-3.5" />, label: "Split" },
                { mode: "preview" as const, icon: <Eye className="h-3.5 w-3.5" />, label: "Preview" },
              ].map((v) => (
                <button
                  key={v.mode}
                  onClick={() => setViewMode(v.mode)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    viewMode === v.mode
                      ? "bg-white text-ink-800 shadow-sm"
                      : "text-ink-400 hover:text-ink-600"
                  }`}
                >
                  {v.icon}
                  <span className="hidden sm:inline">{v.label}</span>
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-paper-200" />

            {/* Zoom */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-paper-100 transition-colors"
              >
                <ZoomOut className="h-3.5 w-3.5 text-ink-400" />
              </button>
              <span className="text-xs text-ink-500 w-8 text-center tabular-nums">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 10))}
                className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-paper-100 transition-colors"
              >
                <ZoomIn className="h-3.5 w-3.5 text-ink-400" />
              </button>
            </div>

            <div className="h-4 w-px bg-paper-200" />

            <button
              onClick={handleDownload}
              className="group flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-xs font-medium text-white transition-all hover:bg-ink-800 hover:shadow-lg active:scale-[0.97]"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Converting Overlay */}
        <AnimatePresence>
          {isConverting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-paper-50/90 backdrop-blur-sm mt-[105px]"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center gap-6 rounded-3xl border border-paper-200/60 bg-white p-12 shadow-xl"
              >
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                    <Sparkles className="h-7 w-7 text-accent" />
                  </div>
                  <motion.div
                    className="absolute -inset-2 rounded-2xl border-2 border-accent/20"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-display text-xl text-ink-900 mb-1">
                    Converting your paper
                  </h3>
                  <p className="text-sm text-ink-400">
                    AI is reformatting to {format.name} style...
                  </p>
                </div>
                <div className="w-64">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-ink-400">Progress</span>
                    <span className="text-xs font-mono text-ink-500">
                      {conversionProgress}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-paper-200 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${conversionProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Code Panel */}
        {(viewMode === "code" || viewMode === "split") && (
          <div
            className={`flex flex-col border-r border-paper-200/60 bg-white ${
              viewMode === "split" ? "w-1/2" : "w-full"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-paper-100 bg-paper-50/50">
              <div className="flex items-center gap-2">
                <Code className="h-3.5 w-3.5 text-ink-400" />
                <span className="text-xs font-medium text-ink-600">
                  output.tex
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-ink-400 hover:text-ink-600 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="flex-1 overflow-auto custom-scroll">
              <div className="flex">
                {/* Line numbers */}
                <div className="flex-shrink-0 py-4 px-3 text-right select-none border-r border-paper-100">
                  {texCode.split("\n").map((_, i) => (
                    <div
                      key={i}
                      className="text-[11px] leading-[1.7] font-mono text-ink-300"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <textarea
                  ref={textareaRef}
                  value={texCode}
                  onChange={(e) => setTexCode(e.target.value)}
                  spellCheck={false}
                  className="flex-1 resize-none border-0 bg-transparent p-4 font-mono text-[12px] leading-[1.7] text-ink-700 outline-none"
                  style={{ minHeight: "100%", tabSize: 2 }}
                />
              </div>
            </div>
          </div>
        )}

        {/* PDF Preview Panel */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={`flex flex-col bg-ink-100 ${
              viewMode === "split" ? "w-1/2" : "w-full"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-paper-200/60 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Eye className="h-3.5 w-3.5 text-ink-400" />
                <span className="text-xs font-medium text-ink-600">
                  Preview
                </span>
              </div>
              <button
                onClick={() => setZoom(100)}
                className="flex items-center gap-1.5 text-xs text-ink-400 hover:text-ink-600 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset zoom
              </button>
            </div>
            <div className="flex-1 overflow-auto custom-scroll p-8 flex justify-center">
              <div
                className="bg-white rounded-sm shadow-2xl shadow-ink-900/10 transition-transform origin-top"
                style={{
                  transform: `scale(${zoom / 100})`,
                  width: "8.5in",
                  minHeight: "11in",
                  padding: "1in",
                }}
              >
                {/* Simulated PDF Render */}
                <div className="space-y-6" style={{ fontFamily: "Times New Roman, serif" }}>
                  <div className="text-center space-y-4">
                    <h1 className="text-[18px] font-bold leading-tight">
                      Attention-Based Neural Architecture for
                      <br />
                      Multi-Modal Document Understanding
                    </h1>
                    <div className="flex justify-center gap-12 text-[10px]">
                      <div className="text-center">
                        <p className="font-semibold">Jane Smith</p>
                        <p className="text-ink-500">
                          Department of Computer Science
                          <br />
                          Stanford University
                          <br />
                          Stanford, CA 94305
                          <br />
                          jane.smith@stanford.edu
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">John Doe</p>
                        <p className="text-ink-500">
                          Research Lab
                          <br />
                          Google DeepMind
                          <br />
                          Mountain View, CA
                          <br />
                          john.doe@deepmind.com
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold italic mb-1">
                      Abstract—
                      <span className="font-normal">
                        We present a novel attention-based architecture for
                        multi-modal document understanding that achieves
                        state-of-the-art results on three benchmark datasets. Our
                        approach combines visual features from document images with
                        textual features using a cross-attention mechanism, enabling
                        the model to jointly reason about layout and content.
                        Experiments demonstrate a 4.2% improvement over previous
                        methods on DocVQA.
                      </span>
                    </p>
                    <p className="text-[9px] mt-2">
                      <span className="font-bold italic">Index Terms—</span>
                      <span className="font-normal italic">
                        document understanding, attention mechanism, multi-modal
                        learning, neural networks
                      </span>
                    </p>
                  </div>

                  <div className="columns-2 gap-6 text-[9px] leading-relaxed space-y-4">
                    <div>
                      <h2 className="text-[10px] font-bold text-center mb-2">
                        I. INTRODUCTION
                      </h2>
                      <p className="text-justify indent-4">
                        Document understanding is a fundamental task in natural
                        language processing that requires models to comprehend both
                        textual content and visual layout information [1]. Recent
                        advances in transformer architectures have shown promise, but
                        challenges remain in handling diverse document formats and
                        complex layouts.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-[10px] font-bold text-center mb-2">
                        II. METHODOLOGY
                      </h2>
                      <h3 className="text-[9px] font-bold italic mb-1">
                        A. Cross-Attention Mechanism
                      </h3>
                      <p className="text-justify indent-4">
                        Our model employs a cross-attention layer that enables
                        information flow between visual and textual representations:
                      </p>
                      <div className="my-3 text-center text-[10px] font-serif italic">
                        Attn(Q, K, V) = softmax(QK<sup>T</sup>/√d<sub>k</sub>)V
                      </div>
                      <p className="text-justify">
                        where Q represents query vectors from the text encoder, and K,
                        V are derived from the visual feature extractor.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-[10px] font-bold text-center mb-2">
                        III. RESULTS
                      </h2>
                      <p className="text-justify indent-4 mb-3">
                        Our method achieves the following performance on standard
                        benchmarks:
                      </p>
                      <div className="border border-ink-200 text-center mb-2">
                        <p className="text-[8px] font-bold py-1 border-b border-ink-200">
                          TABLE I: Performance Comparison
                        </p>
                        <table className="w-full text-[8px]">
                          <thead>
                            <tr className="border-b border-ink-200">
                              <th className="py-1 px-2 text-left font-bold">
                                Method
                              </th>
                              <th className="py-1 px-2 font-bold">DocVQA</th>
                              <th className="py-1 px-2 font-bold">
                                InfoVQA
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-ink-100">
                              <td className="py-1 px-2 text-left">
                                Baseline
                              </td>
                              <td className="py-1 px-2">78.3</td>
                              <td className="py-1 px-2">42.1</td>
                            </tr>
                            <tr className="border-b border-ink-100">
                              <td className="py-1 px-2 text-left">
                                LayoutLM
                              </td>
                              <td className="py-1 px-2">82.1</td>
                              <td className="py-1 px-2">45.6</td>
                            </tr>
                            <tr>
                              <td className="py-1 px-2 text-left font-bold">
                                Ours
                              </td>
                              <td className="py-1 px-2 font-bold">86.3</td>
                              <td className="py-1 px-2 font-bold">49.8</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-[10px] font-bold text-center mb-2">
                        IV. CONCLUSION
                      </h2>
                      <p className="text-justify indent-4">
                        We introduced a cross-attention architecture for multi-modal
                        document understanding. Future work will explore scaling to
                        longer documents and additional modalities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Download Auth Modal */}
      <AnimatePresence>
        {showDownloadAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-sm p-4"
            onClick={() => setShowDownloadAuth(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                  <Lock className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display text-2xl text-ink-900 mb-2">
                  Sign in to download
                </h3>
                <p className="text-sm text-ink-400 mb-6">
                  Create a free account to download your converted paper as PDF
                  and .tex files.
                </p>
                <Link
                  href="/auth"
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-ink-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-ink-800 active:scale-[0.97]"
                >
                  Sign in or Create Account
                </Link>
                <button
                  onClick={() => setShowDownloadAuth(false)}
                  className="mt-3 text-xs text-ink-400 hover:text-ink-600 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
