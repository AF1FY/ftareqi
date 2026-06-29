"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center px-6 text-center">
      <motion.span
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-muted-foreground backdrop-blur-md"
      >
        <span className="inline-block size-1.5 rounded-full bg-dodger-blue" />
        Shared rides, beautifully simple
      </motion.span>

      <h1 className="mx-auto max-w-[18ch] text-balance leading-[1.15]" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 800 }}>
        <motion.span
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="block"
        >
          Share the Ride.
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.25 }}
          className="block"
        >
          Split the{" "}
          <span className="glow-dodger-blue bg-linear-to-r from-dodger-blue to-dodger-blue/60 bg-clip-text text-transparent">
            Cost
          </span>
        </motion.span>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.45 }}
        className="mt-7 max-w-[46ch] text-balance text-muted-foreground"
        style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.8 }}
      >
        Match with trusted drivers heading your way. Save money, skip the
        crowds, and travel in total comfort.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.6 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        <Link
          href="/register"
          className="group flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-primary-foreground transition-all duration-300 hover:shadow-[0_0_36px_rgba(255,255,255,0.3)]"
        >
          Get started now
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-border bg-card px-7 py-3.5 text-foreground backdrop-blur-md transition-colors duration-300 hover:border-white/20"
        >
          Already have an account? Log in
        </Link>
      </motion.div>
    </section>
  );
}
