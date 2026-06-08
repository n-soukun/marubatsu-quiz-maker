"use client";

import Link from "next/link";
import { usePathname, useRouter as useNextRouter } from "next/navigation";
import {
  type ComponentProps,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { LoadingSpinner } from "./loading-spinner";

type NavigationContextValue = {
  startNavigation: () => number;
  completeNavigation: (token: number) => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

function isSameLocation(href: ComponentProps<typeof Link>["href"]) {
  if (typeof window === "undefined") {
    return false;
  }

  const targetUrl = new URL(String(href), window.location.href);

  return (
    targetUrl.pathname === window.location.pathname &&
    targetUrl.search === window.location.search &&
    targetUrl.hash === window.location.hash
  );
}

function useNavigationContext() {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error(
      "Navigation components must be used within NavigationProvider",
    );
  }

  return context;
}

export function NavigationProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);
  const nextToken = useRef(1);
  const activeTokens = useRef(new Set<number>());

  const syncPendingCount = useCallback(() => {
    setPendingCount(activeTokens.current.size);
  }, []);

  const startNavigation = useCallback(() => {
    const token = nextToken.current;
    nextToken.current += 1;
    activeTokens.current.add(token);
    syncPendingCount();
    return token;
  }, [syncPendingCount]);

  const completeNavigation = useCallback(
    (token: number) => {
      if (!activeTokens.current.delete(token)) {
        return;
      }

      syncPendingCount();
    },
    [syncPendingCount],
  );

  useEffect(() => {
    if (activeTokens.current.size === 0) {
      return;
    }

    activeTokens.current.clear();
    setPendingCount(0);
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{ startNavigation, completeNavigation }}>
      <div className="relative min-h-screen">
        {children}
        {pendingCount > 0 ? <LoadingSpinner /> : null}
      </div>
    </NavigationContext.Provider>
  );
}

export type NavigationLinkProps = ComponentProps<typeof Link>;

export function NavigationLink({ onNavigate, ...props }: NavigationLinkProps) {
  const { startNavigation } = useNavigationContext();
  const href = props.href;

  const handleNavigate = useCallback<
    NonNullable<NavigationLinkProps["onNavigate"]>
  >(
    (event) => {
      let isPrevented = false;

      onNavigate?.({
        ...event,
        preventDefault: () => {
          isPrevented = true;
          event.preventDefault();
        },
      });

      if (isPrevented) {
        return;
      }

      if (isSameLocation(href)) {
        return;
      }

      startNavigation();
    },
    [href, onNavigate, startNavigation],
  );

  return <Link {...props} onNavigate={handleNavigate} />;
}

export function useNavigationRouter() {
  const router = useNextRouter();
  const { startNavigation, completeNavigation } = useNavigationContext();
  const [isPending, startTransition] = useTransition();
  const pendingTokens = useRef<number[]>([]);

  useEffect(() => {
    if (isPending || pendingTokens.current.length === 0) {
      return;
    }

    for (const token of pendingTokens.current) {
      completeNavigation(token);
    }

    pendingTokens.current = [];
  }, [completeNavigation, isPending]);

  const trackTransition = useCallback(
    (action: () => void) => {
      pendingTokens.current.push(startNavigation());
      startTransition(action);
    },
    [startNavigation, startTransition],
  );

  return {
    ...router,
    push: (
      href: Parameters<typeof router.push>[0],
      options?: Parameters<typeof router.push>[1],
    ) => {
      trackTransition(() => router.push(href, options));
    },
    replace: (
      href: Parameters<typeof router.replace>[0],
      options?: Parameters<typeof router.replace>[1],
    ) => {
      trackTransition(() => router.replace(href, options));
    },
    refresh: () => {
      trackTransition(() => router.refresh());
    },
    back: () => {
      router.back();
    },
    forward: () => {
      router.forward();
    },
  };
}
