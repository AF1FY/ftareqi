"use client";

import { motion } from "motion/react";
import { Wallet, Sofa, ShieldCheck } from "lucide-react";
import { Reveal } from "./reveal";

const items = [
  {
    icon: Wallet,
    title: "Save on every trip",
    desc: "Split fuel and toll costs with fellow riders and cut up to 70% off your daily commute.",
  },
  {
    icon: Sofa,
    title: "Comfort, no crowds",
    desc: "A seat that's all yours — none of the cramped carriages or endless stops of public transit.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable every time",
    desc: "Verified drivers, punctual pickups, and honest reviews from riders who took the same route.",
  },
];

export function ValueProps() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal className="mx-auto mb-16 max-w-2xl text-center">
        <p className="mb-3 text-accent">Why Ftareqi?</p>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, lineHeight: 1.3 }}>
          Smarter travel, built for passengers
        </h2>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.12}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-8 backdrop-blur-xl"
            >
              {/* glow behind card on hover */}
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: "0 0 60px -10px rgba(59,130,246,0.35)", border: "1px solid rgba(59,130,246,0.25)" }} />
              <div className="relative">
                <span className="mb-6 inline-flex size-12 items-center justify-center rounded-xl border border-border bg-secondary text-accent transition-colors duration-300 group-hover:border-accent/40">
                  <item.icon className="size-5" />
                </span>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 700 }} className="mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground" style={{ lineHeight: 1.8 }}>
                  {item.desc}
                </p>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
