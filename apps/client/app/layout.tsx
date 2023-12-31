import "../styles/globals.css";

import { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Suspense } from "react";

import Toast from "./Toast";

const font = Nunito({ subsets: ["latin"] });

const APP_NAME = "UNAVI";
const DESCRIPTION = "An open metaverse platform";
const HERO = "/images/Hero.png";

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    startupImage: {
      url: "/images/Icon-512.png",
    },
    title: APP_NAME,
  },
  applicationName: APP_NAME,
  colorScheme: "light",
  description: DESCRIPTION,
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: [
      {
        sizes: "192x192",
        url: "/images/Icon-192.png",
      },
    ],
    icon: "/images/Icon-512.png",
    shortcut: "/images/Icon-512.png",
  },
  keywords: ["Metaverse", "WebXR", "Web3"],
  manifest: "/manifest.json",
  openGraph: {
    description: DESCRIPTION,
    images: [
      {
        height: 500,
        url: HERO,
        width: 888,
      },
    ],
    siteName: APP_NAME,
    title: APP_NAME,
    type: "website",
  },
  themeColor: "#191919",
  title: { default: APP_NAME, template: `%s / ${APP_NAME}` },
  twitter: {
    card: "summary_large_image",
    description: DESCRIPTION,
    images: [HERO],
    site: "@unavi_xyz",
    title: APP_NAME,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        {children}

        <Suspense>
          <Toast />
        </Suspense>
      </body>
    </html>
  );
}
