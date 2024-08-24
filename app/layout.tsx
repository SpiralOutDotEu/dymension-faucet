import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dymension League Faucet",
  description: "Faucet for Dymension League - Apollo Testnet",
  openGraph: {
    title: "Dymension League Faucet",
    description:
      "Get your free tokens for the Dymension League Apollo Testnet. Drip once every 24 hours!",
    url: "faucet.dymension-league.xyz",
    type: "website",
    images: [
      {
        url: "https://faucet.dymension-league.xyz/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dymension League Faucet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dymension League Faucet",
    description:
      "Get your free tokens for the Dymension League Apollo Testnet. Drip once every 24 hours!",
    images: [
      {
        url: "https://faucet.dymension-league.xyz/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dymension League Faucet",
      },
    ],
  },
};

export const generateViewport = () => ({
  width: "device-width",
  initialScale: 1,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
