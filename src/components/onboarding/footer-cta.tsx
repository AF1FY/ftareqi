import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";
import { Logo } from "./logo";
import Link from "next/link";

export function FooterCTA() {
  return (
    <footer className="relative px-6 pb-16 pt-12">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.2 }}>
          Ready for an easier{" "}
          <span className="glow-accent bg-gradient-to-r from-accent to-blue-300 bg-clip-text text-transparent">
            commute?
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-[42ch] text-muted-foreground" style={{ lineHeight: 1.8 }}>
          Join thousands of passengers who travel smarter every day.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="group flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-primary-foreground transition-all duration-300 hover:shadow-[0_0_36px_rgba(255,255,255,0.3)]"
          >
            Create a free account
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-border bg-card px-8 py-4 backdrop-blur-md transition-colors duration-300 hover:border-white/20"
          >
            Log in
          </Link>
        </div>
      </Reveal>

      <div className="mx-auto mt-20 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-border pt-8 text-muted-foreground md:flex-row">
        <Logo className="w-20" />
        <span style={{ fontSize: "0.875rem" }}>© 2026 Ftareqi — your travel companion.</span>
      </div>
    </footer>
  );
}
