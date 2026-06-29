"use client";
import { FooterCTA } from "@/components/onboarding/footer-cta";
import { Hero } from "@/components/onboarding/hero";
import { HowItWorks } from "@/components/onboarding/how-it-works";
import { OnBoardNavbar } from "@/components/onboarding/onBoard-navbar";
import { TrustSafety } from "@/components/onboarding/trust-safety";
import { ValueProps } from "@/components/onboarding/value-props";
import { WavesBackground } from "@/components/onboarding/waves-background";

export default function Home() {
    return (
        <div className="relative min-h-screen w-full text-foreground">
            <WavesBackground />
            <OnBoardNavbar />
            <main className="relative">
                <Hero />
                <ValueProps />
                <HowItWorks />
                <TrustSafety />
                <FooterCTA />
            </main>
        </div>
    );
}
