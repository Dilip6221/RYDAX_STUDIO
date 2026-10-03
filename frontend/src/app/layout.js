import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "swiper/css";
import "../css/index.css";
import "../css/home.css";
import "../css/RevealCarBanner.css";
import "../css/footer.css";
import "../css/about.css";
import "../css/contact.css";
import "../css/gallery.css";
import "../css/blog.css";
import "../css/service-detail.css";
import "../css/onlineService.css";
import "../css/job-card.css";
import "../css/profile.css";
import "../css/admin.css";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "../components/Providers";

export const metadata = {
  title: "RYDAX Studio | Ultra-Luxury Automotive Detailing & Armor Atelier",
  description:
    "Aerospace-Grade Self-Healing Paint Protection Film (PPF), 10H Ceramic Matrix Infusion, and Surgical Paint Correction in Ahmedabad.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@400;500;600;700;800;900&family=Syne:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-white antialiased selection:bg-[#ff3b30] selection:text-white">
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
