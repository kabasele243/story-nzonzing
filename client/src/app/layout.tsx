import { Button } from "@/components/ui/Button";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
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
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} antialiased`}>
          <header className="z-100 absolute top-4 right-4 z-10">
            <SignedOut>
              <div className="flex gap-2">
                <SignInButton mode="modal">
                  <Button variant="secondary">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 lg:pl-22 ">{children}</div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
