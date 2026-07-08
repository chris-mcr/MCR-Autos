import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Torque Auto Parts — Quality Car Parts Online",
  description: "Torque Auto Parts stocks brakes, filters, electrical, engine, suspension and exterior parts for every make and model. Fast shipping, trade prices.",
  metadataBase: new URL("https://torqueautoparts.com"),
  openGraph: {
    title: "Torque Auto Parts — Quality Car Parts Online",
    description: "Brakes, filters, electrical, engine, suspension and exterior parts for every make and model. Fast shipping, trade prices.",
    url: "https://torqueautoparts.com",
    type: "website",
    siteName: "Torque Auto Parts",
  },
  twitter: {
    card: "summary_large_image",
    title: "Torque Auto Parts — Quality Car Parts Online",
    description: "Brakes, filters, electrical, engine, suspension and exterior parts for every make and model. Fast shipping, trade prices.",
  },
  keywords: ["car parts", "auto parts", "brakes", "filters", "spark plugs", "car battery", "vehicle spares"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔧</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
