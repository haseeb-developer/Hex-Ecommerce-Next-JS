import HeroBanner from "@/sections/HeroBanner";
import TextMarquee from "@/sections/TextMarquee";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HEX - Premium Fashion & Style",
  description: "Discover premium quality fashion that defines elegance and sophistication",
};

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <HeroBanner />
      <TextMarquee />
      {/* Add more sections below */}
    </main>
  );
}

