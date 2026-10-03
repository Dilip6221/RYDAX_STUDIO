import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "RYDAX Studio";
const DEFAULT_DESCRIPTION =
  "Premium car detailing, ceramic coating, paint protection film and automotive care by RYDAX Studio.";
const SITE_URL = ((typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) || "").replace(/\/$/, "");

const routeMetadata = [
  ["/", "Premium Car Detailing in Ahmedabad | RYDAX Studio", "Premium car detailing, ceramic coating, PPF and professional automotive care in Ahmedabad by RYDAX Studio."],
  ["/about", "About RYDAX Studio | Premium Car Care in Ahmedabad", "Learn about RYDAX Studio, our detailing experts, process and commitment to premium automotive care."],
  ["/services", "Car Detailing Services in Ahmedabad | RYDAX Studio", "Explore RYDAX Studio services including ceramic coating, PPF, detailing, paint correction and premium car care."],
  ["/blog", "Car Care Tips and Automotive Insights | RYDAX Studio", "Expert car care tips, ceramic coating guides, PPF advice and automotive insights from RYDAX Studio."],
  ["/gallery", "Car Detailing Gallery | RYDAX Studio Ahmedabad", "View real car detailing, ceramic coating, paint correction and PPF work completed by RYDAX Studio."],
  ["/contact-us", "Contact RYDAX Studio | Car Detailing Ahmedabad", "Book premium car detailing, ceramic coating or PPF consultation with RYDAX Studio in Ahmedabad."],
  ["/faqs", "Car Detailing FAQs | RYDAX Studio", "Answers about car detailing, ceramic coating, PPF, pricing, warranty, booking and vehicle care."],
  ["/online-services", "Book Car Care Services Online | RYDAX Studio", "Browse and book professional car care services online with RYDAX Studio."],
];

const privatePrefixes = [
  "/admin",
  "/profile",
  "/my-car-vault",
  "/login",
  "/forget-password",
];

function upsertMeta(attribute, value, content) {
  let element = document.head.querySelector(`meta[${attribute}="${value}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function upsertJsonLd(data) {
  let element = document.head.querySelector('script[data-seo="jsonld"]');
  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.dataset.seo = "jsonld";
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
}

export function Seo({ title, description, image, type = "website", noindex, structuredData }) {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/$/, "") || "/";
  const current = routeMetadata.find(([path]) => path === pathname);
  const isPrivate = privatePrefixes.some((prefix) => pathname.startsWith(prefix));
  const isKnownPage = current || pathname.startsWith("/blog/") || pathname.startsWith("/service/");
  const finalTitle = title || current?.[1] || `${SITE_NAME} | Premium Car Care`;
  const finalDescription = description || current?.[2] || DEFAULT_DESCRIPTION;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonicalUrl = `${SITE_URL || origin}${location.pathname}`;
  const imageUrl = image || `${SITE_URL || origin}/favicon.png`;

  useEffect(() => {
    document.title = finalTitle;
    upsertMeta("name", "description", finalDescription);
    upsertMeta("name", "robots", noindex || isPrivate || !isKnownPage ? "noindex, nofollow" : "index, follow");
    upsertMeta("property", "og:title", finalTitle);
    upsertMeta("property", "og:description", finalDescription);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", finalTitle);
    upsertMeta("name", "twitter:description", finalDescription);
    upsertMeta("name", "twitter:image", imageUrl);
    upsertLink("canonical", canonicalUrl);

    upsertJsonLd(structuredData || {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "AutomotiveBusiness",
          "@id": `${SITE_URL || window.location.origin}/#business`,
          name: SITE_NAME,
          url: SITE_URL || window.location.origin,
          image: imageUrl,
          description: DEFAULT_DESCRIPTION,
          telephone: "+919313015917",
          priceRange: "$$",
        },
        {
          "@type": "WebSite",
          "@id": `${SITE_URL || window.location.origin}/#website`,
          name: SITE_NAME,
          url: SITE_URL || window.location.origin,
        },
      ],
    });
  }, [canonicalUrl, finalDescription, finalTitle, imageUrl, isKnownPage, isPrivate, noindex, structuredData, type]);

  return null;
}

export default function RouteSeo() {
  return <Seo />;
}
