import type { Metadata } from "next";

import "@fontsource/inter";
import "@fontsource/vazirmatn";

import "./globals.css";


export const metadata: Metadata = {
  title: "G5 Vocabulary",
  description: "Smart vocabulary review and flashcard training.",
  manifest: "/manifest.webmanifest",
  themeColor: "#4F46E5",
  icons: {
    icon: "/g5-icon.svg",
    apple: "/g5-icon.svg",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}