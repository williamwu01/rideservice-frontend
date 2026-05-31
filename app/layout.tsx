import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "@/components/ThemeProvider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Loop Rideshare – Move, Deliver, Connect. All with Loop.",
  description:
    "Canada's trusted rideshare and carpool platform. Verified drivers, lower fees, 20+ cities. Download the Loop app today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased bg-white dark:bg-slate-950 text-slate-950 dark:text-white transition-colors">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
