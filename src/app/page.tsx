"use client"
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  console.log(session);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <h1 className="text-6xl me-6">Home</h1>
    </div>
  );
}
