"use client";

import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Global Axios Config
const API_URL = (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) || "http://localhost:8000/api";
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true; // required for secure cookie sessions

axios.interceptors.request.use((config) => {
  config.headers['Accept'] = 'application/json';
  // Strip leading slash if present so it doesn't strip /api from baseURL
  if (config.url && config.url.startsWith('/') && !config.url.startsWith('http')) {
    config.url = config.url.slice(1);
  }
  if (typeof document !== 'undefined') {
    const csrfCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith('csrfToken='));
    const csrfToken = csrfCookie?.split('=')[1];
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
      config.headers['x-csrf-token'] = decodeURIComponent(csrfToken);
    }
  }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async (explicitToken) => {
    try {
      const activeToken =
        explicitToken ||
        (typeof window !== "undefined" ? localStorage.getItem("token") : null);

      if (!activeToken) {
        setUser(null);
        setToken(null);
        setAuthLoading(false);
        return null;
      }

      const headers = { Authorization: `Bearer ${activeToken}` };
      const res = await axios.get("auth/user", { headers });
      if (res.data && res.data.success && res.data.user) {
        setUser(res.data.user);
        setToken(activeToken);
        return res.data.user;
      } else {
        setUser(null);
        setToken(null);
        if (typeof window !== "undefined") localStorage.removeItem("token");
        return null;
      }
    } catch (error) {
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") localStorage.removeItem("token");
      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  // 🔹 On initial load, check if a stored token is valid
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        fetchUser(storedToken);
      } else {
        setAuthLoading(false);
      }
    } else {
      setAuthLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      await axios.post("user/logout");
    } catch (err) {
      console.error("Logout failed:", err.message);
    } finally {
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      delete axios.defaults.headers.common["Authorization"];
      navigate("/");
    }
  };
  /* For export csv data  */
  const downloadCSV = async (endpoint, fileName, body = {}) => {
    try {
      const res = await axios.post(
        endpoint,
        body,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.csv`);
      document.body.appendChild(link);

      link.click();
      link.remove();
    } catch (error) {
      toast.error("Export Failed!");
    }
  };


  const value = {
    user,
    setUser,
    token,
    setToken,
    authLoading,
    setAuthLoading,
    logout,
    downloadCSV,
    fetchUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
