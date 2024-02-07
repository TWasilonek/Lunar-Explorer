import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import { App } from "@/components/App";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lunar Explorer",
  description: "Book your trip to the moon!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <App>{children}</App>
          {/* <Navbar />
          {children} */}
        </Providers>
      </body>
    </html>
  );
}
