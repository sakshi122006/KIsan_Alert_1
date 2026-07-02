export type AppTab =
  | "home"
  | "dashboard"
  | "weather"
  | "crop"
  | "fertilizer"
  | "disease"
  | "alerts"
  | "reports"
  | "profile"
  | "admin"
  | "contact";

export interface Profile {
  name: string;
  location: string;
  cropType: string;
  farmArea: string;
  contact: string;
  latitude: number;
  longitude: number;
}

export interface SensorLog {
  timestamp: string;
  moisture: number;
  temperature: number;
  humidity: number;
  waterLevel: number;
  pumpStatus: boolean;
}

export interface Alert {
  id: string;
  timestamp: string;
  type: "info" | "warning" | "danger" | "success";
  message: string;
  read: boolean;
}

export interface DiseaseLog {
  id: string;
  timestamp: string;
  diseaseName: string;
  confidence: number;
  symptoms: string;
  treatment: string;
  imageUrl?: string;
}

export interface FullState {
  profile: Profile;
  alerts: Alert[];
  sensorHistory: SensorLog[];
  diseaseLogs: DiseaseLog[];
  pumpAutoMode: boolean;
  announcements: string[];
}

// Translations structure for Multi-language support (English, Hindi, Marathi)
export interface Translations {
  home: string;
  dashboard: string;
  weather: string;
  cropRecommend: string;
  fertilizerRecommend: string;
  diseaseDetect: string;
  alerts: string;
  reports: string;
  profile: string;
  admin: string;
  contact: string;
  tagline: string;
  getStarted: string;
  liveDashboard: string;
  aboutProject: string;
  soilMoisture: string;
  temperature: string;
  humidity: string;
  tankLevel: string;
  pumpStatus: string;
  rainProb: string;
  pumpOn: string;
  pumpOff: string;
  autoMode: string;
  manualMode: string;
  weatherAlertTitle: string;
  recommendCrops: string;
  language: string;
  chatbotTitle: string;
  welcomeAdvisory: string;
}

export const translationsMap: Record<string, Translations> = {
  en: {
    home: "Home",
    dashboard: "Dashboard",
    weather: "Weather",
    cropRecommend: "Crop Recommendation",
    fertilizerRecommend: "Fertilizer Advisory",
    diseaseDetect: "Disease Detection",
    alerts: "Alert Center",
    reports: "Reports & PDF",
    profile: "Farmer Profile",
    admin: "Admin Control",
    contact: "Contact Extension",
    tagline: "Smart Water, Smart Crops, Smart Future",
    getStarted: "Get Started",
    liveDashboard: "Live Dashboard",
    aboutProject: "About Kisan Alert",
    soilMoisture: "Soil Moisture",
    temperature: "Temperature",
    humidity: "Air Humidity",
    tankLevel: "Water Tank Level",
    pumpStatus: "Water Pump",
    rainProb: "Rain Probability",
    pumpOn: "Pump is running",
    pumpOff: "Pump is offline",
    autoMode: "Automatic (AI Controlled)",
    manualMode: "Manual Switch",
    weatherAlertTitle: "Active Weather Warnings",
    recommendCrops: "Calculate Best Crops",
    language: "Language",
    chatbotTitle: "Kisan Mitra – AI Advisor",
    welcomeAdvisory: "Ask me anything about sowing, organic compost, fertilizers, crop rotations, or irrigation schedules."
  },
  hi: {
    home: "मुख्य पृष्ठ",
    dashboard: "डैशबोर्ड",
    weather: "मौसम",
    cropRecommend: "फसल सिफारिश",
    fertilizerRecommend: "खाद सलाहकार",
    diseaseDetect: "बीमारी पहचान",
    alerts: "चेतावनी केंद्र",
    reports: "रिपोर्ट और पीडीएफ",
    profile: "किसान प्रोफाइल",
    admin: "एडमिन पैनल",
    contact: "कृषि संपर्क",
    tagline: "स्मार्ट पानी, स्मार्ट फसलें, स्मार्ट भविष्य",
    getStarted: "शुरू करें",
    liveDashboard: "लाइव डैशबोर्ड",
    aboutProject: "किसान अलर्ट के बारे में",
    soilMoisture: "मिट्टी की नमी",
    temperature: "तापमान",
    humidity: "हवा की नमी",
    tankLevel: "पानी की टंकी का स्तर",
    pumpStatus: "पानी का पंप",
    rainProb: "बारिश की संभावना",
    pumpOn: "पंप चल रहा है",
    pumpOff: "पंप बंद है",
    autoMode: "स्वचालित (एआई नियंत्रित)",
    manualMode: "मैनुअल नियंत्रण",
    weatherAlertTitle: "सक्रिय मौसम चेतावनी",
    recommendCrops: "सर्वोत्तम फसलें खोजें",
    language: "भाषा",
    chatbotTitle: "किसान मित्र – एआई सलाहकार",
    welcomeAdvisory: "मुझसे बुवाई, जैविक खाद, फसल चक्र या सिंचाई के बारे में कुछ भी पूछें।"
  },
  mr: {
    home: "मुख्य पृष्ठ",
    dashboard: "डॅशबोर्ड",
    weather: "हवामान",
    cropRecommend: "पीक शिफारस",
    fertilizerRecommend: "खत सल्लागार",
    diseaseDetect: "रोग निदान",
    alerts: "सूचना केंद्र",
    reports: "अहवाल आणि PDF",
    profile: "शेतकरी प्रोफाइल",
    admin: "अ‍ॅडमिन पॅनेल",
    contact: "कृषी अधिकारी संपर्क",
    tagline: "स्मार्ट पाणी, स्मार्ट पिके, स्मार्ट भविष्य",
    getStarted: "सुरू करा",
    liveDashboard: "लाइव्ह डॅशबोर्ड",
    aboutProject: "किसान अलर्ट बद्दल",
    soilMoisture: "जमिनीतील ओलावा",
    temperature: "तापमान",
    humidity: "हवेतील दमटपणा",
    tankLevel: "पाण्याच्या टाकीची पातळी",
    pumpStatus: "पाण्याचा पंप",
    rainProb: "पावसाची शक्यता",
    pumpOn: "पंप सुरू आहे",
    pumpOff: "पंप बंद आहे",
    autoMode: "स्वयंचलित (AI नियंत्रित)",
    manualMode: "मॅन्युअल नियंत्रण",
    weatherAlertTitle: "सक्रिय हवामान इशारे",
    recommendCrops: "सर्वोत्तम पिके शोधा",
    language: "भाषा",
    chatbotTitle: "किसान मित्र – एआय सल्लागार",
    welcomeAdvisory: "मला पेरणी, सेंद्रिय खत, पीक चक्र किंवा सिंचन नियोजनाबद्दल काहीही विचारा."
  }
};
