import type { Metadata } from "next";

import "@fontsource/inter";
import "@fontsource/vazirmatn";

import "./globals.css";


export const metadata: Metadata = {
  title: "G5 Vocabulary Trainer",
  description: "Smart vocabulary learning system",
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