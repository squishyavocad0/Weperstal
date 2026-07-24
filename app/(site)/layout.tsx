import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { FooterMeadowProvider } from "@/components/site/FooterMeadow";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FooterMeadowProvider>
      <div className="flex min-h-screen flex-col">
        <a
          href="#inhoud"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-cream"
        >
          Naar de inhoud
        </a>
        <Header />
        <main id="inhoud" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </FooterMeadowProvider>
  );
}
