import { TempoInit } from "@/components/tempo-init";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcherWrapper } from "@/components/theme-switcher-wrapper";
import { CartProvider } from "@/components/cart-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Montink | Print On Demand e Produtos Personalizados",
  description:
    "Crie e venda produtos personalizados com sua marca sem precisar investir em estoque, produção ou logística. Comece seu negócio online hoje!",
  keywords:
    "print on demand, pod, estampas, produtos personalizados, sua marca, loja online, camisetas, canecas, e-commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className="relative">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <CartProvider>
            <ThemeSwitcherWrapper />
            {children}
            <TempoInit />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
