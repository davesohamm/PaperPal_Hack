"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Menu,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/formats", label: "Formats" },
    { href: "/upload", label: "Convert" },
    { href: "/editor", label: "Editor" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-ink-100/50 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-white transition-transform duration-300 group-hover:scale-110">
                <FileText className="h-4.5 w-4.5" />
                <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent border-2 border-paper-50" />
              </div>
              <span className="font-display text-xl tracking-tight text-ink-900">
                PaperPal
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-ink-500 transition-colors hover:text-ink-800 group"
                >
                  {link.label}
                  <span className="absolute bottom-0.5 left-4 right-4 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth"
                className="text-sm font-medium text-ink-500 hover:text-ink-800 transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/upload"
                className="group flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-ink-800 hover:shadow-lg hover:shadow-ink-900/20 active:scale-[0.97]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Start Converting
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg hover:bg-ink-100 transition-colors"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 glass border-b border-ink-100/50 md:hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-ink-600 hover:bg-ink-50 hover:text-ink-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-ink-100 mt-3">
                <Link
                  href="/upload"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-sm font-medium text-white"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Start Converting
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
