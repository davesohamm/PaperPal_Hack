"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type AuthMode = "signin" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const { signin, signup } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    let result: { success: boolean; error?: string };

    if (mode === "signup") {
      if (!formData.firstName || !formData.lastName) {
        setError("First name and last name are required");
        setIsLoading(false);
        return;
      }
      result = await signup(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );
    } else {
      result = await signin(formData.email, formData.password);
    }

    setIsLoading(false);

    if (result.success) {
      router.push("/upload");
    } else {
      setError(result.error || "Something went wrong");
    }
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
              Join researchers who save hours on formatting. Instant conversion
              to any citation style.
            </p>

            <div className="mt-10 space-y-3">
              {[
                "10 citation styles supported",
                "Multi-LLM AI pipeline",
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
                ? "Sign in to access your converted papers."
                : "Get started with free paper conversions."}
            </p>

            <div className="flex rounded-xl bg-paper-100 p-1 mb-8">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setError(null);
                  }}
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
                    key="name-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-ink-600 mb-1.5">
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300" />
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({ ...formData, firstName: e.target.value })
                            }
                            placeholder="Jane"
                            className="w-full rounded-xl border border-paper-200 bg-white/80 py-3.5 pl-11 pr-4 text-sm text-ink-800 placeholder:text-ink-300 outline-none transition-all focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-ink-600 mb-1.5">
                          Last Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300" />
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({ ...formData, lastName: e.target.value })
                            }
                            placeholder="Doe"
                            className="w-full rounded-xl border border-paper-200 bg-white/80 py-3.5 pl-11 pr-4 text-sm text-ink-800 placeholder:text-ink-300 outline-none transition-all focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
                          />
                        </div>
                      </div>
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
                    required
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
                    required
                    minLength={6}
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
                {mode === "signup" && (
                  <p className="text-xs text-ink-400 mt-1.5 ml-1">
                    Must be at least 6 characters
                  </p>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full flex items-center justify-center gap-2 rounded-full bg-ink-900 py-4 text-sm font-semibold text-white transition-all hover:bg-ink-800 hover:shadow-xl hover:shadow-ink-900/20 active:scale-[0.97] disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {mode === "signin" ? "Sign In" : "Create Account"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-ink-400">
              {mode === "signin" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                    }}
                    className="text-ink-700 font-medium hover:text-ink-900 transition-colors"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("signin");
                      setError(null);
                    }}
                    className="text-ink-700 font-medium hover:text-ink-900 transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>

            <p className="mt-6 text-center text-xs text-ink-400">
              By continuing, you agree to our{" "}
              <span className="text-ink-600 underline underline-offset-2">
                Terms
              </span>{" "}
              and{" "}
              <span className="text-ink-600 underline underline-offset-2">
                Privacy Policy
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
