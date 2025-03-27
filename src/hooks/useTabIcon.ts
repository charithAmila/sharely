import { useLocation } from "react-router";
import { useAuthContext } from "../context/AuthContext";
import { useEffect } from "react";

export const useTabIcon = () => {
  const { setActiveTab } = useAuthContext();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/tabs/profile") {
      setActiveTab("profile");
    } else if (location.pathname === "/tabs/home") {
      setActiveTab("home");
    } else if (location.pathname === "/tabs/search") {
      setActiveTab("search");
    } else if (location.pathname === "/tabs/tags") {
      setActiveTab("tags");
    }
  }, [location]);
};
