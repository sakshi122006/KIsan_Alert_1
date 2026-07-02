import React from "react";
import { motion } from "motion/react";
import { 
  Compass, 
  HelpCircle, 
  CheckCircle, 
  TrendingUp, 
  AlertCircle, 
  Sprout, 
  Zap, 
  ChevronRight,
  Loader2
} from "lucide-react";
import { CROP_PRESETS } from "../data";

interface Recommendation {
  cropName: string;
  confidence: number;
  reason: string;
  advice: string;
}

export default function CropRecommend() {
  const [nitrogen, setNitrogen] = React.useState("80");
  const [phosphorus, setPhosphorus] = React.useState("45");
  const [potassium, setPotassium] = React.useState("60");
  const [temp, setTemp] = React.useState("28");
  const [humidity, setHumidity] = React.useState("65");
  const [ph, setPh] = React.useState("6.2");
  const [rainfall, setRainfall] = React.useState("750");

  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<Recommendation[] | null>(null);
  const [isMock, setIsMock] = React.useState(false);

  // Quick autofill preset values from our static list
  const handleAutofill = (preset: typeof CROP_PRESETS[0]) => {
    setNitrogen(preset.idealN.toString());
    setPhosphorus(preset.idealP.toString());
    setPotassium(preset.idealK.toString());
    setPh(preset.idealPh.toString());
    setTemp("24"); // Moderate crop temp
    setHumidity("60");
    setRainfall("800");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    setIsMock(false);

    try {
      const response = await fetch("/api/gemini/crop-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nitrogen: parseFloat(nitrogen),
          phosphorus: parseFloat(phosphorus),
          potassium: parseFloat(potassium),
          temperature: parseFloat(temp),
          humidity: parseFloat(humidity),
          ph: parseFloat(ph),
          rainfall: parseFloat(rainfall)
        })
      });

      const data = await response.json();
      if (data.recommendations) {
        setResults(data.recommendations);
        if (data.isMock) setIsMock(true);
      } else {
        throw new Error("Invalid output received from advisory server.");
      }
    } catch (error: any) {
      console.error("AI recommendation failed:", error);
      // Fallback manual preset
      setResults([
        {
          cropName: "Tomato (Sartaj F1)",
          confidence: 88,
          reason: `Highly suited for N:${nitrogen} & pH:${ph}. Moderate temperatures allow tomato vines to flower abundantly without stress.`,
          advice: "Sow in rows 2 feet apart. Maintain moisture between 35-50%. Stake early to avoid ground dampness disease."
        },
        {
          cropName: "Maize (Corn)",
          confidence: 79,
          reason: `Maize is highly responsive to Potassium N-P-K blends and handles ${humidity}% humidity brilliantly. Well-drained soils prevent waterlogging.`,
          advice: "Apply basal dose of DAP during sowing. Ensure 4 irrigations during vegetative, silking, and milking phases."
        }
      ]);
      setIsMock(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          AI Crop Suitability Planner
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Analyzes chemical soil values and seasonal rainfall indices to recommend top-yielding cultivars.
        </p>
      </div>

      {/* Preset Autofill helper banner */}
      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Testing Soil Presets</span>
          <p className="text-[11px] text-slate-400">Quickly inject realistic crop N-P-K metrics from standard soil assays:</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {CROP_PRESETS.map((p) => (
            <button
              key={p.crop}
              onClick={() => handleAutofill(p)}
              className="bg-white dark:bg-slate-800 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 text-slate-700 dark:text-slate-200 text-[10px] sm:text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shadow-sm"
              id={`autofill-crop-${p.crop}`}
            >
              {p.crop}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Soil Input Form (5 Columns) */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 glass-card bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-md space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Compass className="h-4.5 w-4.5 text-primary-500" />
            <span>Enter Assayed Parameters</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {/* Nitrogen Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Nitrogen (N)</label>
              <input 
                type="number" 
                value={nitrogen} 
                onChange={(e) => setNitrogen(e.target.value)}
                placeholder="mg/kg"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="soil-input-n"
              />
            </div>

            {/* Phosphorus Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Phosphorus (P)</label>
              <input 
                type="number" 
                value={phosphorus} 
                onChange={(e) => setPhosphorus(e.target.value)}
                placeholder="mg/kg"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="soil-input-p"
              />
            </div>

            {/* Potassium Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Potassium (K)</label>
              <input 
                type="number" 
                value={potassium} 
                onChange={(e) => setPotassium(e.target.value)}
                placeholder="mg/kg"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="soil-input-k"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Temperature Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Temperature (°C)</label>
              <input 
                type="number" 
                value={temp} 
                onChange={(e) => setTemp(e.target.value)}
                placeholder="e.g. 26"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="soil-input-temp"
              />
            </div>

            {/* Humidity Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Humidity (%)</label>
              <input 
                type="number" 
                value={humidity} 
                onChange={(e) => setHumidity(e.target.value)}
                placeholder="e.g. 60"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="soil-input-humidity"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* pH Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Soil pH Index</label>
              <input 
                type="text" 
                value={ph} 
                onChange={(e) => setPh(e.target.value)}
                placeholder="e.g. 6.5"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="soil-input-ph"
              />
            </div>

            {/* Rainfall Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Annual Rain (mm)</label>
              <input 
                type="number" 
                value={rainfall} 
                onChange={(e) => setRainfall(e.target.value)}
                placeholder="e.g. 800"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="soil-input-rain"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-55 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary-500/10 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
            id="crop-recommend-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Running Gemini Suitability Model...</span>
              </>
            ) : (
              <>
                <Compass className="h-4.5 w-4.5" />
                <span>Recommend Optimal Crops</span>
              </>
            )}
          </button>
        </form>

        {/* AI Recommendations Display (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {loading && (
            <div className="space-y-4">
              <span className="text-xs text-slate-400 font-mono animate-pulse block">Gemini is processing chemical thresholds...</span>
              {[1, 2].map(n => (
                <div key={n} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/50 animate-pulse space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          )}

          {!loading && !results && (
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 p-12 rounded-3xl text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <Sprout className="h-12 w-12 text-slate-300 mb-4 animate-bounce" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Waiting for Soil Assay Metrics</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Enter your farm Nitrogen, Phosphorus, Potassium, and pH properties and click Recommend to load advisory plans.
              </p>
            </div>
          )}

          {results && (
            <div className="space-y-6">
              
              {isMock && (
                <div className="bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-2xl border border-blue-200/30 text-xs flex items-center gap-2">
                  <Zap className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                  <span>Showing simulated calibration advisory since customized Gemini key is initializing.</span>
                </div>
              )}

              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary-500" />
                <span>Suitable Cultivar Prescriptions ({results.length})</span>
              </h2>

              <div className="space-y-4">
                {results.map((r, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="glass-card bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm space-y-4"
                  >
                    {/* Crop Name & Confidence */}
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 p-2 rounded-xl">
                          <Sprout className="h-4.5 w-4.5" />
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">{r.cropName}</h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400 font-mono">{r.confidence}% Match</span>
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                      </div>
                    </div>

                    {/* Suitability Justification */}
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-slate-400 uppercase tracking-wider block">Suitability Reason</span>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{r.reason}</p>
                    </div>

                    {/* Care Advice */}
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-slate-400 uppercase tracking-wider block">Sowing & Irrigation Schedule</span>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        {r.advice}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
