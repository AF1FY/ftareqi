"use client";

import { motion } from "motion/react";
import { BadgeCheck, Lock, Star, Headphones } from "lucide-react";
import { Reveal } from "./reveal";

const badges = [
  { icon: BadgeCheck, label: "Verified drivers", sub: "ID & document checks" },
  { icon: Lock, label: "Secure payments", sub: "Fully encrypted transactions" },
  { icon: Star, label: "Real reviews", sub: "From actual riders" },
  { icon: Headphones, label: "24/7 support", sub: "We're with you every trip" },
];

export function TrustSafety() {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-10 backdrop-blur-xl md:p-16">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-accent">Trust & safety</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, lineHeight: 1.3 }}>
            Your ride is in safe hands
          </h2>
          <p className="mt-4 text-muted-foreground" style={{ lineHeight: 1.8 }}>
            We build trust at every step — from driver verification to the moment you pay.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {badges.map((b, i) => (
            <Reveal key={b.label} delay={i * 0.1}>
              <motion.div
                className="animate-float flex flex-col items-center text-center"
                style={{ animationDelay: `${i * 0.6}s` }}
              >
                <span className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-border bg-secondary text-accent shadow-[0_0_30px_-12px_var(--accent)]">
                  <b.icon className="size-6" />
                </span>
                <span style={{ fontWeight: 600 }} className="mb-1">{b.label}</span>
                <span className="text-muted-foreground" style={{ fontSize: "0.9rem" }}>{b.sub}</span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
