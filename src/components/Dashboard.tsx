import React from "react";
import { motion } from "motion/react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line, 
  BarChart, 
  Bar 
} from "recharts";
import { 
  Droplets, 
  Thermometer, 
  CloudSun, 
  Tv, 
  Cpu, 
  AlertCircle, 
  Power, 
  Wrench, 
  Play, 
  Activity, 
  Bot, 
  CheckCircle2,
  Calendar
} from "lucide-react";
import { FullState, SensorLog, Alert, Translations } from "../types";
import AIChatBot from "./AIChatBot";

interface DashboardProps {
  state: FullState;
  updatePumpState: (autoMode: boolean, status: boolean) => Promise<void>;
  updateSimulatedSensors: (payload: {
    moisture: number;
    temperature: number;
    humidity: number;
    waterLevel: number;
    pumpStatus: boolean;
  }) => Promise<void>;
  translations: Translations;
  theme: "light" | "dark";
}

export default function Dashboard({
  state,
  updatePumpState,
  updateSimulatedSensors,
  translations,
  theme,
}: DashboardProps) {
  const latestSensor = state.sensorHistory[state.sensorHistory.length - 1] || {
    moisture: 45,
    temperature: 26,
    humidity: 65,
    waterLevel: 80,
    pumpStatus: false,
    timestamp: new Date().toISOString()
  };

  // State for manual simulator sliders
  const [simMoisture, setSimMoisture] = React.useState(latestSensor.moisture);
  const [simTemp, setSimTemp] = React.useState(latestSensor.temperature);
  const [simHumidity, setSimHumidity] = React.useState(latestSensor.humidity);
  const [simWaterLevel, setSimWaterLevel] = React.useState(latestSensor.waterLevel);
  const [simPump, setSimPump] = React.useState(latestSensor.pumpStatus);

  // Keep sliders synced if state updates externally
  React.useEffect(() => {
    setSimMoisture(latestSensor.moisture);
    setSimTemp(latestSensor.temperature);
    setSimHumidity(latestSensor.humidity);
    setSimWaterLevel(latestSensor.waterLevel);
    setSimPump(latestSensor.pumpStatus);
  }, [latestSensor]);

  // Handle IoT Simulator slider changes
  const handleSimulatorUpdate = async (
    moisture: number,
    temp: number,
    hum: number,
    level: number,
    pump: boolean
  ) => {
    let resolvedPump = pump;
    // Automated pump logic based on moisture if auto mode is ON
    if (state.pumpAutoMode) {
      if (moisture < 35) {
        resolvedPump = true; // Auto-trigger watering below 35% moisture
      } else if (moisture > 60) {
        resolvedPump = false; // Auto-shutoff above 60% moisture
      }
    }

    setSimMoisture(moisture);
    setSimTemp(temp);
    setSimHumidity(hum);
    setSimWaterLevel(level);
    setSimPump(resolvedPump);

    await updateSimulatedSensors({
      moisture,
      temperature: temp,
      humidity: hum,
      waterLevel: level,
      pumpStatus: resolvedPump
    });
  };

  // Auto trigger simulation ticks if no user action for a while
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Small random drifts in values
      const driftMoisture = Math.max(
        5,
        Math.min(
          95,
          simMoisture + 
          (simPump ? 4 : -2) + // moisture goes up if pump runs, down if not
          (Math.random() > 0.6 ? Math.floor(Math.random() * 3) - 1 : 0)
        )
      );

      const driftTemp = Math.max(
        15,
        Math.min(
          45,
          simTemp + (Math.random() > 0.7 ? Math.floor(Math.random() * 3) - 1 : 0)
        )
      );

      const driftHum = Math.max(
        30,
        Math.min(
          95,
          simHumidity + (Math.random() > 0.7 ? Math.floor(Math.random() * 3) - 1 : 0)
        )
      );

      const driftWater = Math.max(
        10,
        Math.min(
          100,
          simWaterLevel + 
          (simPump ? -1.5 : 0.5) + // reservoir depletes if watering, refills slowly
          (Math.random() > 0.8 ? Math.floor(Math.random() * 2) - 0.5 : 0)
        )
      );

      handleSimulatorUpdate(
        Math.round(driftMoisture),
        Math.round(driftTemp),
        Math.round(driftHum),
        Math.round(driftWater),
        simPump
      );
    }, 8000); // Drift telemetry every 8 seconds

    return () => clearInterval(interval);
  }, [simMoisture, simTemp, simHumidity, simWaterLevel, simPump, state.pumpAutoMode]);

  // Helper to format chart timestamp to HH:MM
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    } catch {
      return isoString;
    }
  };

  const chartData = state.sensorHistory.map(log => ({
    time: formatTime(log.timestamp),
    moisture: log.moisture,
    temperature: log.temperature,
    humidity: log.humidity,
    waterLevel: log.waterLevel,
    pump: log.pumpStatus ? 1 : 0
  }));

  // Status badges mapping
  const getMoistureStatus = (val: number) => {
    if (val < 30) return { label: "Critically Dry", color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" };
    if (val < 40) return { label: "Dry", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" };
    if (val <= 65) return { label: "Optimal", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" };
    return { label: "Saturated", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" };
  };

  const getTempStatus = (val: number) => {
    if (val < 18) return { label: "Cold Stress", color: "bg-sky-100 text-sky-700" };
    if (val <= 33) return { label: "Ideal Growth", color: "bg-emerald-100 text-emerald-700" };
    return { label: "Heat Stress", color: "bg-orange-100 text-orange-700" };
  };

  const getWaterLevelStatus = (val: number) => {
    if (val < 25) return { label: "Low Level", color: "bg-red-100 text-red-700 animate-pulse" };
    if (val < 75) return { label: "Normal", color: "bg-sky-100 text-sky-700" };
    return { label: "Full Capacity", color: "bg-emerald-100 text-emerald-700" };
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Upper Status Announcement Bar */}
      {state.announcements.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-300 px-5 py-4 rounded-2xl border border-yellow-200/50 dark:border-yellow-900/20 text-xs sm:text-sm font-medium flex items-center space-x-3 text-left"
        >
          <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" />
          <div className="flex-1 overflow-hidden">
            <span className="font-bold">Broadcast: </span>
            <span className="truncate inline-block max-w-full">{state.announcements[0]}</span>
          </div>
        </motion.div>
      )}

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Smart Farm Live Telemetry
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Farmer: <strong className="text-slate-700 dark:text-slate-200">{state.profile.name}</strong> • Location: <strong>{state.profile.location}</strong>
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 text-xs font-mono">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span className="text-slate-700 dark:text-slate-300">Live UTC: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Live Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Soil Moisture Card */}
        <div className="glass-card bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-52 text-left">
          <div className="flex justify-between items-start">
            <div className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 p-2 rounded-xl">
              <Droplets className="h-4.5 w-4.5" />
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getMoistureStatus(latestSensor.moisture).color}`}>
              {getMoistureStatus(latestSensor.moisture).label}
            </span>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{latestSensor.moisture}%</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{translations.soilMoisture}</p>
            </div>
            {/* Custom Circular Progress SVG */}
            <div className="relative w-12 h-12">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-200 dark:text-slate-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-blue-500" strokeDasharray={`${latestSensor.moisture}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-500">M01</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${latestSensor.moisture}%` }}></div>
          </div>
        </div>

        {/* Temperature Card */}
        <div className="glass-card bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-52 text-left">
          <div className="flex justify-between items-start">
            <div className="bg-orange-50 dark:bg-orange-950/40 text-orange-600 p-2 rounded-xl">
              <Thermometer className="h-4.5 w-4.5" />
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300`}>
              {getTempStatus(latestSensor.temperature).label}
            </span>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{latestSensor.temperature}°C</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{translations.temperature}</p>
            </div>
            {/* Custom Circular Progress SVG */}
            <div className="relative w-12 h-12">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-200 dark:text-slate-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-orange-500" strokeDasharray={`${(latestSensor.temperature / 50) * 100}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-500">T01</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full transition-all duration-500" style={{ width: `${(latestSensor.temperature / 50) * 100}%` }}></div>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="glass-card bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-52 text-left">
          <div className="flex justify-between items-start">
            <div className="bg-sky-50 dark:bg-sky-950/40 text-sky-600 p-2 rounded-xl">
              <CloudSun className="h-4.5 w-4.5" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300">
              Optimal
            </span>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{latestSensor.humidity}%</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{translations.humidity}</p>
            </div>
            {/* Custom Circular Progress SVG */}
            <div className="relative w-12 h-12">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-200 dark:text-slate-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-sky-400" strokeDasharray={`${latestSensor.humidity}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-500">H01</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-400 h-full transition-all duration-500" style={{ width: `${latestSensor.humidity}%` }}></div>
          </div>
        </div>

        {/* Water Tank Level Card */}
        <div className="glass-card bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-52 text-left">
          <div className="flex justify-between items-start">
            <div className="bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 p-2 rounded-xl">
              <Tv className="h-4.5 w-4.5" />
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getWaterLevelStatus(latestSensor.waterLevel).color}`}>
              {getWaterLevelStatus(latestSensor.waterLevel).label}
            </span>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{latestSensor.waterLevel}%</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{translations.tankLevel}</p>
            </div>
            {/* Custom Circular Progress SVG */}
            <div className="relative w-12 h-12">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-200 dark:text-slate-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-cyan-500" strokeDasharray={`${latestSensor.waterLevel}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-500">W01</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${latestSensor.waterLevel}%` }}></div>
          </div>
        </div>

      </div>

      {/* Main Grid: Telemetry Charts + IoT Simulator Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recharts Area - Telemetry History (8 Columns) */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          {/* Soil Moisture & Water Tank levels chart */}
          <div className="glass-card bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Moisture & Tank Level History</h3>
                <p className="text-[11px] text-slate-400">Real-time ESP32 calibrated feedback loops</p>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-semibold">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></span>
                  <span className="text-slate-600 dark:text-slate-300">Soil Moisture (%)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 bg-cyan-400 rounded-sm"></span>
                  <span className="text-slate-600 dark:text-slate-300">Water Tank (%)</span>
                </span>
              </div>
            </div>

            <div className="h-56 sm:h-72 w-full" id="moisture-history-chart">
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">No sensor feedback captured yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="tankGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#f1f5f9" : "#1f2937"} />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme === "light" ? "#fff" : "#111827", 
                        borderColor: theme === "light" ? "#e2e8f0" : "#1f2937",
                        borderRadius: "8px",
                        fontSize: "11px",
                        color: theme === "light" ? "#000" : "#fff"
                      }} 
                    />
                    <Area type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#moistureGrad)" name="Soil Moisture" />
                    <Area type="monotone" dataKey="waterLevel" stroke="#06b6d4" strokeWidth={1.5} fillOpacity={1} fill="url(#tankGrad)" name="Water Level" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Temperature & Humidity Trend */}
          <div className="glass-card bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Temperature & Climate Trend</h3>
                <p className="text-[11px] text-slate-400">Atmospheric humidity index correlation</p>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-semibold">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></span>
                  <span className="text-slate-600 dark:text-slate-300">Temp (°C)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 bg-sky-400 rounded-sm"></span>
                  <span className="text-slate-600 dark:text-slate-300">Humidity (%)</span>
                </span>
              </div>
            </div>

            <div className="h-56 sm:h-72 w-full" id="temp-humidity-chart">
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">No climate recordings.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#f1f5f9" : "#1f2937"} />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme === "light" ? "#fff" : "#111827", 
                        borderColor: theme === "light" ? "#e2e8f0" : "#1f2937",
                        borderRadius: "8px",
                        fontSize: "11px",
                        color: theme === "light" ? "#000" : "#fff"
                      }} 
                    />
                    <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} dot={false} name="Temp (°C)" />
                    <Line type="monotone" dataKey="humidity" stroke="#38bdf8" strokeWidth={1.5} dot={false} name="Humidity (%)" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>

        {/* Pump Status & IoT Simulator Sidebar Panel (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Valve Controls Card */}
          <div className="glass-card bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
              <Cpu className="h-4 w-4 text-primary-500" />
              <span>Pump & Automation Center</span>
            </h3>

            <div className="space-y-4">
              
              {/* Pump status light */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-lg ${latestSensor.pumpStatus ? "bg-emerald-100 text-emerald-600 animate-pulse" : "bg-slate-200 text-slate-400 dark:bg-slate-800"}`}>
                    <Power className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Valve Controller-01</h4>
                    <span className="text-[9px] font-mono text-slate-400">
                      State: {latestSensor.pumpStatus ? "WATERING ON" : "IDLE OFF"}
                    </span>
                  </div>
                </div>
                <span className={`w-3 h-3 rounded-full ring-4 ${latestSensor.pumpStatus ? "bg-emerald-500 ring-emerald-100" : "bg-slate-300 ring-slate-100 dark:bg-slate-700 dark:ring-slate-800"}`}></span>
              </div>

              {/* Automatic Mode Toggle switch */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-800 dark:text-white">{translations.autoMode}</h4>
                  <p className="text-[9px] text-slate-400">Pumps trigger based on moisture threshold</p>
                </div>
                <button
                  onClick={() => updatePumpState(!state.pumpAutoMode, latestSensor.pumpStatus)}
                  className={`w-10 h-5.5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${state.pumpAutoMode ? "bg-primary-500" : "bg-slate-300 dark:bg-slate-700"}`}
                  id="pump-auto-mode-toggle"
                >
                  <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform duration-300 ${state.pumpAutoMode ? "translate-x-4.5" : "translate-x-0"}`}></div>
                </button>
              </div>

              {/* Manual toggle override buttons */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Manual Overrides</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={state.pumpAutoMode}
                    onClick={() => updatePumpState(false, true)}
                    className={`py-1.5 px-2.5 rounded-lg font-semibold text-[11px] transition-all flex items-center justify-center space-x-1 border ${
                      state.pumpAutoMode 
                        ? "opacity-40 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200" 
                        : latestSensor.pumpStatus
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer"
                    }`}
                    id="manual-pump-on-btn"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>ON</span>
                  </button>
                  
                  <button
                    disabled={state.pumpAutoMode}
                    onClick={() => updatePumpState(false, false)}
                    className={`py-1.5 px-2.5 rounded-lg font-semibold text-[11px] transition-all flex items-center justify-center space-x-1 border ${
                      state.pumpAutoMode 
                        ? "opacity-40 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200" 
                        : !latestSensor.pumpStatus
                          ? "bg-slate-800 text-white border-slate-800 shadow-sm dark:bg-slate-700"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer"
                    }`}
                    id="manual-pump-off-btn"
                  >
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block"></span>
                    <span>OFF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive ESP32 IoT Simulator Card */}
          <div className="glass-card bg-slate-950 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-sm text-left">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-primary-400 mb-3 flex items-center space-x-1.5">
              <Activity className="h-4 w-4 text-primary-400 animate-pulse" />
              <span>Interactive ESP32 Simulator</span>
            </h3>

            <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">
              Tweak agricultural sliders to simulate actual field degradation. Watch charts update and see how Kisan Alert triggers alerts and automated watering lines.
            </p>

            <div className="space-y-3.5">
              {/* Moisture Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span>Soil Moisture:</span>
                  <span className="text-blue-400 font-bold">{simMoisture}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="95" 
                  value={simMoisture}
                  onChange={(e) => handleSimulatorUpdate(parseInt(e.target.value), simTemp, simHumidity, simWaterLevel, simPump)}
                  className="w-full accent-blue-500 cursor-pointer bg-slate-800 h-1.5 rounded-lg appearance-none"
                  id="simulator-moisture-slider"
                />
                <span className="text-[9px] text-slate-500 block">Critical Dry: &lt;30% • Ideal Tomato: 35%-60%</span>
              </div>

              {/* Temp Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span>Temperature:</span>
                  <span className="text-orange-400 font-bold">{simTemp}°C</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="48" 
                  value={simTemp}
                  onChange={(e) => handleSimulatorUpdate(simMoisture, parseInt(e.target.value), simHumidity, simWaterLevel, simPump)}
                  className="w-full accent-orange-500 cursor-pointer bg-slate-800 h-1.5 rounded-lg appearance-none"
                  id="simulator-temp-slider"
                />
              </div>

              {/* Water reservoir tank Level */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span>Water Tank Level:</span>
                  <span className="text-cyan-400 font-bold">{simWaterLevel}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={simWaterLevel}
                  onChange={(e) => handleSimulatorUpdate(simMoisture, simTemp, simHumidity, parseInt(e.target.value), simPump)}
                  className="w-full accent-cyan-500 cursor-pointer bg-slate-800 h-1.5 rounded-lg appearance-none"
                  id="simulator-water-slider"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Persistent Kisan Mitra - Bottom Chat Area */}
      <AIChatBot currentSensors={latestSensor} theme={theme} translations={translations} />

    </div>
  );
}
