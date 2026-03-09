import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SavedPhrasesProvider } from "@/contexts/SavedPhrasesContext";
import { SourceLanguageProvider } from "@/contexts/SourceLanguageContext";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
  ],
};

export const metadata: Metadata = {
  title: "NativeFlow — Sound Like a Native",
  description:
    "Instantly verify whether your phrase sounds natural for a native speaker in any region. Real-time dialect analysis for serious language learners.",
  keywords: ["language learning", "dialect", "regional speech", "native speaker", "polyglot"],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "NativeFlow — Sound Like a Native",
    description: "Real-time regional authenticity for serious language learners.",
    type: "website",
    url: "https://polygot.app",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NativeFlow — Sound Like a Native",
    description: "Real-time regional authenticity for serious language learners.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apple PWA meta tags — needed for "Add to Home Screen" on iPhone */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NativeFlow" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${jakarta.variable} font-sans antialiased min-h-screen bg-[#faf8f5] text-[#1d1d1f] dark:bg-[#09090b] dark:text-[#f5f5f7]`}>
        <ThemeProvider>
          <SourceLanguageProvider>
            <SavedPhrasesProvider>
              {children}
              <BottomNav />
            </SavedPhrasesProvider>
          </SourceLanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
