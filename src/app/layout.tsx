import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import "./globals.css";
import "../styles/main.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Victor Springs - Premium Property Rentals in Kenya",
  description:
    "Discover premium rental properties in Kenya with Victor Springs. Find your perfect home with our advanced search and filtering system. Apartments, houses, villas in Nairobi and beyond.",
  keywords:
    "property rentals Kenya, apartments Nairobi, houses for rent Kenya, real estate Kenya, Victor Springs",
  authors: [{ name: "Victor Springs" }],
  creator: "Victor Springs",
  publisher: "Victor Springs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://victorsprings.co.ke"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Victor Springs - Premium Property Rentals in Kenya",
    description:
      "Discover premium rental properties in Kenya with Victor Springs. Find your perfect home with our advanced search and filtering system.",
    url: "https://victorsprings.co.ke",
    siteName: "Victor Springs",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Victor Springs - Premium Property Rentals",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Victor Springs - Premium Property Rentals in Kenya",
    description:
      "Discover premium rental properties in Kenya with Victor Springs. Find your perfect home with our advanced search and filtering system.",
    images: ["/og-image.jpg"],
    creator: "@victorsprings",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Toaster />
          <SonnerToaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
