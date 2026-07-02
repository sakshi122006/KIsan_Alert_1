import React from "react";
import { Sprout, Bell, Sun, Moon, Languages, Menu, X } from "lucide-react";
import { AppTab, Translations } from "../types";

interface NavbarProps {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  lang: "en" | "hi" | "mr";
  setLang: (lang: "en" | "hi" | "mr") => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  translations: Translations;
  unreadAlertsCount: number;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  theme,
  toggleTheme,
  translations,
  unreadAlertsCount,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const tabs: { id: AppTab; label: string }[] = [
    { id: "home", label: translations.home },
    { id: "dashboard", label: translations.dashboard },
    { id: "weather", label: translations.weather },
    { id: "crop", label: translations.cropRecommend },
    { id: "fertilizer", label: translations.fertilizerRecommend },
    { id: "disease", label: translations.diseaseDetect },
    { id: "alerts", label: translations.alerts },
    { id: "reports", label: translations.reports },
    { id: "profile", label: translations.profile },
    { id: "admin", label: translations.admin },
    { id: "contact", label: translations.contact },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card shadow-sm border-b transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setCurrentTab("home")}
            id="nav-logo-btn"
          >
            <div className="bg-primary-500 text-white p-2 rounded-xl shadow-md flex items-center justify-center animate-pulse">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <span className="font-bold text-lg text-primary-600 tracking-tight block leading-tight">
                Kisan Alert
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-widest block uppercase">
                Smart Advisory
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex space-x-1 overflow-x-auto py-1 max-w-[60%]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  currentTab === tab.id
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/10 scale-105"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-500"
                }`}
                id={`nav-tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Unread Alerts Bell */}
            <button
              onClick={() => setCurrentTab("alerts")}
              className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Notifications"
              id="nav-bell-btn"
            >
              <Bell className="h-5 w-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Language Selector */}
            <div className="relative group flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1.5 border border-slate-200 dark:border-slate-700">
              <Languages className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                className="text-xs font-semibold bg-transparent border-none text-slate-700 dark:text-slate-200 outline-none pr-1 cursor-pointer"
                title="Select Language"
                id="nav-lang-select"
              >
                <option value="en" className="dark:bg-slate-800 dark:text-white">EN</option>
                <option value="hi" className="dark:bg-slate-800 dark:text-white">हिंदी</option>
                <option value="mr" className="dark:bg-slate-800 dark:text-white">मराठी</option>
              </select>
            </div>

            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Theme"
              id="nav-theme-btn"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-slate-600" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-400" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              id="nav-mobile-toggle"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg max-h-[80vh] overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                currentTab === tab.id
                  ? "bg-primary-500 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              id={`nav-mobile-tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
