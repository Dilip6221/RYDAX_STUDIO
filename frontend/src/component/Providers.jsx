"use client";

import React, { useEffect } from "react";
import { UserProvider, UserContext } from "../context/UserContext";
import LoaderProvider, { useLoader } from "../context/LoaderContext";
import { attachGlobalLoader } from "../utils/loader";
import GlobalLoader from "../component/GlobalLoader";
import ScrollToTop from "../component/ScrollToTop";
import ScrollToTopArrow from "../component/ScrollToTopArrow";
import RouteSeo from "../component/Seo";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import WhatsappButton from "../component/WhatsappButton";
import { usePathname, useRouter } from "next/navigation";

function AppShell({ children }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { user, authLoading } = React.useContext(UserContext);
  const { setGlobalLoading, startRequest, endRequest } = useLoader();

  const hideNavbarRoutes = ["/login", "/forget-password", "/admin", "/online-services"];
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    pathname.toLowerCase().startsWith(route)
  );

  const isAdminRoute = pathname.toLowerCase().startsWith("/admin");

  useEffect(() => {
    const cleanup = attachGlobalLoader({ startRequest, endRequest });
    return cleanup;
  }, [startRequest, endRequest]);

  useEffect(() => {
    if (authLoading) {
      setGlobalLoading(true, "Your Premium studio is waiting...");
      return;
    }

    setGlobalLoading(true, "Loading page...");
    const timer = window.setTimeout(() => {
      setGlobalLoading(false);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [authLoading, pathname, setGlobalLoading]);

  // Admin route protection matching App.jsx
  useEffect(() => {
    if (!authLoading && isAdminRoute) {
      if (!user || user.role !== "ADMIN") {
        router.replace("/");
      }
    }
  }, [authLoading, isAdminRoute, user, router]);

  if (authLoading) {
    return <GlobalLoader />;
  }

  if (isAdminRoute && (!user || user.role !== "ADMIN")) {
    return <GlobalLoader />;
  }

  return (
    <>
      <GlobalLoader />
      <ScrollToTop />
      <ScrollToTopArrow />
      <RouteSeo />
      {!shouldHideNavbar && <Navbar />}
      {children}
      {!shouldHideNavbar && <Footer />}
      {!shouldHideNavbar && <WhatsappButton />}
    </>
  );
}

export default function Providers({ children }) {
  return (
    <LoaderProvider>
      <UserProvider>
        <AppShell>{children}</AppShell>
      </UserProvider>
    </LoaderProvider>
  );
}
