import React from "react";
import { Bot, Send, HelpCircle, Volume2, VolumeX, Sparkles, Loader2, User } from "lucide-react";
import { Translations } from "../types";

interface AIChatBotProps {
  currentSensors?: {
    moisture: number;
    temperature: number;
    humidity: number;
    waterLevel: number;
  };
  theme: "light" | "dark";
  translations: Translations;
}

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export default function AIChatBot({ currentSensors, theme, translations }: AIChatBotProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      sender: "bot",
      text: `Namaskar! I am **Kisan Mitra**, your personal agricultural intelligence assistant. ${translations.welcomeAdvisory}`
    }
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState<string | null>(null);

  // Suggestions list
  const Q_SUGGESTIONS = [
    "When should I irrigate my crops?",
    "Why are my tomato leaves turning yellow?",
    "Which fertilizer works best for grapes?",
    "Should I irrigate based on my current sensor readings?"
  ];

  // Text-To-Speech function using standard Web Speech API
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(null);
        return;
      }
      
      // Clean markdown tags from voice read aloud
      const cleanText = text
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/- /g, "")
        .replace(/`+/g, "");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95; // Slightly slower for clear dictation
      utterance.onend = () => setIsSpeaking(null);
      utterance.onerror = () => setIsSpeaking(null);
      
      setIsSpeaking(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    setInput("");
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMsg,
          currentSensors
        })
      });

      const data = await response.json();
      if (data.error && !data.answer) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { sender: "bot", text: data.answer }]);
    } catch (error: any) {
      console.error("AI chat error:", error);
      setMessages(prev => [
        ...prev,
        { 
          sender: "bot", 
          text: `**Kisan Advisory Alert**\nUnable to reach server. Try adjusting your moisture sensors or configure your secrets. \n- Ideal moisture for tomatoes is 40%-55%.\n- Prune old leaves to prevent blights.\n- Add well-decomposed manure basal doses.` 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg p-6 text-left">
      {/* Chat header */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/80 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-500 text-white p-2 rounded-xl flex items-center justify-center shadow-md">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>{translations.chatbotTitle}</span>
              <Sparkles className="h-3.5 w-3.5 text-accent-yellow fill-accent-yellow animate-pulse" />
            </h3>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Mitra Online • Ready to Advise</p>
          </div>
        </div>
        
        {currentSensors && (
          <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 px-2.5 py-1 rounded-full font-mono">
            Synced with ESP32 Telemetry
          </span>
        )}
      </div>

      {/* Messages Feed */}
      <div className="h-72 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            {msg.sender === "bot" && (
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-600 shrink-0">
                <Bot className="h-4 w-4" />
              </div>
            )}
            
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
              msg.sender === "user"
                ? "bg-primary-500 text-white font-medium rounded-tr-none"
                : "bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-800"
            }`}>
              {/* Parse bold text helper */}
              {msg.text.split("\n").map((line, lIdx) => (
                <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>
                  {line.split("**").map((part, pIdx) => 
                    pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold">{part}</strong> : part
                  )}
                </p>
              ))}

              {/* Read Aloud button for Bot Answers */}
              {msg.sender === "bot" && (
                <button
                  onClick={() => speakText(msg.text)}
                  className="mt-2 text-[10px] flex items-center space-x-1 text-primary-600 dark:text-primary-400 font-bold hover:underline cursor-pointer"
                  title="Read Advice Aloud"
                >
                  {isSpeaking === msg.text ? (
                    <>
                      <VolumeX className="h-3 w-3 text-red-500" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3 w-3" />
                      <span>Read Aloud</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-600 shrink-0 animate-spin">
              <Loader2 className="h-4 w-4" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-mono animate-pulse">Kisan Mitra is reading soil moisture and formulating crop prescription...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="mb-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Frequently Asked questions</span>
        <div className="flex flex-wrap gap-2">
          {Q_SUGGESTIONS.map((q, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSendMessage(q)}
              className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-950/40 text-[10px] sm:text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
              id={`chat-suggestion-${idx}`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input container */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about fertilizer dose, seeds, water schedules..."
          className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-primary-500 outline-none"
          disabled={loading}
          id="chat-input"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white p-2.5 rounded-xl flex items-center justify-center transition-colors shadow-md shadow-primary-500/10 cursor-pointer"
          id="chat-submit-btn"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
