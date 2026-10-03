'use client';

import React, { forwardRef, useEffect, useCallback } from 'react';
import NextLink from 'next/link';
import { useRouter, usePathname, useSearchParams, useParams as useNextParams } from 'next/navigation';

export const Link = forwardRef(({ to, href, children, ...props }, ref) => {
  const target = to || href || '#';
  return (
    <NextLink ref={ref} href={target} {...props}>
      {children}
    </NextLink>
  );
});
Link.displayName = 'Link';

export const NavLink = forwardRef(({ to, href, className, children, ...props }, ref) => {
  const target = to || href || '#';
  const pathname = usePathname() || '/';
  const isActive = pathname === target || (target !== '/' && pathname.startsWith(target));

  const computedClassName =
    typeof className === 'function'
      ? className({ isActive })
      : `${className || ''} ${isActive ? 'active' : ''}`.trim();

  return (
    <NextLink ref={ref} href={target} className={computedClassName} {...props}>
      {children}
    </NextLink>
  );
});
NavLink.displayName = 'NavLink';

export const useNavigate = () => {
  const router = useRouter();
  return useCallback((to, options) => {
    if (typeof to === 'number') {
      if (typeof window !== 'undefined') {
        if (to === -1) window.history.back();
        else window.history.go(to);
      }
      return;
    }
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [router]);
};

export const useLocation = () => {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const search = searchParams ? `?${searchParams.toString()}` : '';
  return {
    pathname,
    search,
    hash: typeof window !== 'undefined' ? window.location.hash : '',
    state: null,
  };
};

export const useParams = () => {
  const params = useNextParams() || {};
  return {
    ...params,
    jobId: params.jobId || params.id,
    carId: params.carId || params.id,
    id: params.id || params.jobId || params.carId,
  };
};

export const Navigate = ({ to, replace }) => {
  const router = useRouter();
  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);
  return null;
};

export const BrowserRouter = ({ children }) => <>{children}</>;
export const Routes = ({ children }) => <>{children}</>;
export const Route = () => null;
