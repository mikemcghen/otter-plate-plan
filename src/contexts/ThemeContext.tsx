import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type DashboardTheme = "fresh-start" | "encouraging-energy" | "reflective-calm";

interface ThemeContextType {
  dashboardTheme: DashboardTheme;
  setDashboardTheme: (theme: DashboardTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [dashboardTheme, setDashboardTheme] = useState<DashboardTheme>(() => {
    const saved = localStorage.getItem("ottr-dashboard-theme");
    return (saved as DashboardTheme) || "fresh-start";
  });

  useEffect(() => {
    localStorage.setItem("ottr-dashboard-theme", dashboardTheme);
  }, [dashboardTheme]);

  return (
    <ThemeContext.Provider value={{ dashboardTheme, setDashboardTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
};
