"use client"
import { useSession } from "next-auth/react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <h1 className="text-6xl me-6">Home</h1>
    </div>
  );
}
