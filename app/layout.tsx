import type { Metadata } from "next";
import { ReactNode } from "react";

import { QueryProvider } from "@/components/providers/query-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "NeoBrutal Dashboard",
  description: "Next.js 15 dashboard scaffold with URL-backed filters and mocked analytics widgets.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
