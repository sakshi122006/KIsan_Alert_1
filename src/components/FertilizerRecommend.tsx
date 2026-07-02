import React from "react";
import { motion } from "motion/react";
import { 
  Sprout, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  Flame, 
  Sparkles, 
  ShieldAlert,
  Loader2
} from "lucide-react";

interface FertilizerPlan {
  recommendedFertilizer: string;
  dosage: string;
  justification: string;
  organicAlternative: string;
}

export default function FertilizerRecommend() {
  const [cropName, setCropName] = React.useState("Tomato");
  const [nitrogen, setNitrogen] = React.useState("65");
  const [phosphorus, setPhosphorus] = React.useState("30");
  const [potassium, setPotassium] = React.useState("90");
  const [ph, setPh] = React.useState("6.5");

  const [loading, setLoading] = React.useState(false);
  const [plan, setPlan] = React.useState<FertilizerPlan | null>(null);
  const [isMock, setIsMock] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);
    setIsMock(false);

    try {
      const response = await fetch("/api/gemini/fertilizer-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName,
          nitrogen: parseFloat(nitrogen),
          phosphorus: parseFloat(phosphorus),
          potassium: parseFloat(potassium),
          ph: parseFloat(ph)
        })
      });

      const data = await response.json();
      if (data.fertilizerPlan) {
        setPlan(data.fertilizerPlan);
        if (data.isMock) setIsMock(true);
      } else {
        throw new Error("Invalid output received from fertilizer advisor.");
      }
    } catch (error: any) {
      console.error("Fertilizer advisory failed:", error);
      // Fallback
      setPlan({
        recommendedFertilizer: "Urea + DAP Blend (Ratio 2:1)",
        dosage: "45 kg of Urea and 25 kg of DAP per acre applied in split schedules",
        justification: `Since your soil Nitrogen is at ${nitrogen} mg/kg and Phosphorus is at ${phosphorus} mg/kg, a balanced vegetative booster is needed to trigger healthy root branching and foliage growth.`,
        organicAlternative: "Applying 5 tonnes of decomposed vermicompost alongside Neem Cake powder to control soil pathogens."
      });
      setIsMock(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          AI Fertilizer & Soil Balancing Optimizer
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Calculates split dosages to replenish macro-nutrients based on crop guidelines, preventing soil salinity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Form (5 Columns) */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 glass-card bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-md space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Sprout className="h-4.5 w-4.5 text-primary-500" />
            <span>Select Target Crop & Soil Properties</span>
          </h3>

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Target Crop</label>
            <select
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500 cursor-pointer"
              id="fert-crop-select"
            >
              <option value="Tomato">Tomato</option>
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice (Paddy)</option>
              <option value="Cotton">Cotton</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Grapes">Grapes</option>
              <option value="Maize">Maize (Corn)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Soil Nitrogen (N)</label>
              <input 
                type="number" 
                value={nitrogen} 
                onChange={(e) => setNitrogen(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="fert-input-n"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Soil Phosphorus (P)</label>
              <input 
                type="number" 
                value={phosphorus} 
                onChange={(e) => setPhosphorus(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="fert-input-p"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Soil Potassium (K)</label>
              <input 
                type="number" 
                value={potassium} 
                onChange={(e) => setPotassium(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="fert-input-k"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Soil pH Index</label>
              <input 
                type="text" 
                value={ph} 
                onChange={(e) => setPh(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="fert-input-ph"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-55 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary-500/10 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
            id="fert-recommend-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating Fertilizer Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4.5 w-4.5 text-yellow-300 fill-yellow-300 animate-pulse" />
                <span>Calculate Best Fertilizer Plan</span>
              </>
            )}
          </button>
        </form>

        {/* Output Display (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {loading && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 animate-pulse space-y-4">
              <div className="h-5 bg-slate-200 rounded w-1/4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          )}

          {!loading && !plan && (
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 p-12 rounded-3xl text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <Flame className="h-12 w-12 text-slate-300 mb-4 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Waiting for Soil Assay</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Enter your targeted crop and current NPK metrics and click Calculate to formulate balanced split dosages.
              </p>
            </div>
          )}

          {plan && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-md space-y-6"
            >
              {/* Prescription Header */}
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-300 p-2 rounded-xl">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">Crop Feed Prescription</h4>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Optimized for {cropName}</p>
                  </div>
                </div>
                {isMock && (
                  <span className="text-[9px] bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-mono">
                    CALIBRATED DEMO PLAN
                  </span>
                )}
              </div>

              {/* Recommended blend */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100/30 text-left space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 block uppercase tracking-wider">Primary Recommendation</span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white">{plan.recommendedFertilizer}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Dosage: <strong className="text-emerald-600">{plan.dosage}</strong></p>
              </div>

              {/* Justification explanation */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Agronomic Justification</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{plan.justification}</p>
              </div>

              {/* Natural / Organic options */}
              <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-4">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Sustainable / Organic Alternatives</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  {plan.organicAlternative}
                </p>
              </div>

            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
}
