import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://weperstal.nl"),
  title: {
    default: "De Weperstal – Opgroeien tussen paarden, pony's en natuur",
    template: "%s | De Weperstal",
  },
  description:
    "De Weperstal is een kleinschalige plek bij Oosterwolde waar kinderen veilig en warm kennismaken met paarden, pony's en het buitenleven.",
  openGraph: {
    title: "De Weperstal",
    description:
      "Een plek waar kinderen dromen beleven tussen de paarden en pony's.",
    locale: "nl_NL",
    type: "website",
    siteName: "De Weperstal",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
