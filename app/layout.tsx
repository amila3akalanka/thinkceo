import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ProgressProvider } from "@/components/ProgressProvider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThinkCEO",
  description: "Train your CEO mindset with real business decisions from history.",
};

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* Browser extensions (e.g. Grammarly) add attributes to <body> before React loads; ignore those. */}
      <body className={`${jakarta.variable} font-sans antialiased`} suppressHydrationWarning>
        <ProgressProvider>
          <div className="mx-auto min-h-dvh max-w-md">{children}</div>
        </ProgressProvider>
      </body>
    </html>
  );
}
