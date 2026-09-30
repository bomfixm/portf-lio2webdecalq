import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { IntroProvider } from "@/components/Intro";
import { ScrollMemory } from "@/components/ScrollMemory";
import { CapturaOrigem } from "@/components/CapturaOrigem";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz"],
});
const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.brand} | Sites, sistemas e soluções digitais`,
    template: `%s | ${siteConfig.brand}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.brand,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: siteConfig.brand,
    title: `${siteConfig.brand} | Sites, sistemas e soluções digitais`,
    description: siteConfig.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05070d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Roda antes da primeira pintura, sem depender do React: marca que há
            JS (as revelações só se escondem com ele) e, na home, segura o hero
            até a intro terminar. O temporizador libera a página mesmo que o
            React nunca monte. Sem memória de sessão: a intro toca sempre. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;d.classList.add("js");
var p=location.pathname.replace(/\\/+$/,"")||"/";
if(p!=="/")return;
d.dataset.intro="play";
setTimeout(function(){if(d.dataset.intro==="play")d.dataset.intro="done"},5000)}catch(e){}})()`,
          }}
        />
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <div className="ambient" aria-hidden="true" />
        <IntroProvider>
          <SmoothScroll />
          <ScrollMemory />
          <CapturaOrigem />
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
        </IntroProvider>
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
