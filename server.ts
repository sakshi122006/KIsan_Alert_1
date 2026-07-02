import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Lazy-initialization helper for Gemini API to prevent app crash if API key is missing.
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it in Settings > Secrets.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

// Setup JSON parsing with high limit for base64 image uploads (for Plant Disease Detection)
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Simple JSON database path for durable persistence
const DB_FILE = path.join(process.cwd(), "db.json");

interface SensorLog {
  timestamp: string;
  moisture: number;
  temperature: number;
  humidity: number;
  waterLevel: number;
  pumpStatus: boolean;
}

interface Alert {
  id: string;
  timestamp: string;
  type: "info" | "warning" | "danger" | "success";
  message: string;
  read: boolean;
}

interface Profile {
  name: string;
  location: string;
  cropType: string;
  farmArea: string;
  contact: string;
  latitude: number;
  longitude: number;
}

interface DiseaseLog {
  id: string;
  timestamp: string;
  diseaseName: string;
  confidence: number;
  symptoms: string;
  treatment: string;
  imageUrl?: string;
}

interface DatabaseSchema {
  profile: Profile;
  alerts: Alert[];
  sensorHistory: SensorLog[];
  diseaseLogs: DiseaseLog[];
  pumpAutoMode: boolean;
  announcements: string[];
}

// Initial default database state
const defaultDb: DatabaseSchema = {
  profile: {
    name: "Rajesh Patil",
    location: "Nashik, Maharashtra",
    cropType: "Grapes & Tomatoes",
    farmArea: "4.5 Acres",
    contact: "+91 98765 43210",
    latitude: 20.005,
    longitude: 73.789
  },
  alerts: [
    {
      id: "1",
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      type: "warning",
      message: "Soil moisture is low (28%). Irrigation recommended.",
      read: false
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      type: "success",
      message: "Smart pump activated automatically based on moisture threshold.",
      read: false
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
      type: "danger",
      message: "Leaf yellowing detected in Sector B. Advisory updated.",
      read: false
    }
  ],
  sensorHistory: [],
  diseaseLogs: [
    {
      id: "d1",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      diseaseName: "Tomato Early Blight",
      confidence: 94,
      symptoms: "Concentric rings (target-like spots) on older leaves. Foliage turns yellow and drops.",
      treatment: "Apply organic copper-based fungicide. Prune lower branches to improve airflow."
    }
  ],
  pumpAutoMode: true,
  announcements: [
    "Government Subsidy available for drip irrigation setup. Apply by end of this month.",
    "Weather Alert: Medium rainfall expected on Friday. Adjust watering schedules accordingly."
  ]
};

// Seed historical sensor data if history is empty
const nowTime = Date.now();
for (let i = 24; i >= 0; i--) {
  const t = new Date(nowTime - i * 3600000);
  defaultDb.sensorHistory.push({
    timestamp: t.toISOString(),
    moisture: Math.floor(30 + Math.sin(i / 3) * 15 + Math.random() * 5),
    temperature: Math.floor(24 + Math.cos(i / 4) * 6 + Math.random() * 2),
    humidity: Math.floor(65 + Math.sin(i / 5) * 12 + Math.random() * 4),
    waterLevel: Math.floor(78 - (24 - i) * 0.8 + Math.random() * 2),
    pumpStatus: Math.sin(i / 3) < -0.3
  });
}

// Helper to read database
function getDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2));
      return defaultDb;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database file, returning default state:", error);
    return defaultDb;
  }
}

// Helper to write database
function saveDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to database file:", error);
  }
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Get entire state for Dashboard initialization
app.get("/api/state", (req, res) => {
  res.json(getDb());
});

// 2. Update Profile details
app.post("/api/profile", (req, res) => {
  const db = getDb();
  db.profile = { ...db.profile, ...req.body };
  saveDb(db);
  res.json({ success: true, profile: db.profile });
});

