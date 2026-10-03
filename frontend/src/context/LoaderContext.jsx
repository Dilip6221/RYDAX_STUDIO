"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export const LoaderContext = createContext(null);

export const useLoader = () => useContext(LoaderContext);

const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const activeRequestsRef = useRef(0);

  const startRequest = useCallback((text = "Loading...") => {
    activeRequestsRef.current += 1;
    if (activeRequestsRef.current === 1) {
      setLoadingText(text);
      setIsLoading(true);
    }
  }, []);

  const endRequest = useCallback(() => {
    activeRequestsRef.current = Math.max(0, activeRequestsRef.current - 1);
    if (activeRequestsRef.current === 0) {
      setIsLoading(false);
      setLoadingText("Loading...");
    }
  }, []);

  const setGlobalLoading = useCallback((value, text = "Loading...") => {
    if (value) {
      setLoadingText(text);
      setIsLoading(true);
      return;
    }

    if (activeRequestsRef.current === 0) {
      setIsLoading(false);
      setLoadingText("Loading...");
    }
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      loadingText,
      startRequest,
      endRequest,
      setGlobalLoading,
    }),
    [isLoading, loadingText, startRequest, endRequest, setGlobalLoading]
  );

  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>;
};

export default LoaderProvider;
