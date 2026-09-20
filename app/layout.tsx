import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adithyan 7e — Independent by Design",
  description: "Independent creative portfolio / Design + code + a little strange",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