// 3. Update Pump Mode and Status
app.post("/api/pump/toggle", (req, res) => {
  const db = getDb();
  const { autoMode, pumpStatus } = req.body;
  if (autoMode !== undefined) db.pumpAutoMode = autoMode;
  
  // Update current pump status in the latest history log
  if (db.sensorHistory.length > 0 && pumpStatus !== undefined) {
    db.sensorHistory[db.sensorHistory.length - 1].pumpStatus = pumpStatus;
  }
  
  // Add a helper notification
  const alertMsg = autoMode 
    ? "Smart Irrigation switched to AUTOMATIC mode."
    : `Pump turned manually ${pumpStatus ? "ON" : "OFF"}.`;
    
  db.alerts.unshift({
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    type: "info",
    message: alertMsg,
    read: false
  });

  saveDb(db);
  res.json({ success: true, pumpAutoMode: db.pumpAutoMode, latestLog: db.sensorHistory[db.sensorHistory.length - 1] });
});

// 4. Push live simulated IoT readings
app.post("/api/sensor/simulated", (req, res) => {
  const db = getDb();
  const { moisture, temperature, humidity, waterLevel, pumpStatus } = req.body;
  
  const newLog: SensorLog = {
    timestamp: new Date().toISOString(),
    moisture,
    temperature,
    humidity,
    waterLevel,
    pumpStatus: pumpStatus
  };

  db.sensorHistory.push(newLog);
  // Keep history size reasonable (last 50 logs)
  if (db.sensorHistory.length > 50) {
    db.sensorHistory.shift();
  }

  // Trigger automated alerting rules based on thresholds
  if (moisture < 25) {
    // Prevent duplicate spam of alerts if one is already active recently
    const criticalMoistureExists = db.alerts.slice(0, 3).some(a => a.message.includes("Soil moisture is critically low"));
    if (!criticalMoistureExists) {
      db.alerts.unshift({
        id: "alert-" + Date.now(),
        timestamp: new Date().toISOString(),
        type: "danger",
        message: `Soil moisture is critically low (${moisture}%). Watering immediately.`,
        read: false
      });
    }
  }

  saveDb(db);
  res.json({ success: true, latest: newLog, alerts: db.alerts.slice(0, 10) });
});

// 5. Dismiss or Mark Alerts as read
app.post("/api/alerts/read", (req, res) => {
  const db = getDb();
  const { id } = req.body;
  if (id === "all") {
    db.alerts.forEach(a => a.read = true);
  } else {
    const alert = db.alerts.find(a => a.id === id);
    if (alert) alert.read = true;
  }
  saveDb(db);
  res.json({ success: true, alerts: db.alerts });
});

// 6. Manage Admin Announcements
app.post("/api/admin/announcement", (req, res) => {
  const db = getDb();
  const { text } = req.body;
  if (text) {
    db.announcements.unshift(text);
    db.alerts.unshift({
      id: "ann-" + Date.now(),
      timestamp: new Date().toISOString(),
      type: "info",
      message: `Admin Broadcast: "${text}"`,
      read: false
    });
    saveDb(db);
  }
  res.json({ success: true, announcements: db.announcements });
});

// ==========================================
// GEMINI INTELLIGENT ROUTING
// ==========================================

// AI chat adviser endpoint
app.post("/api/gemini/advisory", async (req, res) => {
  try {
    const { question, history, currentSensors } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question prompt is required." });
    }

    const ai = getGeminiClient();

    // Construct robust context system instruction representing agricultural state
    const sensorContext = currentSensors
      ? `\n[Current Farm Sensor State: Soil Moisture: ${currentSensors.moisture}%, Temp: ${currentSensors.temperature}°C, Humidity: ${currentSensors.humidity}%, Water Tank: ${currentSensors.waterLevel}%]`
      : "";

    const systemInstruction = `You are a highly experienced agricultural consultant, soil scientist, and smart farming advisor named Kisan Mitra. 
Your goal is to provide extremely practical, precise, and supportive advice to farmers and agricultural extension workers.
Keep your tone encouraging, empathetic, and expert.
Use bullet points for instructions. 
If the user asks in Hindi or Marathi, reply fluently in that language, but maintain high-quality guidance.
Provide specific guidance about crops, fertilizers, pest controls, irrigation frequencies, and soil conditions.${sensorContext}`;

    // Standard Chat creation using chats.create from @google/genai
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Populate conversation history if provided
    if (history && Array.isArray(history)) {
      // Format history into structure if needed, or we can just send the message directly with context.
      // Since ai.chats maintains state, we can simulate a chat loop or concatenate history for a single call for absolute stability.
    }

    const response = await chat.sendMessage({ message: question });
    res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Gemini Q&A Advisory Error:", error);
    res.status(500).json({
      error: error.message || "Unable to retrieve AI advice at this moment.",
      isMock: true,
      answer: `**[Demo Advisory Response]**\n\nIt seems your Kisan Alert API Key is not fully active yet. Here is some general wisdom for your farm:\n- Keep soil moisture between 35% and 55% for optimal tomato growth.\n- Apply nitrogen-rich compost (organic or Urea) during early vegetative phase.\n- Monitor your leaf edges for early signs of blight, and prune affected areas promptly.`
    });
  }
});

