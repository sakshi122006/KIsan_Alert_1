import React from "react";
import { motion } from "motion/react";
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  Sun, 
  CloudRain, 
  CloudLightning, 
  Search, 
  AlertTriangle 
} from "lucide-react";
import { Translations } from "../types";

interface WeatherProps {
  translations: Translations;
  theme: "light" | "dark";
}

interface ForecastDay {
  day: string;
  temp: number;
  humidity: number;
  condition: "Sunny" | "Rainy" | "Cloudy" | "Stormy";
  rainProb: number;
}

export default function Weather({ translations, theme }: WeatherProps) {
  const [city, setCity] = React.useState("Nashik");
  const [loading, setLoading] = React.useState(false);

  // Weather forecasts presets for simulation
  const defaultForecasts: Record<string, { current: any; forecast: ForecastDay[] }> = {
    Nashik: {
      current: {
        temp: 29,
        humidity: 62,
        wind: 14,
        condition: "Cloudy",
        rainProb: 45,
        uvIndex: 6,
        alert: "Light afternoon showers expected. Ideal time to adjust drip lines."
      },
      forecast: [
        { day: "Today", temp: 29, humidity: 62, condition: "Cloudy", rainProb: 45 },
        { day: "Thu", temp: 28, humidity: 70, condition: "Rainy", rainProb: 80 },
        { day: "Fri", temp: 26, humidity: 85, condition: "Stormy", rainProb: 95 },
        { day: "Sat", temp: 27, humidity: 78, condition: "Rainy", rainProb: 70 },
        { day: "Sun", temp: 30, humidity: 55, condition: "Sunny", rainProb: 15 },
        { day: "Mon", temp: 31, humidity: 50, condition: "Sunny", rainProb: 10 },
        { day: "Tue", temp: 32, humidity: 48, condition: "Sunny", rainProb: 5 }
      ]
    },
    Pune: {
      current: {
        temp: 27,
        humidity: 68,
        wind: 16,
        condition: "Rainy",
        rainProb: 80,
        uvIndex: 4,
        alert: "Yellow Alert: Severe convective thunderstorms expected in localized pockets."
      },
      forecast: [
        { day: "Today", temp: 27, humidity: 68, condition: "Rainy", rainProb: 80 },
        { day: "Thu", temp: 25, humidity: 88, condition: "Stormy", rainProb: 90 },
        { day: "Fri", temp: 26, humidity: 80, condition: "Rainy", rainProb: 75 },
        { day: "Sat", temp: 28, humidity: 72, condition: "Cloudy", rainProb: 40 },
        { day: "Sun", temp: 29, humidity: 60, condition: "Cloudy", rainProb: 25 },
        { day: "Mon", temp: 30, humidity: 55, condition: "Sunny", rainProb: 15 },
        { day: "Tue", temp: 31, humidity: 50, condition: "Sunny", rainProb: 10 }
      ]
    },
    Nagpur: {
      current: {
        temp: 38,
        humidity: 40,
        wind: 12,
        condition: "Sunny",
        rainProb: 5,
        uvIndex: 9,
        alert: "Orange Alert: Extreme dry heat waves. Ensure irrigation reservoirs are full."
      },
      forecast: [
        { day: "Today", temp: 38, humidity: 40, condition: "Sunny", rainProb: 5 },
        { day: "Thu", temp: 39, humidity: 38, condition: "Sunny", rainProb: 0 },
        { day: "Fri", temp: 40, humidity: 35, condition: "Sunny", rainProb: 0 },
        { day: "Sat", temp: 37, humidity: 45, condition: "Cloudy", rainProb: 20 },
        { day: "Sun", temp: 35, humidity: 55, condition: "Cloudy", rainProb: 30 },
        { day: "Mon", temp: 33, humidity: 60, condition: "Rainy", rainProb: 65 },
        { day: "Tue", temp: 34, humidity: 58, condition: "Cloudy", rainProb: 40 }
      ]
    }
  };

  const currentWeatherData = defaultForecasts[city] || defaultForecasts["Nashik"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  };

  // Condition icons matching
  const getWeatherIcon = (condition: string, sizeClass = "h-8 w-8") => {
    switch (condition) {
      case "Sunny": return <Sun className={`${sizeClass} text-yellow-500`} />;
      case "Rainy": return <CloudRain className={`${sizeClass} text-blue-500`} />;
      case "Cloudy": return <CloudSun className={`${sizeClass} text-slate-400`} />;
      case "Stormy": return <CloudLightning className={`${sizeClass} text-purple-500`} />;
      default: return <Sun className={`${sizeClass} text-yellow-500`} />;
    }
  };

  return (
    <div className="space-y-8 pb-16 text-left">
      
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Agricultural Weather Radar
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Localized humidity index and microclimate evapotranspiration predictions
          </p>
        </div>

        {/* City Switcher Form */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative group bg-slate-100 dark:bg-slate-800 rounded-xl p-1.5 border border-slate-200 dark:border-slate-700 flex items-center">
            <Search className="h-4 w-4 text-slate-500 mr-2" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="text-xs sm:text-sm font-semibold bg-transparent border-none text-slate-700 dark:text-slate-200 outline-none pr-3 cursor-pointer"
              title="Select District"
              id="weather-city-select"
            >
              <option value="Nashik" className="dark:bg-slate-800 dark:text-white">Nashik District (Grapes Hub)</option>
              <option value="Pune" className="dark:bg-slate-800 dark:text-white">Pune District (Sugar Belt)</option>
              <option value="Nagpur" className="dark:bg-slate-800 dark:text-white">Nagpur District (Citrus Belt)</option>
            </select>
          </div>
        </form>
      </div>

      {/* Extreme Weather Banners */}
      {currentWeatherData.current.alert && (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`px-5 py-4 rounded-2xl border flex items-start gap-3 ${
            currentWeatherData.current.condition === "Stormy" || currentWeatherData.current.temp > 37
              ? "bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border-red-200/50"
              : "bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 border-blue-200/50"
          }`}
        >
          <AlertTriangle className={`h-5 w-5 shrink-0 ${
            currentWeatherData.current.condition === "Stormy" || currentWeatherData.current.temp > 37
              ? "text-red-500"
              : "text-blue-500"
          }`} />
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold">{translations.weatherAlertTitle}</h4>
            <p className="text-xs leading-relaxed">{currentWeatherData.current.alert}</p>
          </div>
        </motion.div>
      )}

      {/* Main Grid: Current Detailed Stats + 7-Day Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Card: Current Detailed Status (5 Columns) */}
        <div className="lg:col-span-5 glass-card bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-md space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Current Weather</h3>
              <p className="text-xs text-slate-400">Station Code: IN-MH-{city.substring(0,3).toUpperCase()}</p>
            </div>
            <span className="text-xs font-mono font-medium bg-slate-100 dark:bg-slate-900 text-slate-500 px-3 py-1 rounded-xl">
              UPDATED SECONDS AGO
            </span>
          </div>

          <div className="flex items-center gap-6 py-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex items-center justify-center shadow-inner">
              {getWeatherIcon(currentWeatherData.current.condition, "h-16 w-16")}
            </div>
            <div>
              <span className="text-5xl font-extrabold text-slate-900 dark:text-white font-mono">{currentWeatherData.current.temp}°C</span>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">{currentWeatherData.current.condition}</p>
            </div>
          </div>

          {/* Microclimatic telemetries */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="bg-sky-50 dark:bg-sky-950/40 text-sky-600 p-2.5 rounded-xl">
                <Droplets className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">{translations.humidity}</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white font-mono">{currentWeatherData.current.humidity}%</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 p-2.5 rounded-xl">
                <Wind className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Wind Velocity</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white font-mono">{currentWeatherData.current.wind} km/h</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 p-2.5 rounded-xl">
                <Sun className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">UV Index</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white font-mono">{currentWeatherData.current.uvIndex} (Medium)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 p-2.5 rounded-xl">
                <CloudRain className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">{translations.rainProb}</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white font-mono">{currentWeatherData.current.rainProb}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: 7-Day Forecast Breakdown (7 Columns) */}
        <div className="lg:col-span-7 glass-card bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-md space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">7-Day Agricultural Outlook</h3>
            <p className="text-xs text-slate-400">Weekly weather parameters for sowing and crop shielding schedules</p>
          </div>

          <div className="space-y-3">
            {currentWeatherData.forecast.map((fc, index) => (
              <div 
                key={index}
                className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                {/* Day */}
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 w-20">
                  {fc.day}
                </span>

                {/* Condition Icon */}
                <div className="flex items-center gap-2 w-28">
                  {getWeatherIcon(fc.condition, "h-5 w-5")}
                  <span className="text-xs text-slate-500 dark:text-slate-400">{fc.condition}</span>
                </div>

                {/* Rain Probability Badge */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                  <CloudRain className="h-3.5 w-3.5" />
                  <span className="font-mono">{fc.rainProb}%</span>
                </div>

                {/* Temp & Humidity */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-800 dark:text-slate-200 font-bold font-mono text-sm">{fc.temp}°C</span>
                  <span className="text-slate-400 font-mono">H: {fc.humidity}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
