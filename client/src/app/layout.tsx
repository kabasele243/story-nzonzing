import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Story Pipeline - AI-Powered Storytelling",
  description: "Transform short story summaries into rich narratives with AI-generated scenes and image prompts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 lg:pl-22 ">{children}</div>
        </div>
      </body>
    </html>
  );
}
