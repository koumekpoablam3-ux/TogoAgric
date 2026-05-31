import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TogoAgric — La plateforme agricole du Togo",
  description: "Prix en temps réel, météo, et marketplace pour les agriculteurs togolais.",
  icons: {
    icon: "/togo-agric-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
