import { Droplets, CloudSun, Compass, ShieldAlert, Waves, Bot, Sprout, TrendingUp } from "lucide-react";

export interface FeatureCard {
  title: string;
  description: string;
  iconName: string;
  color: string;
}

export const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "Smart Irrigation",
    description: "Automated pump control based on soil moisture and upcoming weather models.",
    iconName: "Droplets",
    color: "bg-blue-100 text-blue-600 border-blue-200"
  },
  {
    title: "Weather Alerts",
    description: "Get localized severe rain, storm, and frost warning updates dynamically.",
    iconName: "CloudSun",
    color: "bg-sky-100 text-sky-600 border-sky-200"
  },
  {
    title: "Crop Recommendation",
    description: "Find the most optimal crops to grow using NPK and soil pH measurements.",
    iconName: "Compass",
    color: "bg-emerald-100 text-emerald-600 border-emerald-200"
  },
  {
    title: "Disease Detection",
    description: "Upload leaf photographs to identify pests, leaf spot pathogens, and receive treatments.",
    iconName: "ShieldAlert",
    color: "bg-red-100 text-red-600 border-red-200"
  },
  {
    title: "Water Tank Monitoring",
    description: "Real-time overhead reservoir levels with auto-pump dry-run cutoff prevention.",
    iconName: "Waves",
    color: "bg-cyan-100 text-cyan-600 border-cyan-200"
  },
  {
    title: "AI Advisory Mitra",
    description: "Chat in multi-languages with our crop-advisor trained on soil sciences.",
    iconName: "Bot",
    color: "bg-green-100 text-green-600 border-green-200"
  },
  {
    title: "Fertilizer Optimizer",
    description: "Maximize yield while avoiding soil salinity through customized dosage advice.",
    iconName: "Sprout",
    color: "bg-yellow-100 text-yellow-600 border-yellow-200"
  },
  {
    title: "Market Price Updates",
    description: "Track crop price updates from APMC markets to time your harvesting.",
    iconName: "TrendingUp",
    color: "bg-amber-100 text-amber-600 border-amber-200"
  }
];

export const PROBLEMS_AND_SOLUTIONS = [
  {
    id: 1,
    problem: "Excessive Water Waste",
    stat: "Over 60% of farm water is lost due to blind daily watering schedules.",
    solution: "Smart Irrigation triggers pumps ONLY when the root zone drops below 35% moisture."
  },
  {
    id: 2,
    problem: "Crop Failure from Sudden Storms",
    stat: "Sudden unseasonal rains rot harvested onions and grains in fields.",
    solution: "Alert Center broadcasts heavy rain warnings 48 hours early, advising immediate crop shielding."
  },
  {
    id: 3,
    problem: "Soil Nutrient Exhaustion",
    stat: "Overusing synthetic fertilizers (Urea) leads to soil toxicity and dead microbiomes.",
    solution: "AI recommendation reads soil NPK and directs exact split dosages of organic compost mixed with inorganic blends."
  },
  {
    id: 4,
    problem: "Undiagnosed Pathogen Outbreaks",
    stat: "Late diagnoses of early blights ruin complete tomato crops in days.",
    solution: "Farming extension officers or farmers upload a quick snapshot to diagnose blights and secure organic cures."
  }
];

// Extension officers list
export const EXTENSION_OFFICERS = [
  {
    name: "Dr. Arvind Kulkarni",
    role: "Senior Agronomist, Nashik District Lab",
    phone: "+91 94220 12345",
    email: "arvind.agri@gov.in",
    specialty: "Soil Nutrient & NPK Assays"
  },
  {
    name: "Smt. Shaila Deshmukh",
    role: "Assistant Agriculture Officer (AAO)",
    phone: "+91 94035 88990",
    email: "shaila.d@mahadbt.gov.in",
    specialty: "Government Drip Irrigation Subsidies"
  },
  {
    name: "Shri. Ramesh Gaikwad",
    role: "Irrigation Engineer & IoT Technician",
    phone: "+91 98230 45678",
    email: "ramesh.tech@kisanalert.org",
    specialty: "ESP32 Sensor Calibration & Pumps"
  }
];

// Preset crop references for easy autofilling on forms
export const CROP_PRESETS = [
  { crop: "Tomato", idealN: 80, idealP: 45, idealK: 60, idealPh: 6.2 },
  { crop: "Wheat", idealN: 110, idealP: 60, idealK: 50, idealPh: 6.5 },
  { crop: "Rice (Paddy)", idealN: 120, idealP: 50, idealK: 40, idealPh: 5.8 },
  { crop: "Cotton", idealN: 90, idealP: 50, idealK: 80, idealPh: 7.0 },
  { crop: "Grapes", idealN: 60, idealP: 35, idealK: 120, idealPh: 6.8 },
  { crop: "Soybean", idealN: 40, idealP: 70, idealK: 90, idealPh: 6.4 }
];
