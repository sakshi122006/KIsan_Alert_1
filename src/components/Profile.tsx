import React from "react";
import { motion } from "motion/react";
import { 
  User, 
  MapPin, 
  Sprout, 
  Scaling, 
  PhoneCall, 
  Save, 
  Compass, 
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { Profile as ProfileType } from "../types";

interface ProfileProps {
  profile: ProfileType;
  onSaveProfile: (profile: ProfileType) => Promise<void>;
}

export default function Profile({ profile, onSaveProfile }: ProfileProps) {
  const [name, setName] = React.useState(profile.name);
  const [location, setLocation] = React.useState(profile.location);
  const [cropType, setCropType] = React.useState(profile.cropType);
  const [farmArea, setFarmArea] = React.useState(profile.farmArea);
  const [contact, setContact] = React.useState(profile.contact);
  const [lat, setLat] = React.useState(profile.latitude.toString());
  const [lng, setLng] = React.useState(profile.longitude.toString());

  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  // Keep state synchronized with backend updates
  React.useEffect(() => {
    setName(profile.name);
    setLocation(profile.location);
    setCropType(profile.cropType);
    setFarmArea(profile.farmArea);
    setContact(profile.contact);
    setLat(profile.latitude.toString());
    setLng(profile.longitude.toString());
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await onSaveProfile({
        name,
        location,
        cropType,
        farmArea,
        contact,
        latitude: parseFloat(lat) || 20.005,
        longitude: parseFloat(lng) || 73.789
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 5000);
    } catch (error) {
      console.error("Save profile error:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Farmer Registry & GPS Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Manage your personal credential cards, farm parameters, and localized soil GPS coordinates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Card details (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Visual ID Badge */}
          <div className="glass-card bg-gradient-to-br from-primary-500 to-primary-600 text-white p-6 rounded-3xl border border-primary-500/15 shadow-xl relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 opacity-10">
              <Sprout className="w-48 h-48" />
            </div>

            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/25">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight">{profile.name}</h3>
                  <p className="text-[10px] text-primary-100 font-mono tracking-widest uppercase">Verified Farmer</p>
                </div>
              </div>
              <span className="bg-primary-700/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-primary-400/20">
                ACTIVE
              </span>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary-200 shrink-0" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sprout className="h-4 w-4 text-primary-200 shrink-0" />
                <span>Crops: <strong>{profile.cropType}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Scaling className="h-4 w-4 text-primary-200 shrink-0" />
                <span>Farm Acreage: <strong>{profile.farmArea}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneCall className="h-4 w-4 text-primary-200 shrink-0" />
                <span>{profile.contact}</span>
              </div>
            </div>

            <div className="border-t border-white/10 mt-6 pt-4 flex justify-between text-[10px] font-mono text-primary-100">
              <span>GPS: {profile.latitude}, {profile.longitude}</span>
              <span>Kisan ID: KA-40982</span>
            </div>
          </div>

          {/* Interactive Simulated GPS Map view */}
          <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl border border-slate-800 shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary-400 mb-4 flex items-center space-x-2">
              <Compass className="h-4 w-4 text-primary-400" />
              <span>Calibrated GPS Coordinates</span>
            </h3>

            {/* Custom vector-based agricultural map graphic representation */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800/80 p-6 h-40 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
              
              {/* Green crop grid layout */}
              <div className="absolute inset-0 opacity-10 grid grid-cols-6 gap-2 p-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                  <div key={i} className="border border-primary-500 rounded-sm"></div>
                ))}
              </div>

              {/* Target coordinate marker */}
              <div className="relative z-10 flex flex-col items-center space-y-2 animate-bounce">
                <MapPin className="h-8 w-8 text-red-500 fill-red-500" />
                <span className="bg-slate-900/90 text-white text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-800">
                  {profile.latitude}, {profile.longitude}
                </span>
              </div>

              <div className="absolute bottom-2 left-3 text-[9px] text-slate-500 font-mono">
                Satellite Fix: OK (7 Sats)
              </div>
            </div>
          </div>

        </div>

        {/* Edit Form (7 Columns) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 glass-card bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-md space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-primary-500" />
            <span>Update Personal Credentials</span>
          </h3>

          {saved && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-2xl border border-emerald-200/50 flex items-center gap-2 text-xs font-semibold"
            >
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
              <span>Farmer profile updated successfully on Kisan Alert server.</span>
            </motion.div>
          )}

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Farmer Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
              required
              id="profile-input-name"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Farm Location</label>
            <input 
              type="text" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
              required
              id="profile-input-loc"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Main Crop Cultivars</label>
              <input 
                type="text" 
                value={cropType} 
                onChange={(e) => setCropType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="profile-input-crops"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Farm Area</label>
              <input 
                type="text" 
                value={farmArea} 
                onChange={(e) => setFarmArea(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="profile-input-area"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Contact Number</label>
            <input 
              type="text" 
              value={contact} 
              onChange={(e) => setContact(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
              required
              id="profile-input-contact"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Latitude</label>
              <input 
                type="text" 
                value={lat} 
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="profile-input-lat"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Longitude</label>
              <input 
                type="text" 
                value={lng} 
                onChange={(e) => setLng(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
                required
                id="profile-input-lng"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-55 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary-500/10 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
            id="profile-submit-btn"
          >
            <Save className="h-4.5 w-4.5" />
            <span>{saving ? "Saving credentials..." : "Save Profile Details"}</span>
          </button>
        </form>

      </div>

    </div>
  );
}
