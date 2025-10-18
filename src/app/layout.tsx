import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HerEcho - Voice Learning",
  description: "Voice-only chat interface for women's empowerment and accessible learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