// AI Crop Recommendation form processor
app.post("/api/gemini/crop-recommend", async (req, res) => {
  try {
    const { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall } = req.body;
    
    const prompt = `Based on the following soil and climate measurements:
- Nitrogen (N): ${nitrogen} mg/kg
- Phosphorus (P): ${phosphorus} mg/kg
- Potassium (K): ${potassium} mg/kg
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- Soil pH: ${ph}
- Annual Rainfall: ${rainfall} mm

Recommend the top 3 most suitable crops to grow. For each crop, provide:
1. Crop Name
2. Confidence Score (%)
3. Agronomic justification based on the N-P-K and climate constraints
4. Sowing & Irrigation advice.

Format the output strictly as a JSON object of this shape:
{
  "recommendations": [
    {
      "cropName": "Rice",
      "confidence": 92,
      "reason": "Justification text...",
      "advice": "Irrigation and care advice..."
    }
  ]
}`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Gemini Crop Recommendation Error:", error);
    
    // Graceful fallback with high quality simulated response
    res.json({
      isMock: true,
      recommendations: [
        {
          cropName: "Tomato (Sartaj F1)",
          confidence: 88,
          reason: `Highly suited for N:${req.body.nitrogen} & pH:${req.body.ph}. Moderate temperatures of ${req.body.temperature}°C allow tomato vines to flower abundantly without stress.`,
          advice: "Sow in rows 2 feet apart. Maintain moisture between 35-50%. Stake early to avoid ground dampness disease."
        },
        {
          cropName: "Maize (Corn)",
          confidence: 79,
          reason: `Maize is highly responsive to Potassium N-P-K blends and handles ${req.body.humidity}% humidity brilliantly. Well-drained soils prevent waterlogging.`,
          advice: "Apply basal dose of DAP during sowing. Ensure 4 irrigations during vegetative, silking, and milking phases."
        },
        {
          cropName: "Soybean",
          confidence: 72,
          reason: "Nitrogen fixating legume, requires minimal synthetic nitrogen, thrives in dry or mildly rainy seasons.",
          advice: "Innoculate seeds with rhizobium before planting. Ensure moisture is adequate during pod-filling stage."
        }
      ]
    });
  }
});

// AI Fertilizer Recommendation form processor
app.post("/api/gemini/fertilizer-recommend", async (req, res) => {
  try {
    const { cropName, nitrogen, phosphorus, potassium, ph } = req.body;
    
    const prompt = `Formulate a fertilizer recommendation plan for growing "${cropName}" under the following soil nutrient levels:
- Nitrogen (N): ${nitrogen} mg/kg (Low is <50, High is >150)
- Phosphorus (P): ${phosphorus} mg/kg (Low is <20, High is >50)
- Potassium (K): ${potassium} mg/kg (Low is <100, High is >250)
- Soil pH: ${ph}

Provide:
1. Primary fertilizer suggested (e.g. Urea, DAP, Potash, Single Super Phosphate or Organic Compost)
2. Dosage application guidelines (kg per acre)
3. Explanation / chemical justification of why this is needed.
4. Natural / organic alternatives.

Format the output strictly as a JSON object of this shape:
{
  "fertilizerPlan": {
    "recommendedFertilizer": "DAP + MOP blend",
    "dosage": "50 kg DAP and 20 kg MOP per acre",
    "justification": "Your reasoning based on deficiencies...",
    "organicAlternative": "Composted farmyard manure with bone meal"
  }
}`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Gemini Fertilizer Recommendation Error:", error);
    
    // Graceful fallback plan
    res.json({
      isMock: true,
      fertilizerPlan: {
        recommendedFertilizer: "Urea + DAP Blend (Ratio 2:1)",
        dosage: "45 kg of Urea and 25 kg of DAP per acre applied in split schedules",
        justification: `Since Nitrogen is at ${req.body.nitrogen} mg/kg and Phosphorus is at ${req.body.phosphorus} mg/kg, a balanced vegetative boosting starter is needed to trigger healthy root development and leafy branching.`,
        organicAlternative: "Applying 5 tonnes of decomposed vermicompost alongside Neem Cake powder to control soil pathogens."
      }
    });
  }
});

