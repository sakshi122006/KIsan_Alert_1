import React from "react";
import { motion } from "motion/react";
import { 
  Lock, 
  Megaphone, 
  Radio, 
  TrendingUp, 
  Users, 
  Cpu, 
  Send, 
  CheckCircle,
  Clock
} from "lucide-react";
import { FullState } from "../types";

interface AdminPanelProps {
  state: FullState;
  onPostAnnouncement: (msg: string, type: "info" | "warning" | "danger") => Promise<void>;
}

export default function AdminPanel({ state, onPostAnnouncement }: AdminPanelProps) {
  const [announcement, setAnnouncement] = React.useState("");
  const [type, setType] = React.useState<"info" | "warning" | "danger">("info");
  
  const [publishing, setPublishing] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.trim() || publishing) return;

    setPublishing(true);
    setSuccess(false);

    try {
      await onPostAnnouncement(announcement.trim(), type);
      setAnnouncement("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Post announcement failed:", error);
    } finally {
      setPublishing(false);
    }
  };

  // Compute stats averages
  const avgMoisture = Math.round(state.sensorHistory.reduce((sum, h) => sum + h.moisture, 0) / (state.sensorHistory.length || 1));
  const avgTemp = Math.round(state.sensorHistory.reduce((sum, h) => sum + h.temperature, 0) / (state.sensorHistory.length || 1));
  const avgWater = Math.round(state.sensorHistory.reduce((sum, h) => sum + h.waterLevel, 0) / (state.sensorHistory.length || 1));

  return (
    <div className="space-y-8 pb-16 text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Krishi Command Center
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          District-wide telemetry consolidation, node logs, and direct farmer emergency broadcasts.
        </p>
      </div>

      {/* Aggregate metrics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Metric Card */}
        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Soil Saturation</span>
            <span className="text-xs font-bold text-blue-600 font-mono">DISTRICT</span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{avgMoisture}% RH</p>
          <span className="text-[10px] text-slate-500 block">Calculated over {state.sensorHistory.length} logging epochs</span>
        </div>

        {/* Metric Card */}
        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Greenhouse Heat Index</span>
            <span className="text-xs font-bold text-red-600 font-mono">DISTRICT</span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{avgTemp}°C</p>
          <span className="text-[10px] text-slate-500 block">Calibrated ambient crop sensor nodes</span>
        </div>

        {/* Metric Card */}
        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Irrigation Reservoir Level</span>
            <span className="text-xs font-bold text-emerald-600 font-mono">DISTRICT</span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{avgWater}% Capacity</p>
          <span className="text-[10px] text-slate-500 block">Sufficient for 14 continuous sprinkler hours</span>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Broadcast Form (5 Columns) */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 glass-card bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-md space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <Megaphone className="h-4.5 w-4.5 text-primary-500" />
            <span>Emergency Advisory Broadcaster</span>
          </h3>

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 px-4 py-3 rounded-2xl border border-emerald-200/30 text-xs flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Broadcast dispatched to all farm feeds.</span>
            </motion.div>
          )}

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Severity classification</label>
            <select
              value={type}
              onChange={(e: any) => setType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500 cursor-pointer"
              id="admin-alert-type"
            >
              <option value="info">💡 Information Advisory</option>
              <option value="warning">⚠️ Yellow Weather Warning</option>
              <option value="danger">🚨 Red Disease/Frost Danger</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Message Content</label>
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="e.g. Subsidy forms for Solar pumps open. Extreme frost advisory for Nasik region grapes."
              rows={4}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500 font-sans"
              required
              id="admin-alert-message"
            />
          </div>

          <button
            type="submit"
            disabled={publishing || !announcement.trim()}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-55 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary-500/10 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
            id="admin-alert-submit-btn"
          >
            <Send className="h-4.5 w-4.5" />
            <span>{publishing ? "Publishing Broadcast..." : "Dispatch Broadcast"}</span>
          </button>
        </form>

        {/* System Logs (7 Columns) */}
        <div className="lg:col-span-7 glass-card bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <Cpu className="h-4.5 w-4.5 text-slate-500" />
              <span>Real-Time Controller Console</span>
            </h3>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded-full font-mono">
              COM3 SYNCED
            </span>
          </div>

          {/* Controller console lines */}
          <div className="bg-slate-950 rounded-2xl p-4 h-64 overflow-y-auto space-y-2.5 font-mono text-xs text-slate-300">
            <div className="flex items-start space-x-2">
              <span className="text-emerald-500">[INFO]</span>
              <span className="text-slate-400">ESP32 handshaking initiated. Syncing RTC...</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-500">[INFO]</span>
              <span className="text-slate-200">Soil moisture threshold calibration set: &lt; 35% trigger automations.</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-yellow-500">[WARN]</span>
              <span className="text-yellow-400/90">Moisture dropping at node MH-09. Triggering water level audit.</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-500">[INFO]</span>
              <span className="text-slate-300">Irrigation Relay: PUMP OFF state validated successfully.</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500">[SYS]</span>
              <span className="text-blue-300">Gemini models calibrated. Base advisory temperature set.</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-500">[INFO]</span>
              <span className="text-slate-400">Telemetry logs compiled to db.json. Backup completed.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
