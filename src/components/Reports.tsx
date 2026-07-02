import React from "react";
import { 
  FileText, 
  Printer, 
  Calendar, 
  Sprout, 
  Droplets, 
  ShieldAlert, 
  CheckCircle, 
  ArrowDownToLine 
} from "lucide-react";
import { FullState } from "../types";

interface ReportsProps {
  state: FullState;
}

export default function Reports({ state }: ReportsProps) {
  
  // Clean print triggers
  const handlePrint = () => {
    window.print();
  };

  const activeSensors = state.sensorHistory[state.sensorHistory.length - 1] || {
    moisture: 45,
    temperature: 26,
    humidity: 65,
    waterLevel: 80,
    pumpStatus: false
  };

  return (
    <div className="space-y-8 pb-16 text-left">
      
      {/* Header with Export Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Seasonal Farm Diagnostics & Reports
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Generate and export structured daily sensor registries, crop recommend audits, and plant pathology sheets.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 px-5 rounded-xl flex items-center space-x-1.5 transition-colors shadow-lg shadow-primary-500/10 cursor-pointer text-xs sm:text-sm"
          id="export-pdf-report-btn"
        >
          <Printer className="h-4 w-4" />
          <span>Export Report (PDF)</span>
        </button>
      </div>

      {/* Report Container for Screen & Print */}
      <div className="space-y-8 print:p-8 print:bg-white print:text-slate-900" id="farm-printable-report">
        
        {/* Print Only Header */}
        <div className="hidden print:flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-8">
          <div>
            <h1 className="text-2xl font-black uppercase text-slate-900">Kisan Alert Systems</h1>
            <p className="text-xs text-slate-500 font-mono">Precision Agriculture Telemetry Sheet</p>
          </div>
          <div className="text-right text-xs">
            <p><strong>Farmer Name:</strong> {state.profile.name}</p>
            <p><strong>Farm Coordinates:</strong> {state.profile.latitude}, {state.profile.longitude}</p>
            <p><strong>Report Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Executive Summary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
            <Droplets className="h-5 w-5 text-blue-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Current Moisture</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-100 font-mono">{activeSensors.moisture}%</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
            <Sprout className="h-5 w-5 text-emerald-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Assigned Crops</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-100 truncate inline-block max-w-[120px]">{state.profile.cropType}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-purple-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">History Logs</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-100 font-mono">{state.sensorHistory.length} Cycles</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Pathology Scans</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-100 font-mono">{state.diseaseLogs.length} Records</span>
            </div>
          </div>
        </div>

        {/* Detailed Sensor Telemetry Logs Table */}
        <div className="glass-card bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-primary-500" />
              <span>Historical Daily Sensor Feed</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-slate-400 font-mono border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3.5 pl-6">Timestamp (UTC)</th>
                  <th className="p-3.5">Soil Moisture</th>
                  <th className="p-3.5">Temperature</th>
                  <th className="p-3.5">Air Humidity</th>
                  <th className="p-3.5">Water Reservoir</th>
                  <th className="p-3.5 pr-6">Pump Relay status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {state.sensorHistory.slice(-10).reverse().map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-200 font-sans">
                    <td className="p-3.5 pl-6 font-mono text-[11px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3.5 font-bold font-mono text-blue-600">{log.moisture}%</td>
                    <td className="p-3.5 font-mono">{log.temperature}°C</td>
                    <td className="p-3.5 font-mono text-slate-400">{log.humidity}%</td>
                    <td className="p-3.5 font-bold font-mono text-cyan-600">{log.waterLevel}%</td>
                    <td className="p-3.5 pr-6 font-medium">
                      <span className={`inline-block px-2 py-0.5 rounded-full font-mono text-[10px] ${
                        log.pumpStatus 
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" 
                          : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                      }`}>
                        {log.pumpStatus ? "RUNNING" : "IDLE"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leaf Pathology Disease Log History */}
        <div className="glass-card bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="h-4.5 w-4.5 text-red-500" />
            <span>Pathology Scan Diagnoses Logs</span>
          </h3>

          {state.diseaseLogs.length === 0 ? (
            <p className="text-xs text-slate-400">No disease logs on record.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.diseaseLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="bg-slate-50 dark:bg-slate-900/40 p-4.5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-2 text-left"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white">{log.diseaseName}</h4>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{new Date(log.timestamp).toLocaleDateString()}</span>
                    </div>
                    <span className="bg-red-50 text-red-700 dark:bg-red-950/20 text-[10px] font-mono px-2 py-0.5 rounded-full">
                      {log.confidence}% Conf.
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                    <strong>Symptoms:</strong> {log.symptoms}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-100">
                    <strong>Treatment:</strong> {log.treatment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
