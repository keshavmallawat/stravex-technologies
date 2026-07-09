import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/settings-data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title:
      settings.seoDefaultTitle ||
      "Stravex Technologies | Indigenous Tactical Defence Systems",
    description:
      settings.seoDefaultDescription ||
      "Stravex Technologies engineers India's indigenous tactical defence ecosystem — drone interception, autonomous aerial platforms, avionics, pilot training, and field sustainment infrastructure.",
    ...(settings.faviconUrl ? { icons: { icon: settings.faviconUrl } } : {}),
    ...(settings.ogDefaultImageUrl
      ? { openGraph: { images: [settings.ogDefaultImageUrl] } }
      : {}),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
