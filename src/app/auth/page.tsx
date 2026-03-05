"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

type AuthMode = "signin" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen flex hero-gradient grain">
      {/* Left - Brand Panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-ink-900">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Floating papers background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-lg bg-white/[0.04] border border-white/[0.06]"
              style={{
                width: 50 + i * 15,
                height: 65 + i * 20,
                left: `${10 + (i * 13) % 80}%`,
                top: `${5 + (i * 17) % 85}%`,
                rotate: -20 + i * 12,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [-20 + i * 12, -15 + i * 12, -20 + i * 12],
              }}
              transition={{
                duration: 5 + i * 0.7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <span className="font-display text-xl text-white">PaperPal</span>
          </Link>

          <div>
            <h2 className="font-display text-4xl xl:text-5xl text-white leading-tight">
              Your research,
              <br />
              <span className="text-accent-light italic">beautifully</span>
              <br />
              formatted.
            </h2>
            <p className="mt-6 text-ink-300 max-w-sm leading-relaxed">
              Join thousands of researchers who save hours on formatting.
              Instant conversion to any citation style, with complete privacy.
            </p>

            <div className="mt-10 space-y-3">
              {[
                "10 citation styles supported",
                "100% local AI processing",
                "Live Overleaf-style preview",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-ink-300"
                >
                  <CheckCircle2 className="h-4 w-4 text-accent-light shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-ink-500">
            Built for researchers, by researchers.
          </p>
        </div>
      </div>

      {/* Right - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/"
              className="lg:hidden flex items-center gap-2 text-sm text-ink-400 hover:text-ink-600 transition-colors mb-8"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>

            <div className="lg:hidden flex items-center gap-2.5 mb-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-white">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <span className="font-display text-xl text-ink-900">
                PaperPal
              </span>
            </div>

            <h1 className="font-display text-3xl text-ink-900 mb-2">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-ink-400 mb-8">
              {mode === "signin"
                ? "Sign in to download your converted papers."
                : "Get started with free paper conversions."}
            </p>

            {/* Mode Toggle */}
            <div className="flex rounded-xl bg-paper-100 p-1 mb-8">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                    mode === m
                      ? "bg-white text-ink-900 shadow-sm"
                      : "text-ink-400 hover:text-ink-600"
                  }`}
                >
                  {m === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-xs font-medium text-ink-600 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Jane Doe"
                        className="w-full rounded-xl border border-paper-200 bg-white/80 py-3.5 pl-11 pr-4 text-sm text-ink-800 placeholder:text-ink-300 outline-none transition-all focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs font-medium text-ink-600 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="jane@university.edu"
                    className="w-full rounded-xl border border-paper-200 bg-white/80 py-3.5 pl-11 pr-4 text-sm text-ink-800 placeholder:text-ink-300 outline-none transition-all focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-paper-200 bg-white/80 py-3.5 pl-11 pr-11 text-sm text-ink-800 placeholder:text-ink-300 outline-none transition-all focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {mode === "signin" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-accent hover:text-accent-dark transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full flex items-center justify-center gap-2 rounded-full bg-ink-900 py-4 text-sm font-semibold text-white transition-all hover:bg-ink-800 hover:shadow-xl hover:shadow-ink-900/20 active:scale-[0.97] disabled:opacity-60"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <>
                    {mode === "signin" ? "Sign In" : "Create Account"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-paper-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-paper-50 px-4 text-xs text-ink-400">
                  or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-xl border border-paper-200 bg-white/60 py-3 text-sm font-medium text-ink-700 transition-all hover:bg-white hover:border-paper-300 hover:shadow-md active:scale-[0.97]">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl border border-paper-200 bg-white/60 py-3 text-sm font-medium text-ink-700 transition-all hover:bg-white hover:border-paper-300 hover:shadow-md active:scale-[0.97]">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>

            <p className="mt-8 text-center text-xs text-ink-400">
              By continuing, you agree to our{" "}
              <button className="text-ink-600 hover:text-ink-800 transition-colors underline underline-offset-2">
                Terms
              </button>{" "}
              and{" "}
              <button className="text-ink-600 hover:text-ink-800 transition-colors underline underline-offset-2">
                Privacy Policy
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
