import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Weather from "./components/Weather";
import CropRecommend from "./components/CropRecommend";
import FertilizerRecommend from "./components/FertilizerRecommend";
import DiseaseDetect from "./components/DiseaseDetect";
import AlertsCenter from "./components/AlertsCenter";
import Reports from "./components/Reports";
import Profile from "./components/Profile";
import AdminPanel from "./components/AdminPanel";
import Contact from "./components/Contact";
import { AppTab, FullState, translationsMap } from "./types";
import { Loader2 } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = React.useState<AppTab>("home");
  const [lang, setLang] = React.useState<"en" | "hi" | "mr">("en");
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [state, setState] = React.useState<FullState | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch state on mount
  const fetchState = async () => {
    try {
      const response = await fetch("/api/state");
      const data = await response.json();
      setState(data);
    } catch (error) {
      console.error("Failed to fetch state from server:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchState();
  }, []);

  // Sync dark class on document element
  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  // Pump automation controls handler
  const updatePumpState = async (autoMode: boolean, status: boolean) => {
    try {
      const response = await fetch("/api/pump", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoMode, status })
      });
      const data = await response.json();
      if (data.success) {
        await fetchState();
      }
    } catch (error) {
      console.error("Pump update failure:", error);
    }
  };

  // IoT drift simulator handler
  const updateSimulatedSensors = async (payload: {
    moisture: number;
    temperature: number;
    humidity: number;
    waterLevel: number;
    pumpStatus: boolean;
  }) => {
    try {
      const response = await fetch("/api/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        // Fetch fresh state to keep history charts synchronized
        const freshRes = await fetch("/api/state");
        const freshData = await freshRes.json();
        setState(freshData);
      }
    } catch (error) {
      console.error("Simulator drift dispatch error:", error);
    }
  };

  // Save profile information handler
  const onSaveProfile = async (updatedProfile: any) => {
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile)
      });
      const data = await response.json();
      if (data.success) {
        await fetchState();
      }
    } catch (error) {
      console.error("Profile dispatch failure:", error);
    }
  };

  // Dismiss individual alerts or mark all read
  const onDismissAlert = async (id: string) => {
    try {
      const response = await fetch("/api/alerts/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await response.json();
      if (data.success) {
        await fetchState();
      }
    } catch (error) {
      console.error("Dismiss warning log error:", error);
    }
  };

  // Post direct admin announcement logs
  const onPostAnnouncement = async (message: string, alertType: "info" | "warning" | "danger") => {
    try {
      const response = await fetch("/api/admin/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, type: alertType })
      });
      const data = await response.json();
      if (data.success) {
        await fetchState();
      }
    } catch (error) {
      console.error("Admin broadcast dispatch failed:", error);
    }
  };

  if (loading || !state) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
        <span className="text-xs text-slate-400 font-mono tracking-wider animate-pulse uppercase">
          Initializing Kisan Alert Precision Systems...
        </span>
      </div>
    );
  }

  const translations = translationsMap[lang] || translationsMap.en;
  const unreadAlertsCount = state.alerts.filter(a => !a.read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
      
      {/* Dynamic Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={toggleTheme}
        translations={translations}
        unreadAlertsCount={unreadAlertsCount}
      />

      {/* Main Tab Routing */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === "home" && (
          <Home 
            setCurrentTab={setCurrentTab} 
            translations={translations} 
            theme={theme} 
          />
        )}
        
        {currentTab === "dashboard" && (
          <Dashboard
            state={state}
            updatePumpState={updatePumpState}
            updateSimulatedSensors={updateSimulatedSensors}
            translations={translations}
            theme={theme}
          />
        )}

        {currentTab === "weather" && (
          <Weather 
            translations={translations} 
            theme={theme} 
          />
        )}

        {currentTab === "crop" && (
          <CropRecommend />
        )}

        {currentTab === "fertilizer" && (
          <FertilizerRecommend />
        )}

        {currentTab === "disease" && (
          <DiseaseDetect />
        )}

        {currentTab === "alerts" && (
          <AlertsCenter 
            alerts={state.alerts} 
            onDismissAlert={onDismissAlert} 
          />
        )}

        {currentTab === "reports" && (
          <Reports 
            state={state} 
          />
        )}

        {currentTab === "profile" && (
          <Profile 
            profile={state.profile} 
            onSaveProfile={onSaveProfile} 
          />
        )}

        {currentTab === "admin" && (
          <AdminPanel 
            state={state} 
            onPostAnnouncement={onPostAnnouncement} 
          />
        )}

        {currentTab === "contact" && (
          <Contact />
        )}
      </main>

      {/* Brand Footer */}
      <Footer 
        setCurrentTab={setCurrentTab} 
        translations={translations} 
      />
    </div>
  );
}
