"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center hero-gradient grain">
      <div className="text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-paper-100 border border-paper-200">
            <FileText className="h-9 w-9 text-ink-300" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-7xl text-ink-900 mb-4"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-2xl text-ink-500 mb-2"
        >
          Page not found
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-ink-400 mb-10 max-w-sm mx-auto"
        >
          The paper you&apos;re looking for seems to have been reformatted into
          a different location.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-ink-800 hover:shadow-lg active:scale-[0.97]"
          >
            <Home className="h-3.5 w-3.5" />
            Go Home
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