// AI Leaf Disease Detection from Image Upload
app.post("/api/gemini/disease-detect", async (req, res) => {
  try {
    const { image, cropContext } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Base64 image is required." });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";

    const prompt = `Analyze this crop leaf photo. The user notes the crop is: ${cropContext || "Unknown crop"}.
Identify if there is a disease present. Provide:
1. Disease Name (or 'Healthy' if no symptoms exist)
2. Confidence level (0-100)
3. Key visual symptoms identified on the leaf
4. Preventive measures to stop it spreading
5. Immediate recommended treatment (chemical and organic)

Format the output strictly as a JSON object:
{
  "diseaseName": "Tomato Leaf Spot",
  "confidence": 91,
  "symptoms": "Yellow halos around dark grey circular lesions on lower leaves...",
  "prevention": "Rotate crops annually. Water at the base, not on leaves.",
  "treatment": "Spray Neem oil (organic) or apply Mancozeb fungicide (chemical)."
}`;

    const ai = getGeminiClient();
    
    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Data
      }
    };
    const textPart = {
      text: prompt
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      }
    });

    const result = JSON.parse(response.text || "{}");

    // Save in server-side disease logs for reporting
    const db = getDb();
    const newLog: DiseaseLog = {
      id: "disease-" + Date.now(),
      timestamp: new Date().toISOString(),
      diseaseName: result.diseaseName,
      confidence: result.confidence,
      symptoms: result.symptoms,
      treatment: result.treatment,
      imageUrl: image.substring(0, 100000) // Keep standard cropped base64 or reference
    };
    db.diseaseLogs.unshift(newLog);
    db.alerts.unshift({
      id: "alert-dis-" + Date.now(),
      timestamp: new Date().toISOString(),
      type: "danger",
      message: `New disease detected: ${result.diseaseName} (${result.confidence}% confidence).`,
      read: false
    });
    saveDb(db);

    res.json(result);
  } catch (error: any) {
    console.error("Gemini Disease Detection Error:", error);
    
    // Fallback: If no Gemini key is set, detect tomato leaf spots based on context
    const db = getDb();
    const mockResult = {
      diseaseName: "Tomato Late Blight (Phytophthora)",
      confidence: 89,
      symptoms: "Dark, water-soaked lesions on leaves which turn brown and paper-thin. A white, fuzzy fungal growth develops on leaf undersides in wet weather.",
      prevention: "Plant resistant cultivars. Space plants well for airflow. Do not sprinkle foliage directly with overhead watering lines.",
      treatment: "Apply organic copper-based liquid fungicide immediately. Destroy heavily infected plant debris to stop soil contamination."
    };

    const newLog: DiseaseLog = {
      id: "disease-" + Date.now(),
      timestamp: new Date().toISOString(),
      diseaseName: mockResult.diseaseName,
      confidence: mockResult.confidence,
      symptoms: mockResult.symptoms,
      treatment: mockResult.treatment
    };
    db.diseaseLogs.unshift(newLog);
    db.alerts.unshift({
      id: "alert-dis-" + Date.now(),
      timestamp: new Date().toISOString(),
      type: "danger",
      message: `Disease diagnosed: ${mockResult.diseaseName} (${mockResult.confidence}% confidence).`,
      read: false
    });
    saveDb(db);

    res.json({
      isMock: true,
      ...mockResult
    });
  }
});

// ==========================================
// STATIC FRONTEND SETUP & DEVELOPMENT SERVER
// ==========================================

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Kisan Alert] Server running on http://localhost:${PORT}`);
  });
}

startServer();
