import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LiteModeProvider } from "@/components/lite-mode-provider";
import { Web3Providers } from "@/providers/wagmi-provider";
import HideV0Badge from "@/components/hide-v0-badge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoteSprout - Gasless DAO Voting",
  description:
    "Create and vote on proposals using your wallet — no ETH needed.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  themeColor: "#0a0a0b",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <HideV0Badge /> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LiteModeProvider>
            <Web3Providers>{children}</Web3Providers>
          </LiteModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
