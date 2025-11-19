import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/sections/AnnouncementBar";
import Header from "@/sections/Header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Ecommerce Store",
  description: "A modern ecommerce store built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={poppins.className} 
        suppressHydrationWarning
      >
        <AnnouncementBar />
        <Header />
        {children}
      </body>
    </html>
  );
}

