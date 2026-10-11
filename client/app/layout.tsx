import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "InternLink",
  description: "Find Your Dream Internship. Build Your Future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${lora.className} h-full antialiased`}
    >
      <body className={`${lora.className} min-h-full flex flex-col font-serif`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
