/** @format */

import type { Metadata } from "next";
import "./globals.css";
import DeviceTheme from "@/utils/DeviceTheme";

export const metadata: Metadata = {
  title: "UMKM - WWF",
  description: "Website UMKM WWF",
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
