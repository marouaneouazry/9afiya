import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.name} (${siteConfig.arabicName}) - ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: [
    "Darija",
    "Freestyle Rap",
    "Moroccan Rap",
    "Rhyme Game",
    "9afiya",
    "قافية",
    "Casablanca Hip Hop",
  ],
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.arabicName}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "ary_MA",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ary" dir="ltr" className="dark">
      <body className="min-h-screen flex flex-col antialiased selection:bg-majorelle selection:text-white">
        {children}
      </body>
    </html>
  );
}
