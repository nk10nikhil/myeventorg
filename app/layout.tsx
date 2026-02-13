import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QR Ticketing and Entry Management System",
  description:
    "Multi-event QR-based registration and ticketing system with admin dashboard and entry management. Built with Next.js, MongoDB, and Razorpay. Supports user registration, event creation, ticket purchasing, and real-time entry scanning. Ideal for conferences, concerts, and festivals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
