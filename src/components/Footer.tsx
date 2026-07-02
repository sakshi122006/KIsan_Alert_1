import React from "react";
import { Sprout, Mail, Github, Heart, Shield, Globe } from "lucide-react";
import { AppTab, Translations } from "../types";

interface FooterProps {
  setCurrentTab: (tab: AppTab) => void;
  translations: Translations;
}

export default function Footer({ setCurrentTab, translations }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-500 text-white p-2 rounded-xl flex items-center justify-center">
                <Sprout className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">Kisan Alert</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering global farmers with localized IoT automation, real-time climate telemetry, and highly customized Generative AI soil and advisory models.
            </p>
            <div className="flex space-x-3 text-slate-400">
              <a href="#" className="hover:text-primary-400 transition-colors" title="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:support@kisanalert.org" className="hover:text-primary-400 transition-colors" title="Support Email">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors" title="Global Site">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Core Modules</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab("dashboard")} className="hover:text-primary-400 transition-colors cursor-pointer">
                  IoT Live Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("crop")} className="hover:text-primary-400 transition-colors cursor-pointer">
                  AI Crop Recommendation
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("disease")} className="hover:text-primary-400 transition-colors cursor-pointer">
                  Plant Disease Detection
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("reports")} className="hover:text-primary-400 transition-colors cursor-pointer">
                  Export Seasonal Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Educational / Project Context */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Engineering Context</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Developed as a smart agriculture final-year architecture combining <strong>ESP32 Microcontrollers</strong>, calibrated N-P-K assays, and <strong>Gemini 3.5 AI</strong>.
            </p>
            <span className="inline-block bg-slate-800 text-primary-400 text-[10px] font-mono font-medium px-2.5 py-1 rounded-full border border-slate-700">
              Tech Stack: Express + React + Tailwind
            </span>
          </div>

          {/* Emergency / Alerts Quick info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Agricultural Support</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Need on-site support? Connect instantly with Krishi Vigyan Kendra (KVK) soil extension specialists or download the advisory handbook.
            </p>
            <button
              onClick={() => setCurrentTab("contact")}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-300"
              id="footer-contact-btn"
            >
              Contact Support Desk
            </button>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-1">
            <span>&copy; {new Date().getFullYear()} Kisan Alert Systems Inc. Made with</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            <span>for global smart agriculture.</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors flex items-center space-x-1">
              <Shield className="h-3.5 w-3.5" />
              <span>Privacy Regulations</span>
            </a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
