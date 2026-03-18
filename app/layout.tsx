import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "D&D Vote",
  description: "Vote on the best date for your next D&D session.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
