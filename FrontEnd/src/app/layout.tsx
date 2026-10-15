import "./theme-config.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@radix-ui/themes/styles.css";
import NavBar from "./NavBar";
import { Container } from "@radix-ui/themes";
import QueryProvider from "./providers/QueryProvider";
import ThemeProvider from "./providers/ThemeProvider";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CarFinder",
  description: "Search cars across 15 brands — NestJS + PostgreSQL + OpenSearch + Next.js.",
};

// Runs before React hydrates so the html class matches stored preference,
// preventing a light->dark flash on load.
const antiFlash = `(function(){try{var a=localStorage.getItem('appearance');var d=a==='dark'||(!a&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFlash }} />
      </head>
      <body>
        <QueryProvider>
          <ThemeProvider>
            <NavBar />
            <main className="p-5">
              <Container>{children}</Container>
            </main>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
