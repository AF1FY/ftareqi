"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import Link from "next/link";

export function OnBoardNavbar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setHidden(false);
      } else if (y > lastY) {
        setHidden(true);
      } else if (y < lastY) {
        setHidden(false);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: hidden ? 0 : 1, y: hidden ? -90 : 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" aria-label="Ftareqi home" className="flex items-center">
          <Logo className="w-24" />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-5 py-2 text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-primary px-5 py-2 text-primary-foreground transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_24px_rgba(255,255,255,0.25)]"
          >
            Sign up
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
