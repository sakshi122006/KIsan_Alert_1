import React from "react";
import { motion } from "motion/react";
import { 
  Users, 
  Phone, 
  Mail, 
  Briefcase, 
  HelpCircle, 
  Send, 
  CheckCircle, 
  Calendar,
  MessageSquare
} from "lucide-react";
import { EXTENSION_OFFICERS } from "../data";

export default function Contact() {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [topic, setTopic] = React.useState("NPK");
  const [message, setMessage] = React.useState("");
  
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName("");
      setPhone("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-16 text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Krishi Extension Help Desk
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Connect directly with district soil laboratories, government subsidy officers, and ESP32 technical experts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Officers directory (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-primary-500" />
            <span>Official District Officers ({EXTENSION_OFFICERS.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXTENSION_OFFICERS.map((officer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Avatar or Badge */}
                  <div className="flex justify-between items-start">
                    <div className="bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-300 font-extrabold text-xs h-9 w-9 rounded-xl flex items-center justify-center border border-primary-100 dark:border-primary-900/50">
                      KA
                    </div>
                    <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded-full uppercase">
                      GOVT APPROVED
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">{officer.name}</h4>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5 leading-snug">{officer.role}</p>
                  </div>

                  {/* Specialty */}
                  <div className="text-[11px] bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Specialty: <strong>{officer.specialty}</strong></span>
                  </div>
                </div>

                {/* Quick actions anchors */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={`tel:${officer.phone}`}
                    className="bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-[10px] sm:text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`mailto:${officer.email}`}
                    className="bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-[10px] sm:text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Mail className="h-3.5 w-3.5 text-blue-500" />
                    <span>Email</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Submit query ticket form (5 Columns) */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="glass-card bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-md space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <HelpCircle className="h-4.5 w-4.5 text-primary-500" />
              <span>Raise Advisory Support Request</span>
            </h3>

            {submitted && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 px-4 py-3 rounded-2xl border border-emerald-200/30 text-xs flex items-center gap-2 font-semibold"
              >
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>Ticket submitted! Dr. Arvind Kulkarni has been notified.</span>
              </motion.div>
            )}

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Your Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Patil"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="ticket-input-name"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Your Phone Number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="ticket-input-phone"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Query Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500 cursor-pointer"
                id="ticket-topic-select"
              >
                <option value="NPK">Soil Chemistry (N-P-K)</option>
                <option value="Drip">Drip Irrigation Subsidy schemes</option>
                <option value="ESP32">ESP32 & Sensors Installation</option>
                <option value="Blights">Pathogen / Leaf Spots Identification</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Detailed message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain soil tests details or ESP32 connection issues..."
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500 font-sans"
                required
                id="ticket-input-message"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-55 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary-500/10 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              id="ticket-submit-btn"
            >
              <Send className="h-4.5 w-4.5" />
              <span>{submitting ? "Filing Ticket..." : "Submit Ticket to Extension Officer"}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
