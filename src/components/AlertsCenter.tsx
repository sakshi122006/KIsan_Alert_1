import React from "react";
import { motion } from "motion/react";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Trash2, 
  AlertCircle, 
  CheckCheck,
  Calendar
} from "lucide-react";
import { Alert } from "../types";

interface AlertsCenterProps {
  alerts: Alert[];
  onDismissAlert: (id: string) => Promise<void>;
}

export default function AlertsCenter({ alerts, onDismissAlert }: AlertsCenterProps) {
  const handleDismissAll = async () => {
    await onDismissAlert("all");
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case "danger":
        return {
          bg: "bg-red-50 dark:bg-red-950/20",
          border: "border-red-200/50 dark:border-red-900/30",
          text: "text-red-800 dark:text-red-300",
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        };
      case "warning":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-950/20",
          border: "border-yellow-200/50 dark:border-yellow-900/30",
          text: "text-yellow-800 dark:text-yellow-300",
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
        };
      case "success":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/20",
          border: "border-emerald-200/50 dark:border-emerald-900/30",
          text: "text-emerald-800 dark:text-emerald-300",
          icon: <CheckCircle className="h-5 w-5 text-emerald-500" />
        };
      case "info":
      default:
        return {
          bg: "bg-blue-50 dark:bg-blue-950/20",
          border: "border-blue-200/50 dark:border-blue-900/30",
          text: "text-blue-800 dark:text-blue-300",
          icon: <Bell className="h-5 w-5 text-blue-500" />
        };
    }
  };

  return (
    <div className="space-y-8 pb-16 text-left">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Farm Alert Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Real-time threshold warnings and automated irrigation notifications
          </p>
        </div>

        {alerts.some(a => !a.read) && (
          <button
            onClick={handleDismissAll}
            className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5 cursor-pointer shadow-sm"
            id="clear-all-alerts-btn"
          >
            <CheckCheck className="h-4 w-4 text-emerald-500" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800 p-16 rounded-3xl text-center flex flex-col items-center justify-center">
          <CheckCircle className="h-12 w-12 text-emerald-500 mb-4 animate-bounce" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Your Farm is Fully Secured</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            All soil sensors, water tanks, and weather logs are operating inside perfect optimal bounds.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const style = getAlertStyle(alert.type);
            return (
              <motion.div
                layout
                key={alert.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4.5 rounded-3xl border flex items-start gap-3.5 transition-all relative ${style.bg} ${style.border} ${
                  alert.read ? "opacity-60 saturate-50" : "shadow-sm"
                }`}
              >
                {/* Severity Icon */}
                <div className="shrink-0 pt-0.5">
                  {style.icon}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1 text-xs">
                  <div className="flex flex-wrap items-center gap-x-2 text-slate-400 font-mono text-[10px]">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 inline-block" />
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                    {!alert.read && (
                      <span className="bg-primary-500 text-white font-sans text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase animate-pulse">
                        New
                      </span>
                    )}
                  </div>
                  <p className={`text-xs sm:text-sm font-medium ${style.text} leading-relaxed`}>
                    {alert.message}
                  </p>
                </div>

                {/* Dismiss button */}
                {!alert.read && (
                  <button
                    onClick={() => onDismissAlert(alert.id)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-full cursor-pointer"
                    title="Dismiss alert"
                    id={`dismiss-alert-${alert.id}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
