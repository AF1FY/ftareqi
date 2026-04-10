"use client"
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";

export default function Home() {
  return (
    <>
      <Navbar logo = {<Logo />} />
      <div className="flex full-scn items-center justify-center bg-background">
        <h1 className="text-6xl me-6">Home</h1>
      </div>
    </>
  );
}
