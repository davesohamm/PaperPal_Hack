"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Zap,
  Eye,
  FileText,
  Sparkles,
  ArrowUpRight,
  Lock,
  Layers,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { FORMAT_OPTIONS } from "@/lib/constants";

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100vh] flex items-center overflow-hidden hero-gradient grain"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-accent/[0.06] to-transparent blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
          className="absolute top-1/2 -left-60 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-paper-300/20 to-transparent blur-3xl"
        />

        {/* Floating paper sheets */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-lg bg-white/60 shadow-sm border border-paper-200/30"
            style={{
              width: 60 + i * 20,
              height: 80 + i * 25,
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 25}%`,
              rotate: -10 + i * 8,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [-10 + i * 8, -5 + i * 8, -10 + i * 8],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <div className="p-2 space-y-1.5">
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className="h-1 rounded-full bg-paper-200/50"
                  style={{ width: `${60 + j * 10}%` }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-paper-200 px-4 py-1.5 text-xs font-medium text-ink-600 shadow-sm backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              100% Local AI — Your papers never leave your machine
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.95] tracking-tight text-ink-900"
          >
            Research papers,
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">perfectly</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-2 left-0 right-0 h-3 bg-accent/15 origin-left -z-0 rounded-sm"
              />
            </span>{" "}
            formatted.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-ink-500"
          >
            Upload your paper in Word or LaTeX, choose from 10 citation styles,
            and watch it transform into a publication-ready document — with
            live preview, like Overleaf.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/upload"
              className="group relative flex items-center gap-3 rounded-full bg-ink-900 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-ink-800 hover:shadow-2xl hover:shadow-ink-900/25 active:scale-[0.97]"
            >
              <Sparkles className="h-4 w-4" />
              Start Converting — Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-full shimmer" />
            </Link>
            <Link
              href="/formats"
              className="group flex items-center gap-2 rounded-full border border-ink-200 bg-white/60 px-7 py-4 text-sm font-medium text-ink-700 backdrop-blur-sm transition-all hover:border-ink-300 hover:bg-white hover:shadow-lg active:scale-[0.97]"
            >
              Browse Formats
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-14 flex items-center gap-8 text-xs text-ink-400"
          >
            <span className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              Fully private
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              No API limits
            </span>
            <span className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-blue-500" />
              Live preview
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "01",
      title: "Upload",
      desc: "Drop your .docx or .tex file alongside any figures",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      number: "02",
      title: "Choose Format",
      desc: "Select from 10 standards or create your own custom format",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      number: "03",
      title: "AI Transforms",
      desc: "Local LLM rewrites your LaTeX to match the target style",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      number: "04",
      title: "Preview & Export",
      desc: "Side-by-side view with download as PDF and .tex",
      icon: <Eye className="h-5 w-5" />,
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-white grain">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            How it works
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-ink-900">
            Four steps to perfection
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group relative"
            >
              <div className="relative rounded-2xl border border-paper-200/80 bg-paper-50/50 p-8 transition-all duration-500 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs text-ink-300">
                    {step.number}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper-100 text-ink-500 transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                    {step.icon}
                  </div>
                </div>
                <h3 className="font-display text-2xl text-ink-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-400">
                  {step.desc}
                </p>

                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 text-paper-300">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FormatsPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 hero-gradient grain overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Citation Styles
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-ink-900">
            Every major format, covered
          </h2>
          <p className="mt-4 mx-auto max-w-lg text-ink-400">
            From APA to IEEE and everything in between — or define your own
            custom formatting rules.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {FORMAT_OPTIONS.map((fmt, i) => (
            <motion.div
              key={fmt.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/upload?format=${fmt.id}`}
                className="group relative flex flex-col items-center rounded-2xl border border-paper-200/60 bg-white/70 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-transparent hover:shadow-xl hover:-translate-y-1"
                style={
                  {
                    "--card-color": fmt.color,
                  } as React.CSSProperties
                }
              >
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300"
                  style={{ backgroundColor: `${fmt.color}12` }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{ color: fmt.color }}
                  >
                    {fmt.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-ink-800">
                  {fmt.name}
                </h3>
                <p className="mt-1 text-[11px] leading-snug text-ink-400 line-clamp-2">
                  {fmt.description}
                </p>
                <div
                  className="absolute inset-x-0 bottom-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: fmt.color }}
                />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            href="/formats"
            className="group inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
          >
            Explore all formats in detail
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function PrivacySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Fully Local Processing",
      desc: "Your unpublished research never touches external servers. All AI processing runs on your machine.",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "No Token Limits",
      desc: "Process papers of any length without worrying about API quotas or rate limits.",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Zero Data Retention",
      desc: "Nothing is stored, logged, or transmitted. Your intellectual property stays yours.",
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-ink-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">
              Privacy First
            </span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-tight">
              Your research,
              <br />
              your machine.
            </h2>
            <p className="mt-6 text-lg text-ink-300 leading-relaxed">
              Unlike cloud-based tools, PaperPal uses a local LLM to process
              your documents. No data leaves your computer — ever.
            </p>
          </motion.div>

          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent-light">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                  <p className="text-sm text-ink-300 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: "10", label: "Citation Styles", suffix: "+" },
    { value: "0", label: "Data Sent to Cloud", suffix: "B" },
    { value: "100", label: "Local Processing", suffix: "%" },
    { value: "∞", label: "No Token Limits", suffix: "" },
  ];

  return (
    <section ref={ref} className="relative py-20 bg-paper-50 border-y border-paper-200/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-4xl md:text-5xl text-ink-900 tracking-tight">
                {stat.value}
                <span className="text-accent">{stat.suffix}</span>
              </div>
              <p className="mt-2 text-sm text-ink-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-32 bg-white grain">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-6xl tracking-tight text-ink-900">
            Ready to format
            <br />
            <span className="text-accent italic">effortlessly?</span>
          </h2>
          <p className="mt-6 mx-auto max-w-md text-ink-400">
            Stop wrestling with citation styles. Let PaperPal handle the
            formatting while you focus on the research.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/upload"
              className="group flex items-center gap-3 rounded-full bg-ink-900 px-10 py-4.5 text-sm font-semibold text-white transition-all hover:bg-ink-800 hover:shadow-2xl hover:shadow-ink-900/25 active:scale-[0.97]"
            >
              <FileText className="h-4 w-4" />
              Upload Your Paper
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-ink-400">
            {["No sign-up required to preview", "10 citation styles", "100% local AI"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-paper-200 bg-paper-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-white">
              <FileText className="h-4 w-4" />
            </div>
            <span className="font-display text-lg text-ink-900">PaperPal</span>
          </div>
          <p className="text-xs text-ink-400">
            Built for researchers, by researchers. Your papers never leave your
            machine.
          </p>
          <div className="flex gap-6 text-xs text-ink-400">
            <Link href="/formats" className="hover:text-ink-700 transition-colors">
              Formats
            </Link>
            <Link href="/upload" className="hover:text-ink-700 transition-colors">
              Convert
            </Link>
            <Link href="/auth" className="hover:text-ink-700 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ProcessSection />
      <StatsSection />
      <FormatsPreview />
      <PrivacySection />
      <CTASection />
      <Footer />
    </main>
  );
}
