"use client";

import { motion } from "motion/react";
import { MapPin, UserCheck, CreditCard } from "lucide-react";
import { Reveal } from "./reveal";

const steps = [
  { icon: MapPin, n: "01", title: "Choose your destination", desc: "Set your pickup and drop-off, and we'll surface the rides heading your way." },
  { icon: UserCheck, n: "02", title: "Pick a driver", desc: "Browse verified drivers, check their ratings, and choose the right fit for your trip." },
  { icon: CreditCard, n: "03", title: "Ride & pay", desc: "Travel in comfort and pay securely in-app once your ride is complete." },
];

export function HowItWorks() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal className="mx-auto mb-20 max-w-2xl text-center">
        <p className="mb-3 text-accent">How it works</p>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, lineHeight: 1.3 }}>
          Three steps to your ride
        </h2>
      </Reveal>

      <div className="relative">
        {/* Self-drawing dashed connector (hidden on mobile where layout stacks) */}
        <svg
          className="absolute inset-x-0 top-8 hidden h-2 w-full md:block"
          viewBox="0 0 1000 2"
          preserveAspectRatio="none"
          fill="none"
        >
          <motion.line
            x1="60" y1="1" x2="940" y2="1"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeDasharray="6 8"
            strokeOpacity="0.55"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
        </svg>

        <div className="grid gap-12 md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.25} className="text-center">
              <div className="relative mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-border bg-secondary text-accent backdrop-blur-xl">
                <step.icon className="size-6" />
              </div>
              <span className="mb-2 block text-muted-foreground" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}>
                {step.n}
              </span>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 700 }} className="mb-3">
                {step.title}
              </h3>
              <p className="mx-auto max-w-[28ch] text-muted-foreground" style={{ lineHeight: 1.8 }}>
                {step.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
