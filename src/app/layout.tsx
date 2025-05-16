/** @format */

import type { Metadata } from "next";
import "./globals.css";
import DeviceTheme from "@/utils/DeviceTheme";

export const metadata: Metadata = {
  title: "Terminal 12",
  description: "Website Terminal 12",
  authors: {
    name: "SmartSpartacuS",
    url: "https://smart.satgar.my.id",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <DeviceTheme />

      <body className={`font-comic-neue text-lg`}>{children}</body>
    </html>
  );
}
