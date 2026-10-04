import "./globals.css";
import ClickSparkEffect from "@/components/ui/ClickSparkEffect";

export const metadata = {
  metadataBase: new URL(process.env.AUTH_URL || "http://localhost:3000"),
  title: {
    default: "Sportivo | Train. Improve. Perform.",
    template: "%s | Sportivo",
  },
  description: "Professional cricket, football, and basketball coaching with clear progress tracking and a community that helps every athlete move forward.",
  openGraph: {
    title: "Sportivo | Train. Improve. Perform.",
    description: "Find your sport. Meet your coach. Make your next session count.",
    type: "website",
    images: [{ url: "/images/sportivo-logo.png", width: 1024, height: 1024, alt: "Sportivo Sports Academy" }],
  },
};

export const viewport = { themeColor: "#0b1f3a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <ClickSparkEffect />
        {children}
      </body>
    </html>
  );
}
