import React from "react";
import { motion } from "motion/react";
import { 
  Sprout, 
  Droplets, 
  CloudSun, 
  Compass, 
  ShieldAlert, 
  Waves, 
  Bot, 
  Sprout as FertilizerIcon, 
  TrendingUp, 
  ArrowRight, 
  Activity, 
  Users, 
  Database 
} from "lucide-react";
import { AppTab, Translations } from "../types";
import { FEATURE_CARDS, PROBLEMS_AND_SOLUTIONS } from "../data";

interface HomeProps {
  setCurrentTab: (tab: AppTab) => void;
  translations: Translations;
  theme: "light" | "dark";
}

export default function Home({ setCurrentTab, translations, theme }: HomeProps) {
  // Map string names to Lucide icons
  const renderIcon = (name: string, className: string) => {
    switch (name) {
      case "Droplets": return <Droplets className={className} />;
      case "CloudSun": return <CloudSun className={className} />;
      case "Compass": return <Compass className={className} />;
      case "ShieldAlert": return <ShieldAlert className={className} />;
      case "Waves": return <Waves className={className} />;
      case "Bot": return <Bot className={className} />;
      case "Sprout": return <FertilizerIcon className={className} />;
      case "TrendingUp": return <TrendingUp className={className} />;
      default: return <Sprout className={className} />;
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100/30 dark:from-slate-900 dark:to-primary-950/20 py-16 sm:py-24 transition-colors duration-300 rounded-3xl mt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-primary-100/50 dark:border-primary-900/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full border border-primary-200 dark:border-primary-900/50 text-xs font-semibold"
            >
              <Activity className="h-4 w-4 text-primary-500 animate-spin" />
              <span>IoT & Generative AI Precision Agriculture</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              Kisan Alert – <span className="text-primary-500">Smart Water</span> & Crop System
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-300 font-sans leading-relaxed max-w-2xl"
            >
              {translations.tagline}. Integrating ESP32 moisture telemetry with intelligent crop planning, predictive weather modeling, and immediate leaf disease diagnostics powered by Gemini AI.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <button
                onClick={() => setCurrentTab("dashboard")}
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3.5 rounded-2xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 flex items-center space-x-2 text-sm md:text-base cursor-pointer transform hover:-translate-y-0.5"
                id="hero-get-started-btn"
              >
                <span>{translations.getStarted}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setCurrentTab("dashboard")}
                className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-semibold px-6 py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 flex items-center space-x-2 text-sm md:text-base cursor-pointer"
                id="hero-dashboard-btn"
              >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <span>{translations.liveDashboard}</span>
              </button>
            </motion.div>
          </div>

          {/* Hero Right Visual Column - Animated Farm Graphic */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              className="relative w-full max-w-md"
            >
              {/* Decorative Glows */}
              <div className="absolute -inset-1 rounded-full bg-primary-400/20 dark:bg-primary-500/10 blur-3xl opacity-50"></div>
              
              <div className="relative glass-card bg-white/90 dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl space-y-6">
                
                {/* Simulated Device Node Graphic */}
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/80 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 dark:bg-primary-950 p-2 rounded-xl text-primary-500">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-white">ESP32 Node-01</h3>
                      <p className="text-[10px] text-slate-400 font-mono">Status: Connected (2.4GHz)</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full">
                    98.2% uptime
                  </span>
                </div>

                {/* Simulated telemetry loops */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50/50 dark:bg-slate-900/50 p-3 rounded-2xl border border-blue-100/30 dark:border-blue-900/10">
                    <div className="flex justify-between text-blue-600 mb-1">
                      <span className="text-xs font-semibold">Moisture</span>
                      <Droplets className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xl font-bold text-slate-800 dark:text-white">42%</span>
                    <p className="text-[9px] text-emerald-600 mt-1">Healthy Zone</p>
                  </div>

                  <div className="bg-orange-50/50 dark:bg-slate-900/50 p-3 rounded-2xl border border-orange-100/30 dark:border-orange-900/10">
                    <div className="flex justify-between text-orange-600 mb-1">
                      <span className="text-xs font-semibold">Temp</span>
                      <CloudSun className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xl font-bold text-slate-800 dark:text-white">28.4°C</span>
                    <p className="text-[9px] text-slate-400 mt-1">Humidity: 68%</p>
                  </div>
                </div>

                {/* Animated progress ring simulating auto-irrigation status */}
                <div className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Valve Relays</p>
                      <p className="text-[10px] text-slate-400">Pump Status: Standby</p>
                    </div>
                  </div>
                  <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-xl">
                    AUTO MODE
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Comprehensive Smart Farming Modules
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Everything you need to automate watering, optimize crop fertilizers, diagnose disease blights, and consult agricultural intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURE_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-md hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between group cursor-pointer"
              onClick={() => {
                // Route smartly to matching screens
                if (card.title.includes("Irrigation") || card.title.includes("Tank")) {
                  setCurrentTab("dashboard");
                } else if (card.title.includes("Weather")) {
                  setCurrentTab("weather");
                } else if (card.title.includes("Crop")) {
                  setCurrentTab("crop");
                } else if (card.title.includes("Disease")) {
                  setCurrentTab("disease");
                } else if (card.title.includes("Fertilizer")) {
                  setCurrentTab("fertilizer");
                } else if (card.title.includes("Price") || card.title.includes("Advisory")) {
                  setCurrentTab("dashboard"); // The Chat Mitra works on Dashboard
                }
              }}
              id={`home-feature-${i}`}
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {renderIcon(card.iconName, "h-6 w-6")}
                </div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
              <div className="flex items-center space-x-1 text-primary-500 font-semibold text-xs mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Access Module</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section: Explaining Agriculture Problems & AI Solutions */}
      <section className="bg-slate-100 dark:bg-slate-900/60 py-16 transition-colors duration-300 rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-slate-200/50 dark:border-slate-800/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* About Left Text */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-primary-500 font-semibold tracking-wider uppercase text-xs">Why Kisan Alert?</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Solving Critical Agricultural Inefficiencies with Deep Tech
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Global agriculture is experiencing extreme shifts. Blind, unseasonal weather spells, soil acidification, and late blight diagnoses lead to massive economic failures. 
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Kisan Alert bridges this exact diagnostic gap. By networking physical soil sensors, tank level feeds, and high-frequency weather models with <strong>Gemini 3.5 Generative AI</strong>, we create a fully autonomous, predictive ecosystem that protects crops, conserves water, and safeguards farmer livelihoods.
            </p>

            <div className="flex items-center space-x-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-primary-500">60%</p>
                <p className="text-[10px] text-slate-400 font-medium">Water Saved</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-emerald-500">25%+</p>
                <p className="text-[10px] text-slate-400 font-medium">Yield Increase</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-accent-yellow">100%</p>
                <p className="text-[10px] text-slate-400 font-medium">AI Advisory Access</p>
              </div>
            </div>
          </div>

          {/* About Right Problems & Solutions List */}
          <div className="lg:col-span-7 space-y-4 text-left">
            {PROBLEMS_AND_SOLUTIONS.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
              >
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                      Problem: {item.problem}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {item.stat}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-sans mt-2">
                    <strong className="text-primary-500 font-semibold">Kisan Solution:</strong> {item.solution}
                  </p>
                </div>
                <div className="flex items-center self-start sm:self-center bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-300 px-3 py-1.5 rounded-xl border border-primary-100/30 dark:border-primary-900/10 text-xs font-bold">
                  Resolved
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Trust Quote / CTA */}
      <section className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <blockquote className="text-lg sm:text-2xl font-sans italic text-slate-800 dark:text-slate-200 leading-relaxed">
          "The combination of automated soil pump control and real-time advisory alerts completely changed our vineyard operations. We reduced water tanker bills by 40% and immediately stopped powdery mildew in tomatoes before it took root."
        </blockquote>
        <div className="flex items-center justify-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-800 font-bold border border-white">
            RP
          </div>
          <div className="text-left text-xs">
            <p className="font-bold text-slate-800 dark:text-white">Rajesh Patil</p>
            <p className="text-slate-400">Grape Farmer, Nashik, Maharashtra</p>
          </div>
        </div>
      </section>
    </div>
  );
}
