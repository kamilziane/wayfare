import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip
} from "recharts";
import {
  LayoutDashboard, Sparkles, Map as MapIcon, Compass, PlaneTakeoff, Bot,
  Sun, Moon, Plus, Trash2, Pencil, X, ChevronRight, ChevronLeft,
  Heart, Star, Clock, Ticket, Utensils, Hotel, Landmark, TrainFront,
  Wallet, Send, Menu, Calendar, MapPin, CloudRain, CloudSun, Umbrella,
  CheckSquare, Square, FileText, DollarSign, Copy, Share2,
  ArrowRight, Luggage, ShieldCheck, Phone, Globe2, TrendingUp
} from "lucide-react";

/* ============================== DESIGN TOKENS ============================== */
const DARK = {
  bg: "#0B1220", bgSoft: "#0F1826", surface: "rgba(255,255,255,0.045)",
  surfaceStrong: "rgba(255,255,255,0.07)", border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.14)", text: "#EDF1F5", textMuted: "#8B98A8",
  textFaint: "#57657A", coral: "#FF7A59", teal: "#2FD1C5", gold: "#F2B84B",
  rose: "#F0716D", indigo: "#7C8CF8", shadow: "0 20px 60px -20px rgba(0,0,0,0.6)",
};
const LIGHT = {
  bg: "#F7F5F1", bgSoft: "#FFFFFF", surface: "rgba(255,255,255,0.75)",
  surfaceStrong: "rgba(255,255,255,0.95)", border: "rgba(20,22,26,0.08)",
  borderStrong: "rgba(20,22,26,0.14)", text: "#181A1F", textMuted: "#5C6472",
  textFaint: "#8A93A6", coral: "#E85F3D", teal: "#0E9C8F", gold: "#A9720F",
  rose: "#C6413A", indigo: "#5457C7", shadow: "0 20px 50px -25px rgba(20,20,20,0.18)",
};

const INTERESTS = ["Culture", "Food", "Nature", "Nightlife", "Adventure", "Relaxation", "Shopping", "History", "Photography", "Beach"];
const ACCOMMODATIONS = ["Budget", "Mid-range", "Luxury", "Boutique"];
const TRANSPORTS = ["Flight", "Train", "Car rental", "Public transit"];

/* ============================== UTIL ============================== */
const randint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
function fmtDate(d) { return new Date(d).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" }); }
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }

/* ============================== DESTINATION TEMPLATES ============================== */
const TEMPLATES = {
  paris: {
    country: "France", emoji: "🗼", gradient: ["#2C1B34", "#6B3FA0"], tempBase: 16, rainBase: 35, distanceKm: 8500,
    attractions: [
      { name: "Eiffel Tower", rating: 4.7, hours: "9:00–23:00", duration: "2h", price: 28 },
      { name: "Louvre Museum", rating: 4.8, hours: "9:00–18:00", duration: "3h", price: 22 },
      { name: "Montmartre & Sacré-Cœur", rating: 4.6, hours: "6:00–22:30", duration: "2h", price: 0 },
      { name: "Seine River Cruise", rating: 4.5, hours: "10:00–22:00", duration: "1h", price: 18 },
      { name: "Musée d'Orsay", rating: 4.7, hours: "9:30–18:00", duration: "2h", price: 16 },
    ],
    restaurants: [
      { name: "Le Petit Bistro", cuisine: "French", budget: "$$", distanceKm: 0.6, rating: 4.6 },
      { name: "Café de Flore", cuisine: "French Café", budget: "$$$", distanceKm: 1.2, rating: 4.4 },
      { name: "L'Ami Louis", cuisine: "French", budget: "$$$$", distanceKm: 2.1, rating: 4.7 },
      { name: "Breizh Café", cuisine: "Crêperie", budget: "$$", distanceKm: 0.9, rating: 4.5 },
      { name: "Marché des Enfants Rouges", cuisine: "Market", budget: "$", distanceKm: 1.5, rating: 4.3 },
    ],
    hotels: [
      { name: "Hôtel Lumière Saint-Germain", pricePerNight: 210, rating: 4.6, area: "Saint-Germain" },
      { name: "Le Marais Boutique Hotel", pricePerNight: 150, rating: 4.4, area: "Le Marais" },
      { name: "Montmartre Garden Inn", pricePerNight: 95, rating: 4.1, area: "Montmartre" },
    ],
    evenings: ["Seine river sunset cruise", "Jazz club in Saint-Germain", "Eiffel Tower light show", "Wine bar hopping in Le Marais", "Cabaret show"],
  },
  tokyo: {
    country: "Japan", emoji: "🎌", gradient: ["#141B2E", "#B33A5B"], tempBase: 19, rainBase: 40, distanceKm: 9700,
    attractions: [
      { name: "Senso-ji Temple", rating: 4.6, hours: "6:00–17:00", duration: "1.5h", price: 0 },
      { name: "Shibuya Crossing & Sky", rating: 4.7, hours: "10:00–22:00", duration: "1h", price: 12 },
      { name: "teamLab Planets", rating: 4.8, hours: "9:00–19:00", duration: "2h", price: 32 },
      { name: "Tsukiji Outer Market", rating: 4.5, hours: "5:00–14:00", duration: "1.5h", price: 0 },
      { name: "Meiji Shrine", rating: 4.6, hours: "5:00–18:00", duration: "1h", price: 0 },
    ],
    restaurants: [
      { name: "Ichiran Ramen", cuisine: "Ramen", budget: "$", distanceKm: 0.5, rating: 4.5 },
      { name: "Sushi Dai", cuisine: "Sushi", budget: "$$$", distanceKm: 1.8, rating: 4.8 },
      { name: "Gonpachi Nishi-Azabu", cuisine: "Izakaya", budget: "$$", distanceKm: 2.4, rating: 4.4 },
      { name: "Omoide Yokocho", cuisine: "Yakitori Alley", budget: "$", distanceKm: 1.1, rating: 4.3 },
      { name: "Narisawa", cuisine: "Fine dining", budget: "$$$$", distanceKm: 3.0, rating: 4.9 },
    ],
    hotels: [
      { name: "Park Hyatt Tokyo", pricePerNight: 420, rating: 4.8, area: "Shinjuku" },
      { name: "Shibuya Stream Excel Hotel", pricePerNight: 180, rating: 4.4, area: "Shibuya" },
      { name: "Asakusa Ryokan Sakura", pricePerNight: 110, rating: 4.3, area: "Asakusa" },
    ],
    evenings: ["Golden Gai bar hopping", "Tokyo Tower night view", "Shinjuku neon walk", "Karaoke night in Shibuya", "Izakaya crawl"],
  },
  rome: {
    country: "Italy", emoji: "🏛️", gradient: ["#2A1B12", "#B5652E"], tempBase: 20, rainBase: 25, distanceKm: 8100,
    attractions: [
      { name: "Colosseum", rating: 4.7, hours: "9:00–19:00", duration: "2h", price: 18 },
      { name: "Vatican Museums & Sistine Chapel", rating: 4.7, hours: "9:00–18:00", duration: "3h", price: 21 },
      { name: "Trevi Fountain", rating: 4.6, hours: "24 hours", duration: "0.5h", price: 0 },
      { name: "Roman Forum & Palatine Hill", rating: 4.6, hours: "9:00–19:00", duration: "2h", price: 16 },
      { name: "Pantheon", rating: 4.7, hours: "9:00–19:00", duration: "1h", price: 5 },
    ],
    restaurants: [
      { name: "Trattoria Da Enzo", cuisine: "Roman", budget: "$$", distanceKm: 0.8, rating: 4.6 },
      { name: "Roscioli", cuisine: "Deli & Wine", budget: "$$$", distanceKm: 1.3, rating: 4.7 },
      { name: "Pizzarium", cuisine: "Pizza al taglio", budget: "$", distanceKm: 2.0, rating: 4.5 },
      { name: "La Pergola", cuisine: "Fine dining", budget: "$$$$", distanceKm: 4.2, rating: 4.9 },
      { name: "Ai Tre Scalini", cuisine: "Wine bar", budget: "$$", distanceKm: 1.6, rating: 4.4 },
    ],
    hotels: [
      { name: "Hotel Artemide", pricePerNight: 190, rating: 4.5, area: "Termini" },
      { name: "Trastevere Charme House", pricePerNight: 130, rating: 4.4, area: "Trastevere" },
      { name: "Navona Central B&B", pricePerNight: 85, rating: 4.2, area: "Piazza Navona" },
    ],
    evenings: ["Trastevere evening stroll", "Trevi Fountain by night", "Rooftop aperitivo", "Opera at Teatro dell'Opera", "Gelato crawl"],
  },
  bali: {
    country: "Indonesia", emoji: "🌴", gradient: ["#0F2A24", "#2E9E7C"], tempBase: 29, rainBase: 55, distanceKm: 12500,
    attractions: [
      { name: "Tanah Lot Temple", rating: 4.6, hours: "7:00–19:00", duration: "1.5h", price: 6 },
      { name: "Tegallalang Rice Terraces", rating: 4.5, hours: "7:00–18:00", duration: "1.5h", price: 3 },
      { name: "Uluwatu Temple & Kecak Dance", rating: 4.7, hours: "8:00–19:00", duration: "2h", price: 10 },
      { name: "Sacred Monkey Forest", rating: 4.3, hours: "8:30–18:00", duration: "1h", price: 5 },
      { name: "Mount Batur Sunrise Trek", rating: 4.8, hours: "3:00–9:00", duration: "5h", price: 35 },
    ],
    restaurants: [
      { name: "Locavore", cuisine: "Modern Indonesian", budget: "$$$", distanceKm: 1.0, rating: 4.8 },
      { name: "Warung Ibu Oka", cuisine: "Balinese", budget: "$", distanceKm: 0.7, rating: 4.4 },
      { name: "Sea Salt Seminyak", cuisine: "Seafood", budget: "$$", distanceKm: 2.5, rating: 4.6 },
      { name: "Bebek Bengil", cuisine: "Balinese", budget: "$$", distanceKm: 1.8, rating: 4.5 },
      { name: "Motion Cafe", cuisine: "Healthy/Vegan", budget: "$$", distanceKm: 1.2, rating: 4.5 },
    ],
    hotels: [
      { name: "Ubud Jungle Villa Resort", pricePerNight: 160, rating: 4.7, area: "Ubud" },
      { name: "Seminyak Beachfront Hotel", pricePerNight: 210, rating: 4.6, area: "Seminyak" },
      { name: "Canggu Surf Hostel & Suites", pricePerNight: 55, rating: 4.2, area: "Canggu" },
    ],
    evenings: ["Beachside bonfire at Canggu", "Kecak fire dance at Uluwatu", "Ubud night market", "Rooftop cocktails in Seminyak", "Stargazing in the rice fields"],
  },
  "new york": {
    country: "USA", emoji: "🗽", gradient: ["#101820", "#2B5FBF"], tempBase: 14, rainBase: 30, distanceKm: 6000,
    attractions: [
      { name: "Statue of Liberty & Ellis Island", rating: 4.6, hours: "8:30–16:00", duration: "3h", price: 24 },
      { name: "Central Park", rating: 4.8, hours: "6:00–1:00", duration: "2h", price: 0 },
      { name: "The Met Museum", rating: 4.8, hours: "10:00–17:00", duration: "3h", price: 30 },
      { name: "Top of the Rock", rating: 4.7, hours: "9:00–23:00", duration: "1h", price: 40 },
      { name: "Brooklyn Bridge Walk", rating: 4.7, hours: "24 hours", duration: "1h", price: 0 },
    ],
    restaurants: [
      { name: "Katz's Delicatessen", cuisine: "Deli", budget: "$$", distanceKm: 1.1, rating: 4.5 },
      { name: "Joe's Pizza", cuisine: "Pizza", budget: "$", distanceKm: 0.4, rating: 4.6 },
      { name: "Peter Luger Steak House", cuisine: "Steakhouse", budget: "$$$$", distanceKm: 3.2, rating: 4.6 },
      { name: "Xi'an Famous Foods", cuisine: "Chinese", budget: "$", distanceKm: 0.9, rating: 4.4 },
      { name: "Le Bernardin", cuisine: "Fine dining seafood", budget: "$$$$", distanceKm: 2.6, rating: 4.9 },
    ],
    hotels: [
      { name: "The Manhattan at Times Square", pricePerNight: 260, rating: 4.4, area: "Midtown" },
      { name: "Brooklyn Loft Hotel", pricePerNight: 170, rating: 4.5, area: "Williamsburg" },
      { name: "Chelsea Budget Inn", pricePerNight: 120, rating: 4.0, area: "Chelsea" },
    ],
    evenings: ["Broadway show", "Rooftop bar in Manhattan", "Jazz club in Harlem", "Brooklyn skyline at night", "Comedy club in Greenwich Village"],
  },
};
function genericTemplate(destination) {
  const d = destination || "Your Destination";
  return {
    country: "", emoji: "🧭", gradient: ["#111827", "#334155"], tempBase: 22, rainBase: 30, distanceKm: 5000,
    attractions: [
      { name: `${d} Old Town`, rating: 4.5, hours: "9:00–18:00", duration: "2h", price: 10 },
      { name: `${d} Central Museum`, rating: 4.4, hours: "10:00–17:00", duration: "2h", price: 14 },
      { name: `${d} Waterfront Promenade`, rating: 4.6, hours: "24 hours", duration: "1.5h", price: 0 },
      { name: `${d} Historic Cathedral`, rating: 4.5, hours: "8:00–19:00", duration: "1h", price: 5 },
      { name: `${d} City Market`, rating: 4.3, hours: "7:00–15:00", duration: "1h", price: 0 },
    ],
    restaurants: [
      { name: "The Local Table", cuisine: "Local", budget: "$$", distanceKm: 0.8, rating: 4.5 },
      { name: "Riverside Bistro", cuisine: "Contemporary", budget: "$$$", distanceKm: 1.4, rating: 4.4 },
      { name: "Spice & Vine", cuisine: "Fusion", budget: "$$", distanceKm: 1.0, rating: 4.3 },
      { name: "Corner Café", cuisine: "Café", budget: "$", distanceKm: 0.5, rating: 4.2 },
      { name: "Harbor House", cuisine: "Seafood", budget: "$$$", distanceKm: 2.1, rating: 4.6 },
    ],
    hotels: [
      { name: `Grand ${d} Hotel`, pricePerNight: 180, rating: 4.5, area: "City Center" },
      { name: `${d} Boutique Inn`, pricePerNight: 120, rating: 4.3, area: "Old Town" },
      { name: `Central Stay ${d}`, pricePerNight: 75, rating: 4.0, area: "Downtown" },
    ],
    evenings: ["Sunset viewpoint visit", "Local night market", "Live music bar", "Waterfront evening walk", "Rooftop dinner"],
  };
}
function getTemplate(destination) {
  const key = (destination || "").trim().toLowerCase();
  for (const k of Object.keys(TEMPLATES)) if (key.includes(k)) return { ...TEMPLATES[k], key: k };
  return { ...genericTemplate(destination), key: "generic" };
}

/* ============================== TRIP GENERATION ============================== */
function generateWeather(tmpl, numDays) {
  return Array.from({ length: Math.min(numDays, 10) }).map((_, i) => {
    const tempHigh = Math.round(tmpl.tempBase + randint(-3, 4));
    const tempLow = Math.round(tempHigh - randint(4, 9));
    const rain = Math.max(0, Math.min(95, Math.round(tmpl.rainBase + randint(-20, 20))));
    let condition = "Sunny", Icon = Sun;
    if (rain > 60) { condition = "Rainy"; Icon = CloudRain; }
    else if (rain > 30) { condition = "Partly cloudy"; Icon = CloudSun; }
    const clothing = tempHigh >= 27 ? "Light, breathable clothing" : tempHigh >= 18 ? "Layers with a light jacket" : "Warm layers and a coat";
    return { day: i + 1, tempHigh, tempLow, rain, condition, Icon, clothing };
  });
}
function generatePacking(tmpl, form, weather) {
  const list = [
    { item: "Passport & travel documents", category: "Essentials" },
    { item: "Phone charger & adapter", category: "Essentials" },
    { item: "Toiletries", category: "Essentials" },
    { item: "Reusable water bottle", category: "Essentials" },
    { item: "Daypack", category: "Essentials" },
  ];
  const anyRain = weather.some((w) => w.rain > 50);
  const anyHot = weather.some((w) => w.tempHigh >= 27);
  const anyCold = weather.some((w) => w.tempHigh < 15);
  if (anyRain) list.push({ item: "Compact umbrella / rain jacket", category: "Weather" });
  if (anyHot) list.push({ item: "Sunscreen & sunglasses", category: "Weather" });
  if (anyCold) list.push({ item: "Warm coat & gloves", category: "Weather" });
  const interests = form.interests || [];
  if (interests.includes("Beach")) list.push({ item: "Swimwear & beach towel", category: "Activities" });
  if (interests.includes("Adventure")) list.push({ item: "Hiking shoes", category: "Activities" });
  if (interests.includes("Photography")) list.push({ item: "Camera & spare batteries", category: "Activities" });
  if (interests.includes("Nightlife")) list.push({ item: "Evening outfit", category: "Activities" });
  if (interests.includes("Nature")) list.push({ item: "Insect repellent", category: "Activities" });
  list.push({ item: "Comfortable walking shoes", category: "Activities" });
  return list.map((i) => ({ ...i, id: uid(), checked: false }));
}
function generateMapPins(tmpl, attractions, hotels, restaurants) {
  const pins = [];
  attractions.forEach((a) => pins.push({ id: a.id, type: "attraction", name: a.name, x: randint(15, 85), y: randint(15, 85), desc: `Rated ${a.rating}★ · ${a.duration} visit` }));
  hotels.forEach((h) => pins.push({ id: h.id, type: "hotel", name: h.name, x: randint(15, 85), y: randint(15, 85), desc: `${money(h.pricePerNight)}/night · ${h.area}` }));
  restaurants.slice(0, 3).forEach((r) => pins.push({ id: r.id, type: "restaurant", name: r.name, x: randint(15, 85), y: randint(15, 85), desc: `${r.cuisine} · ${r.budget}` }));
  pins.push({ id: uid(), type: "airport", name: "International Airport", x: randint(5, 20), y: randint(75, 92), desc: "Main arrival point" });
  pins.push({ id: uid(), type: "station", name: "Central Station", x: randint(75, 92), y: randint(8, 25), desc: "Rail & metro hub" });
  return pins;
}
function buildTrip(form) {
  const tmpl = getTemplate(form.destination);
  const start = form.startDate ? new Date(form.startDate) : new Date();
  const end = form.endDate ? new Date(form.endDate) : addDays(start, 4);
  const numDays = Math.max(1, Math.round((end - start) / 86400000) + 1);
  const travelers = parseInt(form.travelers, 10) || 1;

  const days = Array.from({ length: numDays }).map((_, i) => {
    const morningA = tmpl.attractions[i % tmpl.attractions.length];
    const afternoonA = tmpl.attractions[(i + 1) % tmpl.attractions.length];
    const lunchR = tmpl.restaurants[i % tmpl.restaurants.length];
    const evening = tmpl.evenings[i % tmpl.evenings.length];
    const lunchCost = { "$": 12, "$$": 25, "$$$": 45, "$$$$": 80 }[lunchR.budget] || 20;
    const eveningCost = randint(15, 60);
    const estCost = morningA.price + afternoonA.price + lunchCost + eveningCost;
    return {
      date: addDays(start, i).toISOString(),
      morning: { title: morningA.name, desc: `Explore ${morningA.name} — allow about ${morningA.duration}.`, cost: morningA.price, duration: morningA.duration },
      lunch: { title: lunchR.name, desc: `${lunchR.cuisine} · ${lunchR.budget}`, cost: lunchCost, duration: "1h" },
      afternoon: { title: afternoonA.name, desc: `Continue on to ${afternoonA.name} — allow about ${afternoonA.duration}.`, cost: afternoonA.price, duration: afternoonA.duration },
      evening: { title: evening, desc: "Wind down and soak in the local atmosphere.", cost: eveningCost, duration: "2h" },
      estCost, estTravelTime: randint(15, 45),
    };
  });

  const budgetTotal = form.budget ? parseFloat(form.budget) : numDays * travelers * 180;
  const flightWeight = form.transport === "Flight" ? 0.34 : 0.18;
  const weights = { flights: flightWeight, hotels: 0.28, food: 0.16, transportation: 0.09, activities: 0.13, shopping: 0.05 };
  const wSum = Object.values(weights).reduce((a, b) => a + b, 0);
  const budgetBreakdown = {};
  Object.keys(weights).forEach((k) => { budgetBreakdown[k] = Math.round((weights[k] / wSum) * budgetTotal); });

  const weather = generateWeather(tmpl, numDays);
  const attractions = tmpl.attractions.map((a) => ({ ...a, id: uid(), saved: false }));
  const restaurants = tmpl.restaurants.map((r) => ({ ...r, id: uid(), favorite: false }));
  const hotels = tmpl.hotels.map((h) => ({ ...h, id: uid() }));
  const packing = generatePacking(tmpl, form, weather);
  const mapPins = generateMapPins(tmpl, attractions, hotels, restaurants);
  const expenses = Object.keys(budgetBreakdown).map((cat) => ({ id: uid(), category: cat, planned: budgetBreakdown[cat], actual: 0, note: "" }));

  return {
    id: uid(), destination: form.destination || "Untitled trip", country: tmpl.country, emoji: tmpl.emoji, gradient: tmpl.gradient,
    startDate: start.toISOString(), endDate: end.toISOString(), numDays, travelers, budgetTotal, interests: form.interests || [],
    accommodation: form.accommodation || "Mid-range", transport: form.transport || "Flight", distanceKm: tmpl.distanceKm,
    days, budgetBreakdown, weather, attractions, restaurants, hotels, packing, mapPins, expenses,
    documents: {
      passport: { fullName: "", passportNumber: "", expiryDate: "", nationality: "" },
      flights: [], hotelReservations: [], insurance: { provider: "", policyNumber: "", coverage: "" }, emergencyContacts: [],
    },
    chat: [{ role: "assistant", text: `Your ${form.destination || "trip"} itinerary is ready! Ask me things like "What should I visit first?" or "Find hidden gems."` }],
    createdAt: Date.now(),
  };
}

/* ============================== UI PRIMITIVES ============================== */
function GlassCard({ t, children, style, className = "", onClick }) {
  return (
    <div onClick={onClick} className={"rounded-2xl backdrop-blur-md " + className}
      style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadow, ...style }}>
      {children}
    </div>
  );
}
function IconCircle({ t, color, Icon, size = 40 }) {
  return (
    <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: size, height: size, background: `${color}1E`, color }}>
      <Icon size={size * 0.5} />
    </div>
  );
}
function Btn({ t, children, onClick, variant = "primary", className = "", type = "button", disabled }) {
  const base = "inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none";
  const styles = {
    primary: { background: t.coral, color: "#0B1220" },
    ghost: { background: "transparent", color: t.text, border: `1px solid ${t.border}` },
    danger: { background: `${t.rose}1A`, color: t.rose, border: `1px solid ${t.rose}33` },
  };
  return <button type={type} onClick={onClick} disabled={disabled} className={base + " " + className} style={styles[variant]}>{children}</button>;
}
function ProgressBar({ pct, color, t, height = 8 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const id = setTimeout(() => setW(Math.min(100, pct)), 80); return () => clearTimeout(id); }, [pct]);
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height, background: t.surfaceStrong }}>
      <div className="h-full rounded-full transition-[width] duration-[1100ms] ease-out" style={{ width: `${w}%`, background: color, boxShadow: `0 0 12px ${color}55` }} />
    </div>
  );
}
function Modal({ t, title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(5,6,8,0.6)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={"w-full max-h-[85vh] overflow-y-auto rounded-2xl p-6 fade-in-up " + (wide ? "max-w-xl" : "max-w-md")}
        style={{ background: t.bgSoft, border: `1px solid ${t.borderStrong}`, boxShadow: t.shadow }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold disp" style={{ color: t.text }}>{title}</h3>
          <button onClick={onClose} style={{ color: t.textMuted }} className="hover:opacity-70"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Field({ t, label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: t.textMuted }}>{label}</label>
      {children}
    </div>
  );
}
const inputStyle = (t) => ({ background: t.surfaceStrong, border: `1px solid ${t.border}`, color: t.text });
function Skeleton({ t, className, style }) { return <div className={"skeleton rounded-xl " + className} style={{ background: t.surfaceStrong, ...style }} />; }
function Toggle({ t, on, onClick }) {
  return (
    <button onClick={onClick} className="w-11 h-6 rounded-full flex items-center px-0.5 transition-colors shrink-0" style={{ background: on ? t.coral : t.surfaceStrong }}>
      <span className="w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: on ? "translateX(20px)" : "translateX(0)" }} />
    </button>
  );
}
function StarRating({ rating, color }) {
  return <span className="inline-flex items-center gap-1 text-xs num" style={{ color }}><Star size={12} fill={color} stroke="none" /> {rating}</span>;
}
function Pill({ t, children, active, onClick }) {
  return (
    <button onClick={onClick} className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors"
      style={{ background: active ? t.coral : t.surface, color: active ? "#0B1220" : t.textMuted, border: `1px solid ${active ? t.coral : t.border}` }}>
      {children}
    </button>
  );
}

/* ============================== APP ============================== */
export default function TravelPlanner() {
  const [theme, setTheme] = useState("dark");
  const t = theme === "dark" ? DARK : LIGHT;
  const [view, setView] = useState("dashboard"); // dashboard | generator | trips | trip
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [trips, setTrips] = useState(() => [
    buildTrip({ destination: "Tokyo", startDate: addDays(new Date(), 21).toISOString(), endDate: addDays(new Date(), 27).toISOString(), travelers: 2, budget: 3200, interests: ["Food", "Culture", "Nightlife"], accommodation: "Mid-range", transport: "Flight" }),
    buildTrip({ destination: "Rome", startDate: addDays(new Date(), -40).toISOString(), endDate: addDays(new Date(), -34).toISOString(), travelers: 2, budget: 2600, interests: ["History", "Food"], accommodation: "Boutique", transport: "Flight" }),
  ]);
  const [activeTripId, setActiveTripId] = useState(null);
  const [tripTab, setTripTab] = useState("itinerary");
  const activeTrip = trips.find((tr) => tr.id === activeTripId) || null;

  const [genForm, setGenForm] = useState({ destination: "", startDate: "", endDate: "", budget: "", travelers: 2, interests: [], accommodation: "Mid-range", transport: "Flight" });
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);

  const [selectedPin, setSelectedPin] = useState(null);
  const [expenseModal, setExpenseModal] = useState(null);
  const [docModal, setDocModal] = useState(null);
  const [tripMetaModal, setTripMetaModal] = useState(false);
  const [itineraryModal, setItineraryModal] = useState(null);
  const [attractionModal, setAttractionModal] = useState(null);
  const [restaurantModal, setRestaurantModal] = useState(null);
  const [hotelModal, setHotelModal] = useState(null);
  const [budgetCatModal, setBudgetCatModal] = useState(null);
  const [toast, setToast] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { const id = setTimeout(() => setLoading(false), 900); return () => clearTimeout(id); }, []);
  useEffect(() => {
    if (!document.getElementById("tp-fonts")) {
      const link = document.createElement("link");
      link.id = "tp-fonts"; link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";
      document.head.appendChild(link);
    }
  }, []);
  useEffect(() => { if (view === "trip" && tripTab === "assistant") chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeTrip?.chat, view, tripTab]);
  useEffect(() => { if (toast) { const id = setTimeout(() => setToast(""), 2200); return () => clearTimeout(id); } }, [toast]);

  function updateTrip(id, updater) {
    setTrips((prev) => prev.map((tr) => (tr.id === id ? updater(tr) : tr)));
  }

  function runGenerator() {
    if (!genForm.destination.trim()) return;
    setGenerating(true); setGenStep(0);
    const steps = ["Scouting attractions & hidden gems…", "Balancing your budget…", "Building your day-by-day itinerary…", "Checking the weather forecast…", "Packing your bags…"];
    let i = 0;
    const interval = setInterval(() => { i++; setGenStep(i); if (i >= steps.length - 1) clearInterval(interval); }, 480);
    setTimeout(() => {
      clearInterval(interval);
      const trip = buildTrip(genForm);
      setTrips((prev) => [trip, ...prev]);
      setActiveTripId(trip.id);
      setTripTab("itinerary");
      setGenerating(false);
      setView("trip");
      setGenForm({ destination: "", startDate: "", endDate: "", budget: "", travelers: 2, interests: [], accommodation: "Mid-range", transport: "Flight" });
    }, 480 * steps.length + 300);
    window.__tp_steps = steps;
  }

  function openTrip(id) { setActiveTripId(id); setTripTab("itinerary"); setView("trip"); }
  function duplicateTrip(id) {
    const src = trips.find((tr) => tr.id === id);
    if (!src) return;
    const copy = { ...src, id: uid(), destination: src.destination + " (copy)", createdAt: Date.now() };
    setTrips((prev) => [copy, ...prev]);
    setToast("Trip duplicated");
  }
  function deleteTrip(id) {
    setTrips((prev) => prev.filter((tr) => tr.id !== id));
    if (activeTripId === id) { setActiveTripId(null); setView("trips"); }
  }
  function shareTrip(trip) {
    const text = `${trip.destination} trip · ${fmtDate(trip.startDate)} – ${fmtDate(trip.endDate)} · ${trip.numDays} days · ${money(trip.budgetTotal)} budget`;
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    setToast("Trip summary copied to clipboard");
  }

  function toggleSaveAttraction(attrId) {
    updateTrip(activeTripId, (tr) => ({ ...tr, attractions: tr.attractions.map((a) => (a.id === attrId ? { ...a, saved: !a.saved } : a)) }));
  }
  function toggleFavoriteRestaurant(rId) {
    updateTrip(activeTripId, (tr) => ({ ...tr, restaurants: tr.restaurants.map((r) => (r.id === rId ? { ...r, favorite: !r.favorite } : r)) }));
  }
  function togglePacking(itemId) {
    updateTrip(activeTripId, (tr) => ({ ...tr, packing: tr.packing.map((p) => (p.id === itemId ? { ...p, checked: !p.checked } : p)) }));
  }
  function saveExpense(data) {
    updateTrip(activeTripId, (tr) => ({
      ...tr,
      expenses: data.id ? tr.expenses.map((e) => (e.id === data.id ? data : e)) : [...tr.expenses, { ...data, id: uid() }],
    }));
    setExpenseModal(null);
  }
  function saveDocuments(patch) {
    updateTrip(activeTripId, (tr) => ({ ...tr, documents: { ...tr.documents, ...patch } }));
    setDocModal(null);
  }
  function deleteDocEntry(section, index) {
    updateTrip(activeTripId, (tr) => ({ ...tr, documents: { ...tr.documents, [section]: tr.documents[section].filter((_, i) => i !== index) } }));
  }

  function saveTripMeta(patch) {
    updateTrip(activeTripId, (tr) => {
      const start = new Date(patch.startDate || tr.startDate);
      const end = new Date(patch.endDate || tr.endDate);
      const numDays = Math.max(1, Math.round((end - start) / 86400000) + 1);
      let days = tr.days;
      if (numDays !== tr.days.length) {
        const arr = [...tr.days];
        if (numDays > arr.length) { for (let i = arr.length; i < numDays; i++) arr.push({ ...arr[i % tr.days.length] }); }
        else { arr.length = numDays; }
        days = arr;
      }
      days = days.map((d, i) => ({ ...d, date: addDays(start, i).toISOString() }));
      return { ...tr, ...patch, startDate: start.toISOString(), endDate: end.toISOString(), numDays, days };
    });
    setTripMetaModal(false);
  }

  function saveItineraryBlock(dayIndex, blockKey, data) {
    updateTrip(activeTripId, (tr) => {
      const days = tr.days.map((d, i) => {
        if (i !== dayIndex) return d;
        const updated = { ...d, [blockKey]: data };
        updated.estCost = updated.morning.cost + updated.lunch.cost + updated.afternoon.cost + updated.evening.cost;
        return updated;
      });
      return { ...tr, days };
    });
    setItineraryModal(null);
  }

  function saveAttraction(data) {
    updateTrip(activeTripId, (tr) => {
      if (data.id) return { ...tr, attractions: tr.attractions.map((a) => (a.id === data.id ? { ...a, ...data } : a)) };
      const newAttr = { ...data, id: uid(), saved: false };
      const pins = [...tr.mapPins, { id: newAttr.id, type: "attraction", name: newAttr.name, x: randint(15, 85), y: randint(15, 85), desc: `Rated ${newAttr.rating}★ · ${newAttr.duration} visit` }];
      return { ...tr, attractions: [...tr.attractions, newAttr], mapPins: pins };
    });
    setAttractionModal(null);
  }
  function deleteAttraction(id) {
    updateTrip(activeTripId, (tr) => ({ ...tr, attractions: tr.attractions.filter((a) => a.id !== id), mapPins: tr.mapPins.filter((p) => p.id !== id) }));
  }

  function saveRestaurant(data) {
    updateTrip(activeTripId, (tr) => {
      if (data.id) return { ...tr, restaurants: tr.restaurants.map((r) => (r.id === data.id ? { ...r, ...data } : r)) };
      const newR = { ...data, id: uid(), favorite: false };
      const restaurantPinCount = tr.mapPins.filter((p) => p.type === "restaurant").length;
      const pins = restaurantPinCount < 3 ? [...tr.mapPins, { id: newR.id, type: "restaurant", name: newR.name, x: randint(15, 85), y: randint(15, 85), desc: `${newR.cuisine} · ${newR.budget}` }] : tr.mapPins;
      return { ...tr, restaurants: [...tr.restaurants, newR], mapPins: pins };
    });
    setRestaurantModal(null);
  }
  function deleteRestaurant(id) {
    updateTrip(activeTripId, (tr) => ({ ...tr, restaurants: tr.restaurants.filter((r) => r.id !== id), mapPins: tr.mapPins.filter((p) => p.id !== id) }));
  }

  function saveHotel(data) {
    updateTrip(activeTripId, (tr) => {
      if (data.id) return { ...tr, hotels: tr.hotels.map((h) => (h.id === data.id ? { ...h, ...data } : h)) };
      const newH = { ...data, id: uid() };
      const pins = [...tr.mapPins, { id: newH.id, type: "hotel", name: newH.name, x: randint(15, 85), y: randint(15, 85), desc: `${money(newH.pricePerNight)}/night · ${newH.area}` }];
      return { ...tr, hotels: [...tr.hotels, newH], mapPins: pins };
    });
    setHotelModal(null);
  }
  function deleteHotel(id) {
    updateTrip(activeTripId, (tr) => ({ ...tr, hotels: tr.hotels.filter((h) => h.id !== id), mapPins: tr.mapPins.filter((p) => p.id !== id) }));
  }

  function saveBudgetCategory(category, amount) {
    updateTrip(activeTripId, (tr) => ({
      ...tr,
      budgetBreakdown: { ...tr.budgetBreakdown, [category]: amount },
      expenses: tr.expenses.map((e) => (e.category === category ? { ...e, planned: amount } : e)),
    }));
    setBudgetCatModal(null);
  }

  function addPackingItem(text) {
    if (!text.trim()) return;
    updateTrip(activeTripId, (tr) => ({ ...tr, packing: [...tr.packing, { id: uid(), item: text, category: "Custom", checked: false }] }));
  }
  function deletePackingItem(id) {
    updateTrip(activeTripId, (tr) => ({ ...tr, packing: tr.packing.filter((p) => p.id !== id) }));
  }
  function deleteExpense(id) {
    updateTrip(activeTripId, (tr) => ({ ...tr, expenses: tr.expenses.filter((e) => e.id !== id) }));
  }

  function craftAssistantReply(question, trip) {
    const q = question.toLowerCase();
    if (q.includes("visit first") || q.includes("start")) {
      const top = [...trip.attractions].sort((a, b) => b.rating - a.rating)[0];
      return top ? `Start with ${top.name} — it's your highest-rated attraction at ${top.rating}★, and going early means shorter queues.` : "Add some attractions first and I'll suggest an order.";
    }
    if (q.includes("hidden gem")) {
      const gem = [...trip.attractions].sort((a, b) => a.price - b.price).find((a) => a.rating >= 4.3);
      return gem ? `${gem.name} is a great hidden gem — ${gem.price === 0 ? "free to visit" : `only ${money(gem.price)}`} and rated ${gem.rating}★, but often overlooked compared to the big landmarks.` : "Explore local markets and side streets — that's usually where the hidden gems are.";
    }
    if (q.includes("cheap") && q.includes("hotel")) {
      const cheapest = [...trip.hotels].sort((a, b) => a.pricePerNight - b.pricePerNight)[0];
      return cheapest ? `${cheapest.name} in ${cheapest.area} is your best value at ${money(cheapest.pricePerNight)}/night, still rated ${cheapest.rating}★.` : "I don't have hotel options loaded for this trip yet.";
    }
    if (q.includes("pack")) {
      const cats = [...new Set(trip.packing.map((p) => p.category))];
      return `Your packing list covers ${cats.join(", ").toLowerCase()} — ${trip.packing.length} items in total. Check the Packing tab to tick things off as you go.`;
    }
    if (q.includes("airport") || q.includes("get to") || q.includes("from the airport")) {
      return trip.transport === "Flight"
        ? "From the airport, the fastest option is usually an express train or metered taxi into the city center — budget 30–60 minutes depending on traffic."
        : `Since you're arriving by ${trip.transport.toLowerCase()}, your central station connects directly to most neighborhoods by local transit.`;
    }
    if (q.includes("restaurant") || q.includes("eat") || q.includes("food")) {
      const top = [...trip.restaurants].sort((a, b) => b.rating - a.rating)[0];
      return top ? `${top.name} is the top-rated pick for ${top.cuisine.toLowerCase()} at ${top.budget} — worth booking ahead.` : "Check the Restaurants tab for options.";
    }
    if (q.includes("budget") || q.includes("cost") || q.includes("expensive")) {
      const biggest = Object.entries(trip.budgetBreakdown).sort((a, b) => b[1] - a[1])[0];
      return `Your total budget is ${money(trip.budgetTotal)}, with ${biggest[0]} as the largest share at ${money(biggest[1])}. The Budget tab breaks down every category.`;
    }
    return `I have your full ${trip.destination} plan loaded — ask me about what to visit first, hidden gems, cheaper hotels, what to pack, or getting around.`;
  }
  function sendChat() {
    if (!chatInput.trim() || !activeTrip) return;
    const q = chatInput;
    updateTrip(activeTripId, (tr) => ({ ...tr, chat: [...tr.chat, { role: "user", text: q }] }));
    setChatInput(""); setChatBusy(true);
    setTimeout(() => {
      updateTrip(activeTripId, (tr) => ({ ...tr, chat: [...tr.chat, { role: "assistant", text: craftAssistantReply(q, tr) }] }));
      setChatBusy(false);
    }, 700 + Math.random() * 500);
  }

  const NAV = [
    { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { key: "generator", label: "Plan a Trip", Icon: Sparkles },
    { key: "trips", label: "My Trips", Icon: PlaneTakeoff },
  ];
  const TRIP_TABS = [
    { key: "itinerary", label: "Itinerary", Icon: Calendar },
    { key: "map", label: "Map", Icon: MapIcon },
    { key: "budget", label: "Budget", Icon: Wallet },
    { key: "attractions", label: "Attractions", Icon: Landmark },
    { key: "restaurants", label: "Restaurants", Icon: Utensils },
    { key: "hotels", label: "Hotels", Icon: Hotel },
    { key: "weather", label: "Weather", Icon: CloudSun },
    { key: "packing", label: "Packing", Icon: Luggage },
    { key: "documents", label: "Documents", Icon: FileText },
    { key: "expenses", label: "Expenses", Icon: DollarSign },
    { key: "assistant", label: "Assistant", Icon: Bot },
  ];

  return (
    <div style={{ background: t.bg, color: t.text, fontFamily: "'Inter',sans-serif", minHeight: "100vh" }} className="w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${t.borderStrong}; border-radius: 8px; }
        .num { font-family: 'JetBrains Mono', monospace; }
        .disp { font-family: 'Space Grotesk', sans-serif; }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(10px);} to {opacity:1; transform: translateY(0);} }
        .fade-in-up { animation: fadeInUp .45s ease both; }
        @keyframes shimmer { 0% { background-position: -400px 0;} 100% { background-position: 400px 0;} }
        .skeleton { background-image: linear-gradient(90deg, ${t.surfaceStrong} 25%, ${t.borderStrong} 37%, ${t.surfaceStrong} 63%); background-size: 400px 100%; animation: shimmer 1.4s ease infinite; }
        .card-hover { transition: transform .2s ease, box-shadow .2s ease; }
        .card-hover:hover { transform: translateY(-2px); }
        @keyframes dotPulse { 0%,80%,100% { opacity: .25; } 40% { opacity: 1; } }
        .dot { animation: dotPulse 1.2s infinite ease-in-out; }
        @keyframes pinPulse { 0% { box-shadow: 0 0 0 0 rgba(255,122,89,0.5);} 70% { box-shadow: 0 0 0 10px rgba(255,122,89,0);} 100% { box-shadow: 0 0 0 0 rgba(255,122,89,0);} }
        .pin-pulse { animation: pinPulse 2s infinite; }
        input, select, textarea { outline: none; }
      `}</style>

      <div className="flex">
        {/* -------- Sidebar -------- */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 px-4 py-6" style={{ borderRight: `1px solid ${t.border}` }}>
          <div className="flex items-center gap-2.5 px-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${t.coral}20` }}>
              <Compass size={18} color={t.coral} />
            </div>
            <div>
              <div className="disp font-semibold text-[15px] leading-none">Wayfare</div>
              <div className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: t.textFaint }}>Travel Planner</div>
            </div>
          </div>
          <nav className="space-y-1">
            {NAV.map((n) => (
              <button key={n.key} onClick={() => { setView(n.key); setActiveTripId(null); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ background: view === n.key ? t.surfaceStrong : "transparent", color: view === n.key ? t.text : t.textMuted }}>
                <n.Icon size={17} />{n.label}
              </button>
            ))}
          </nav>
          {trips.length > 0 && (
            <div className="mt-5">
              <div className="text-[10px] uppercase tracking-widest px-3 mb-2" style={{ color: t.textFaint }}>Recent trips</div>
              <div className="space-y-1 max-h-52 overflow-y-auto">
                {trips.slice(0, 5).map((tr) => (
                  <button key={tr.id} onClick={() => openTrip(tr.id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left"
                    style={{ background: activeTripId === tr.id ? t.surfaceStrong : "transparent", color: t.textMuted }}>
                    <span>{tr.emoji}</span><span className="truncate">{tr.destination}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex-1" />
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs mb-3" style={{ border: `1px solid ${t.border}`, color: t.textMuted }}>
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />} {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <a href="https://kamilziane.netlify.app/" target="_blank" rel="noopener noreferrer"
            className="rounded-xl px-3 py-3 text-center text-[11px] leading-relaxed hover:opacity-80 transition-opacity"
            style={{ border: `1px solid ${t.border}`, color: t.textFaint }}>
            Designed &amp; built by<br /><span style={{ color: t.coral }} className="font-medium">Kamil Ziane</span>
          </a>
        </aside>

        {/* -------- Mobile top bar + drawer -------- */}
        <div className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14" style={{ background: `${t.bg}F2`, borderBottom: `1px solid ${t.border}`, backdropFilter: "blur(8px)" }}>
          <button onClick={() => setMobileNavOpen(true)} style={{ color: t.text }}><Menu size={20} /></button>
          <div className="disp font-semibold text-sm">Wayfare</div>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ color: t.text }}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>
        {mobileNavOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex" style={{ background: "rgba(5,6,8,0.6)" }} onClick={() => setMobileNavOpen(false)}>
            <div onClick={(e) => e.stopPropagation()} className="w-64 h-full p-5 fade-in-up" style={{ background: t.bgSoft, borderRight: `1px solid ${t.border}` }}>
              <div className="flex items-center justify-between mb-6">
                <div className="disp font-semibold">Wayfare</div>
                <button onClick={() => setMobileNavOpen(false)} style={{ color: t.textMuted }}><X size={18} /></button>
              </div>
              <div className="space-y-1">
                {NAV.map((n) => (
                  <button key={n.key} onClick={() => { setView(n.key); setActiveTripId(null); setMobileNavOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: view === n.key ? t.surfaceStrong : "transparent", color: view === n.key ? t.text : t.textMuted }}>
                    <n.Icon size={17} />{n.label}
                  </button>
                ))}
              </div>
              <a href="https://kamilziane.netlify.app/" target="_blank" rel="noopener noreferrer" className="block mt-6 text-[11px] text-center" style={{ color: t.textFaint }}>
                Built by <span style={{ color: t.coral }}>Kamil Ziane</span>
              </a>
            </div>
          </div>
        )}

        {/* -------- Main -------- */}
        <main className="flex-1 min-w-0 pt-16 md:pt-0">
          <div className="p-4 md:p-8 max-w-6xl mx-auto">
            {loading ? (
              <div className="fade-in-up">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} t={t} className="h-24" />)}</div>
                <Skeleton t={t} className="h-72" />
              </div>
            ) : (
              <>
                {view === "dashboard" && <DashboardView t={t} trips={trips} onOpen={openTrip} onPlan={() => setView("generator")} />}
                {view === "generator" && <GeneratorView t={t} form={genForm} setForm={setGenForm} onGenerate={runGenerator} generating={generating} genStep={genStep} />}
                {view === "trips" && <TripsView t={t} trips={trips} onOpen={openTrip} onDuplicate={duplicateTrip} onDelete={deleteTrip} onShare={shareTrip} onPlan={() => setView("generator")} />}
                {view === "trip" && activeTrip && (
                  <TripWorkspace t={t} trip={activeTrip} tripTab={tripTab} setTripTab={setTripTab} TRIP_TABS={TRIP_TABS}
                    onBack={() => setView("trips")} selectedPin={selectedPin} setSelectedPin={setSelectedPin}
                    onToggleSaveAttraction={toggleSaveAttraction} onToggleFavoriteRestaurant={toggleFavoriteRestaurant}
                    onTogglePacking={togglePacking} onAddExpense={() => setExpenseModal({ mode: "add" })}
                    onEditExpense={(e) => setExpenseModal({ mode: "edit", data: e })} onDeleteExpense={deleteExpense}
                    onEditDocs={(section) => setDocModal(section)} onDeleteDocEntry={deleteDocEntry}
                    chatInput={chatInput} setChatInput={setChatInput} onSendChat={sendChat} chatBusy={chatBusy} chatEndRef={chatEndRef}
                    onDuplicate={() => duplicateTrip(activeTrip.id)} onShare={() => shareTrip(activeTrip)} onDelete={() => deleteTrip(activeTrip.id)}
                    onEditMeta={() => setTripMetaModal(true)}
                    onEditBlock={(dayIndex, blockKey, data) => setItineraryModal({ dayIndex, blockKey, data })}
                    onAddAttraction={() => setAttractionModal({ mode: "add" })} onEditAttraction={(a) => setAttractionModal({ mode: "edit", data: a })} onDeleteAttraction={deleteAttraction}
                    onAddRestaurant={() => setRestaurantModal({ mode: "add" })} onEditRestaurant={(r) => setRestaurantModal({ mode: "edit", data: r })} onDeleteRestaurant={deleteRestaurant}
                    onAddHotel={() => setHotelModal({ mode: "add" })} onEditHotel={(h) => setHotelModal({ mode: "edit", data: h })} onDeleteHotel={deleteHotel}
                    onEditBudgetCategory={(category, value) => setBudgetCatModal({ category, value })}
                    onAddPackingItem={addPackingItem} onDeletePackingItem={deletePackingItem} />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 flex justify-around py-2" style={{ background: `${t.bg}F2`, borderTop: `1px solid ${t.border}`, backdropFilter: "blur(8px)" }}>
        {NAV.map((n) => (
          <button key={n.key} onClick={() => { setView(n.key); setActiveTripId(null); }} className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px]" style={{ color: view === n.key ? t.coral : t.textFaint }}>
            <n.Icon size={18} />{n.label.split(" ")[0]}
          </button>
        ))}
      </div>

      {expenseModal && activeTrip && <ExpenseModal t={t} mode={expenseModal.mode} data={expenseModal.data} onClose={() => setExpenseModal(null)} onSave={saveExpense} />}
      {docModal && activeTrip && <DocumentModal t={t} section={docModal} trip={activeTrip} onClose={() => setDocModal(null)} onSave={saveDocuments} />}
      {tripMetaModal && activeTrip && <TripMetaModal t={t} trip={activeTrip} onClose={() => setTripMetaModal(false)} onSave={saveTripMeta} />}
      {itineraryModal && activeTrip && <ItineraryBlockModal t={t} blockKey={itineraryModal.blockKey} data={itineraryModal.data} onClose={() => setItineraryModal(null)} onSave={(data) => saveItineraryBlock(itineraryModal.dayIndex, itineraryModal.blockKey, data)} />}
      {attractionModal && activeTrip && <AttractionModal t={t} mode={attractionModal.mode} data={attractionModal.data} onClose={() => setAttractionModal(null)} onSave={saveAttraction} />}
      {restaurantModal && activeTrip && <RestaurantModal t={t} mode={restaurantModal.mode} data={restaurantModal.data} onClose={() => setRestaurantModal(null)} onSave={saveRestaurant} />}
      {hotelModal && activeTrip && <HotelModal t={t} mode={hotelModal.mode} data={hotelModal.data} onClose={() => setHotelModal(null)} onSave={saveHotel} />}
      {budgetCatModal && activeTrip && <BudgetCategoryModal t={t} category={budgetCatModal.category} value={budgetCatModal.value} onClose={() => setBudgetCatModal(null)} onSave={(amt) => saveBudgetCategory(budgetCatModal.category, amt)} />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm fade-in-up" style={{ background: t.bgSoft, border: `1px solid ${t.borderStrong}`, color: t.text, boxShadow: t.shadow }}>
          {toast}
        </div>
      )}
    </div>
  );
}

/* ============================== DASHBOARD ============================== */
function StatCard({ t, label, value, sub, Icon, color, delay }) {
  return (
    <GlassCard t={t} className="p-4 md:p-5 card-hover fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs font-medium uppercase tracking-wide" style={{ color: t.textMuted }}>{label}</div>
        <IconCircle t={t} color={color} Icon={Icon} size={32} />
      </div>
      <div className="num text-xl md:text-2xl font-semibold disp">{value}</div>
      {sub && <div className="text-xs mt-1.5" style={{ color: t.textFaint }}>{sub}</div>}
    </GlassCard>
  );
}
function DashboardView({ t, trips, onOpen, onPlan }) {
  const now = new Date();
  const upcoming = trips.filter((tr) => new Date(tr.startDate) >= now).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const past = trips.filter((tr) => new Date(tr.startDate) < now);
  const countries = [...new Set(trips.map((tr) => tr.country).filter(Boolean))];
  const totalDistance = trips.reduce((s, tr) => s + tr.distanceKm * 2, 0);
  const moneySpent = past.reduce((s, tr) => s + tr.expenses.reduce((es, e) => es + (e.actual || 0), 0), 0) || past.reduce((s, tr) => s + tr.budgetTotal * 0.85, 0);
  const favorite = trips.flatMap((tr) => tr.attractions.filter((a) => a.saved).map((a) => ({ ...a, trip: tr.destination })));
  const spendByTrip = trips.slice(0, 6).map((tr) => ({ name: tr.destination.split(" ")[0], budget: tr.budgetTotal }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="disp text-xl font-semibold">Welcome back, traveler</div>
          <div className="text-sm" style={{ color: t.textFaint }}>Here's where your journeys stand</div>
        </div>
        <Btn t={t} onClick={onPlan}><Sparkles size={15} /> Plan a new trip</Btn>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard t={t} label="Upcoming trips" value={upcoming.length} sub={upcoming[0] ? `Next: ${upcoming[0].destination}` : "None planned yet"} Icon={PlaneTakeoff} color={t.coral} delay={0} />
        <StatCard t={t} label="Countries visited" value={countries.length} sub={countries.slice(0, 3).join(", ") || "—"} Icon={Globe2} color={t.teal} delay={40} />
        <StatCard t={t} label="Distance traveled" value={`${totalDistance.toLocaleString()} km`} sub="Across all trips" Icon={TrendingUp} color={t.indigo} delay={80} />
        <StatCard t={t} label="Spent on travel" value={money(moneySpent)} sub="From completed trips" Icon={Wallet} color={t.gold} delay={120} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <GlassCard t={t} className="p-5 md:col-span-2 fade-in-up" style={{ animationDelay: "160ms" }}>
          <div className="disp font-semibold text-sm mb-4">Upcoming trips</div>
          {upcoming.length === 0 ? (
            <div className="text-sm py-8 text-center" style={{ color: t.textFaint }}>No upcoming trips yet — plan your next adventure.</div>
          ) : (
            <div className="space-y-2">
              {upcoming.map((tr) => (
                <button key={tr.id} onClick={() => onOpen(tr.id)} className="w-full flex items-center gap-3 p-3 rounded-xl text-left" style={{ background: t.surfaceStrong }}>
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center text-lg shrink-0" style={{ background: `linear-gradient(135deg, ${tr.gradient[0]}, ${tr.gradient[1]})` }}>{tr.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{tr.destination}</div>
                    <div className="text-[11px]" style={{ color: t.textFaint }}>{fmtDate(tr.startDate)} – {fmtDate(tr.endDate)} · {tr.numDays} days</div>
                  </div>
                  <ChevronRight size={16} style={{ color: t.textFaint }} />
                </button>
              ))}
            </div>
          )}
        </GlassCard>
        <GlassCard t={t} className="p-5 fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="disp font-semibold text-sm mb-4 flex items-center gap-1.5"><Heart size={14} color={t.coral} /> Favorite spots</div>
          {favorite.length === 0 ? (
            <div className="text-xs" style={{ color: t.textFaint }}>Save attractions from a trip to see them here.</div>
          ) : (
            <div className="space-y-2.5">
              {favorite.slice(0, 5).map((f) => (
                <div key={f.id} className="text-xs">
                  <div className="font-medium">{f.name}</div>
                  <div style={{ color: t.textFaint }}>{f.trip} · {f.rating}★</div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      <GlassCard t={t} className="p-5 fade-in-up" style={{ animationDelay: "240ms" }}>
        <div className="disp font-semibold text-sm mb-4">Budget by trip</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={spendByTrip}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: t.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: t.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
            <Tooltip contentStyle={{ background: t.bgSoft, border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 12 }} formatter={(v) => money(v)} />
            <Bar dataKey="budget" fill={t.coral} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      <div className="text-center text-[11px] pt-2" style={{ color: t.textFaint }}>
        Wayfare is a travel planning concept — designed &amp; built by{" "}
        <a href="https://kamilziane.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: t.coral }} className="font-medium hover:underline">Kamil Ziane</a>.
      </div>
    </div>
  );
}

/* ============================== GENERATOR ============================== */
function GeneratorView({ t, form, setForm, onGenerate, generating, genStep }) {
  const steps = ["Scouting attractions & hidden gems…", "Balancing your budget…", "Building your day-by-day itinerary…", "Checking the weather forecast…", "Packing your bags…"];
  function toggleInterest(i) {
    setForm((f) => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i] }));
  }
  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center py-24 fade-in-up text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${t.coral}20` }}>
          <Sparkles size={28} color={t.coral} className="animate-pulse" />
        </div>
        <div className="disp text-lg font-semibold mb-2">Crafting your {form.destination || "trip"}…</div>
        <div className="text-sm mb-6" style={{ color: t.textFaint }}>{steps[Math.min(genStep, steps.length - 1)]}</div>
        <div className="w-64"><ProgressBar t={t} color={t.coral} pct={((genStep + 1) / steps.length) * 100} /></div>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="text-center mb-2">
        <div className="disp text-xl font-semibold">Where to next?</div>
        <div className="text-sm" style={{ color: t.textFaint }}>Tell Wayfare your preferences and get a complete trip plan in seconds</div>
      </div>
      <GlassCard t={t} className="p-6">
        <Field t={t} label="Destination">
          <input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="e.g. Paris, Tokyo, Bali…" className="w-full rounded-lg px-3 py-2.5 text-sm" style={inputStyle(t)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field t={t} label="Start date"><input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full rounded-lg px-3 py-2.5 text-sm" style={inputStyle(t)} /></Field>
          <Field t={t} label="End date"><input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full rounded-lg px-3 py-2.5 text-sm" style={inputStyle(t)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field t={t} label="Budget (USD)"><input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="e.g. 2500" className="w-full rounded-lg px-3 py-2.5 text-sm num" style={inputStyle(t)} /></Field>
          <Field t={t} label="Travelers"><input type="number" min="1" value={form.travelers} onChange={(e) => setForm({ ...form, travelers: e.target.value })} className="w-full rounded-lg px-3 py-2.5 text-sm num" style={inputStyle(t)} /></Field>
        </div>
        <Field t={t} label="Interests">
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => <Pill key={i} t={t} active={form.interests.includes(i)} onClick={() => toggleInterest(i)}>{i}</Pill>)}
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field t={t} label="Accommodation">
            <select value={form.accommodation} onChange={(e) => setForm({ ...form, accommodation: e.target.value })} className="w-full rounded-lg px-3 py-2.5 text-sm" style={inputStyle(t)}>
              {ACCOMMODATIONS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
          <Field t={t} label="Transportation">
            <select value={form.transport} onChange={(e) => setForm({ ...form, transport: e.target.value })} className="w-full rounded-lg px-3 py-2.5 text-sm" style={inputStyle(t)}>
              {TRANSPORTS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
        </div>
        <Btn t={t} className="w-full mt-2" onClick={onGenerate} disabled={!form.destination.trim()}>
          <Sparkles size={15} /> Generate my trip
        </Btn>
      </GlassCard>
    </div>
  );
}

/* ============================== TRIPS LIST ============================== */
function TripsView({ t, trips, onOpen, onDuplicate, onDelete, onShare, onPlan }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="disp text-lg font-semibold">My Trips</div>
          <div className="text-xs" style={{ color: t.textFaint }}>{trips.length} saved trips</div>
        </div>
        <Btn t={t} onClick={onPlan}><Plus size={15} /> New trip</Btn>
      </div>
      {trips.length === 0 ? (
        <GlassCard t={t} className="p-12 text-center"><div style={{ color: t.textFaint }}>No trips yet — plan your first adventure.</div></GlassCard>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {trips.map((tr, i) => (
            <GlassCard key={tr.id} t={t} className="overflow-hidden card-hover fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="h-24 flex items-center justify-center text-4xl" style={{ background: `linear-gradient(135deg, ${tr.gradient[0]}, ${tr.gradient[1]})` }}>{tr.emoji}</div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-semibold">{tr.destination}</div>
                  <div className="text-xs num" style={{ color: t.textFaint }}>{money(tr.budgetTotal)}</div>
                </div>
                <div className="text-[11px] mb-3" style={{ color: t.textFaint }}>{fmtDate(tr.startDate)} – {fmtDate(tr.endDate)} · {tr.numDays} days · {tr.travelers} traveler{tr.travelers > 1 ? "s" : ""}</div>
                <div className="flex items-center gap-2">
                  <Btn t={t} className="flex-1" onClick={() => onOpen(tr.id)}>Open <ArrowRight size={13} /></Btn>
                  <button onClick={() => onDuplicate(tr.id)} title="Duplicate" className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ border: `1px solid ${t.border}`, color: t.textMuted }}><Copy size={14} /></button>
                  <button onClick={() => onShare(tr)} title="Share" className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ border: `1px solid ${t.border}`, color: t.textMuted }}><Share2 size={14} /></button>
                  <button onClick={() => onDelete(tr.id)} title="Delete" className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ border: `1px solid ${t.border}`, color: t.rose }}><Trash2 size={14} /></button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== TRIP WORKSPACE ============================== */
function TripWorkspace({ t, trip, tripTab, setTripTab, TRIP_TABS, onBack, selectedPin, setSelectedPin, onToggleSaveAttraction, onToggleFavoriteRestaurant, onTogglePacking, onAddExpense, onEditExpense, onDeleteExpense, onEditDocs, onDeleteDocEntry, chatInput, setChatInput, onSendChat, chatBusy, chatEndRef, onDuplicate, onShare, onDelete, onEditMeta, onEditBlock, onAddAttraction, onEditAttraction, onDeleteAttraction, onAddRestaurant, onEditRestaurant, onDeleteRestaurant, onAddHotel, onEditHotel, onDeleteHotel, onEditBudgetCategory, onAddPackingItem, onDeletePackingItem }) {
  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs" style={{ color: t.textFaint }}><ChevronLeft size={14} /> Back to trips</button>

      <GlassCard t={t} className="p-5 overflow-hidden relative">
        <div className="absolute inset-0 opacity-90" style={{ background: `linear-gradient(120deg, ${trip.gradient[0]}, ${trip.gradient[1]})` }} />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="disp text-xl font-semibold text-white flex items-center gap-2">{trip.emoji} {trip.destination}</div>
            <div className="text-xs text-white/80 mt-1">{fmtDate(trip.startDate)} – {fmtDate(trip.endDate)} · {trip.numDays} days · {trip.travelers} traveler{trip.travelers > 1 ? "s" : ""} · {money(trip.budgetTotal)} budget</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onEditMeta} className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 text-white hover:bg-white/20"><Pencil size={14} /></button>
            <button onClick={onDuplicate} className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 text-white hover:bg-white/20"><Copy size={14} /></button>
            <button onClick={onShare} className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 text-white hover:bg-white/20"><Share2 size={14} /></button>
            <button onClick={onDelete} className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 text-white hover:bg-white/20"><Trash2 size={14} /></button>
          </div>
        </div>
      </GlassCard>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TRIP_TABS.map((tb) => (
          <button key={tb.key} onClick={() => setTripTab(tb.key)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap"
            style={{ background: tripTab === tb.key ? t.coral : t.surface, color: tripTab === tb.key ? "#0B1220" : t.textMuted, border: `1px solid ${tripTab === tb.key ? t.coral : t.border}` }}>
            <tb.Icon size={14} />{tb.label}
          </button>
        ))}
      </div>

      {tripTab === "itinerary" && <ItineraryTab t={t} trip={trip} onEditBlock={onEditBlock} />}
      {tripTab === "map" && <MapTab t={t} trip={trip} selectedPin={selectedPin} setSelectedPin={setSelectedPin} />}
      {tripTab === "budget" && <BudgetTab t={t} trip={trip} onEditCategory={onEditBudgetCategory} />}
      {tripTab === "attractions" && <AttractionsTab t={t} trip={trip} onToggleSave={onToggleSaveAttraction} onAdd={onAddAttraction} onEdit={onEditAttraction} onDelete={onDeleteAttraction} />}
      {tripTab === "restaurants" && <RestaurantsTab t={t} trip={trip} onToggleFavorite={onToggleFavoriteRestaurant} onAdd={onAddRestaurant} onEdit={onEditRestaurant} onDelete={onDeleteRestaurant} />}
      {tripTab === "hotels" && <HotelsTab t={t} trip={trip} onAdd={onAddHotel} onEdit={onEditHotel} onDelete={onDeleteHotel} />}
      {tripTab === "weather" && <WeatherTab t={t} trip={trip} />}
      {tripTab === "packing" && <PackingTab t={t} trip={trip} onToggle={onTogglePacking} onAdd={onAddPackingItem} onDelete={onDeletePackingItem} />}
      {tripTab === "documents" && <DocumentsTab t={t} trip={trip} onEdit={onEditDocs} onDeleteEntry={onDeleteDocEntry} />}
      {tripTab === "expenses" && <ExpensesTab t={t} trip={trip} onAdd={onAddExpense} onEdit={onEditExpense} onDelete={onDeleteExpense} />}
      {tripTab === "assistant" && <AssistantTab t={t} trip={trip} chatInput={chatInput} setChatInput={setChatInput} onSend={onSendChat} busy={chatBusy} chatEndRef={chatEndRef} />}
    </div>
  );
}

/* ---------- Itinerary ---------- */
function ItineraryTab({ t, trip, onEditBlock }) {
  const [openDay, setOpenDay] = useState(0);
  const day = trip.days[openDay];
  const blocks = [
    { key: "morning", label: "Morning", data: day.morning },
    { key: "lunch", label: "Lunch", data: day.lunch },
    { key: "afternoon", label: "Afternoon", data: day.afternoon },
    { key: "evening", label: "Evening", data: day.evening },
  ];
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <GlassCard t={t} className="p-3 md:col-span-1">
        <div className="text-xs font-medium uppercase tracking-wide mb-2 px-1" style={{ color: t.textMuted }}>Days</div>
        <div className="flex md:flex-col gap-1.5 overflow-x-auto">
          {trip.days.map((d, i) => (
            <button key={i} onClick={() => setOpenDay(i)} className="flex items-center justify-between px-3 py-2 rounded-xl text-xs whitespace-nowrap"
              style={{ background: openDay === i ? t.coral : "transparent", color: openDay === i ? "#0B1220" : t.textMuted }}>
              <span>Day {i + 1}</span><span className="hidden md:inline ml-2" style={{ opacity: 0.8 }}>{fmtDate(d.date)}</span>
            </button>
          ))}
        </div>
      </GlassCard>
      <div className="md:col-span-3 space-y-3">
        {blocks.map((b, i) => (
          <GlassCard key={b.key} t={t} className="p-4 fade-in-up group" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-medium uppercase tracking-wide" style={{ color: t.coral }}>{b.label}</div>
              <div className="flex items-center gap-2">
                <div className="text-xs num" style={{ color: t.textFaint }}>{money(b.data.cost)}</div>
                <button onClick={() => onEditBlock(openDay, b.key, b.data)} style={{ color: t.textMuted }} className="opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-70"><Pencil size={12} /></button>
              </div>
            </div>
            <div className="text-sm font-semibold mb-1">{b.data.title}</div>
            <div className="text-xs" style={{ color: t.textMuted }}>{b.data.desc}</div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px]" style={{ color: t.textFaint }}><Clock size={11} /> {b.data.duration}</div>
          </GlassCard>
        ))}
        <GlassCard t={t} className="p-4 flex items-center justify-between">
          <div className="text-sm font-medium">Estimated cost for the day</div>
          <div className="num text-lg font-semibold" style={{ color: t.coral }}>{money(day.estCost)}</div>
        </GlassCard>
        <div className="text-[11px] flex items-center gap-1.5" style={{ color: t.textFaint }}><MapPin size={11} /> ~{day.estTravelTime} min estimated travel time between stops</div>
      </div>
    </div>
  );
}

/* ---------- Map (stylized, no external API key required) ---------- */
const PIN_META = {
  attraction: { color: "#F2B84B", Icon: Landmark },
  hotel: { color: "#7C8CF8", Icon: Hotel },
  restaurant: { color: "#FF7A59", Icon: Utensils },
  airport: { color: "#2FD1C5", Icon: PlaneTakeoff },
  station: { color: "#2FD1C5", Icon: TrainFront },
};
function MapTab({ t, trip, selectedPin, setSelectedPin }) {
  const pin = trip.mapPins.find((p) => p.id === selectedPin);
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <GlassCard t={t} className="p-3 md:col-span-2 relative overflow-hidden" style={{ minHeight: 420 }}>
        <div className="absolute inset-3 rounded-xl overflow-hidden" style={{ background: `linear-gradient(160deg, ${t.surfaceStrong}, ${t.bg})`, border: `1px solid ${t.border}` }}>
          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
            {Array.from({ length: 8 }).map((_, i) => <line key={"h" + i} x1="0" y1={`${(i + 1) * 12}%`} x2="100%" y2={`${(i + 1) * 12}%`} stroke={t.border} strokeWidth="1" />)}
            {Array.from({ length: 8 }).map((_, i) => <line key={"v" + i} x1={`${(i + 1) * 12}%`} y1="0" x2={`${(i + 1) * 12}%`} y2="100%" stroke={t.border} strokeWidth="1" />)}
          </svg>
          {trip.mapPins.map((p) => {
            const meta = PIN_META[p.type];
            const active = selectedPin === p.id;
            return (
              <button key={p.id} onClick={() => setSelectedPin(p.id)} className={"absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform " + (active ? "scale-125" : "hover:scale-110")}
                style={{ left: `${p.x}%`, top: `${p.y}%`, width: 30, height: 30, background: meta.color, color: "#0B1220", boxShadow: `0 4px 14px ${meta.color}66` }}>
                <meta.Icon size={14} />
              </button>
            );
          })}
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
          {Object.entries(PIN_META).map(([key, meta]) => (
            <div key={key} className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full capitalize" style={{ background: t.bgSoft, border: `1px solid ${t.border}`, color: t.textMuted }}>
              <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} /> {key}
            </div>
          ))}
        </div>
      </GlassCard>
      <GlassCard t={t} className="p-5">
        {pin ? (
          <div className="fade-in-up">
            <IconCircle t={t} color={PIN_META[pin.type].color} Icon={PIN_META[pin.type].Icon} size={40} />
            <div className="text-sm font-semibold mt-3">{pin.name}</div>
            <div className="text-xs mt-1 capitalize" style={{ color: t.textFaint }}>{pin.type}</div>
            <div className="text-xs mt-2" style={{ color: t.textMuted }}>{pin.desc}</div>
          </div>
        ) : (
          <div className="text-xs" style={{ color: t.textFaint }}>Click a marker to see details about attractions, hotels, restaurants, and transit hubs for this trip.</div>
        )}
        <div className="text-[10px] mt-6 pt-4" style={{ color: t.textFaint, borderTop: `1px solid ${t.border}` }}>
          Stylized preview map — swap in Google Maps or Mapbox with a live API key for real geographic tiles and routing.
        </div>
      </GlassCard>
    </div>
  );
}

/* ---------- Budget ---------- */
function BudgetTab({ t, trip, onEditCategory }) {
  const data = Object.entries(trip.budgetBreakdown).map(([k, v]) => ({ category: k, value: v }));
  const colors = { flights: t.coral, hotels: t.indigo, food: t.gold, transportation: t.teal, activities: "#E0669D", shopping: "#9AA3B2" };
  const allocated = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <GlassCard t={t} className="p-5">
        <div className="disp font-semibold text-sm mb-4">Budget allocation</div>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="category" innerRadius={55} outerRadius={85} paddingAngle={2}>
              {data.map((d, i) => <Cell key={i} fill={colors[d.category] || t.textFaint} stroke="none" />)}
            </Pie>
            <Tooltip contentStyle={{ background: t.bgSoft, border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 12 }} formatter={(v) => money(v)} />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {data.map((d) => (
            <div key={d.category} className="flex items-center gap-1.5 text-[11px] capitalize" style={{ color: t.textMuted }}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: colors[d.category] }} /> {d.category}
            </div>
          ))}
        </div>
      </GlassCard>
      <GlassCard t={t} className="p-5">
        <div className="disp font-semibold text-sm mb-4">Breakdown</div>
        <div className="space-y-3">
          {data.map((d) => (
            <div key={d.category} className="group">
              <div className="flex items-center justify-between text-xs mb-1.5 capitalize">
                <span>{d.category}</span>
                <span className="flex items-center gap-2">
                  <span className="num" style={{ color: t.textFaint }}>{money(d.value)}</span>
                  <button onClick={() => onEditCategory(d.category, d.value)} style={{ color: t.textMuted }} className="opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-70"><Pencil size={11} /></button>
                </span>
              </div>
              <ProgressBar t={t} pct={(d.value / trip.budgetTotal) * 100} color={colors[d.category]} />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 text-sm font-semibold" style={{ borderTop: `1px solid ${t.border}` }}>
          <span>Total trip cost</span><span className="num" style={{ color: t.coral }}>{money(trip.budgetTotal)}</span>
        </div>
        {Math.round(allocated) !== Math.round(trip.budgetTotal) && (
          <div className="text-[11px] mt-1.5" style={{ color: t.textFaint }}>{money(allocated)} currently allocated across categories</div>
        )}
      </GlassCard>
    </div>
  );
}

/* ---------- Attractions ---------- */
function AttractionsTab({ t, trip, onToggleSave, onAdd, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Btn t={t} onClick={onAdd}><Plus size={14} /> Add attraction</Btn></div>
      <div className="grid md:grid-cols-3 gap-4">
        {trip.attractions.map((a, i) => (
          <GlassCard key={a.id} t={t} className="p-4 fade-in-up card-hover group relative" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="h-24 rounded-xl flex items-center justify-center text-3xl mb-3" style={{ background: `linear-gradient(135deg, ${trip.gradient[0]}, ${trip.gradient[1]})` }}><Landmark size={30} color="#fff" /></div>
            <div className="flex items-start justify-between">
              <div className="text-sm font-semibold pr-2">{a.name}</div>
              <button onClick={() => onToggleSave(a.id)} style={{ color: a.saved ? t.coral : t.textFaint }}><Heart size={16} fill={a.saved ? t.coral : "none"} /></button>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[11px]" style={{ color: t.textFaint }}>
              <StarRating rating={a.rating} color={t.gold} />
              <span className="flex items-center gap-1"><Clock size={11} /> {a.duration}</span>
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px]" style={{ color: t.textMuted }}>
              <span>{a.hours}</span>
              <span className="flex items-center gap-1 num"><Ticket size={11} /> {a.price === 0 ? "Free" : money(a.price)}</span>
            </div>
            <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(a)} className="flex-1 text-[11px] py-1.5 rounded-lg flex items-center justify-center gap-1" style={{ border: `1px solid ${t.border}`, color: t.textMuted }}><Pencil size={11} /> Edit</button>
              <button onClick={() => onDelete(a.id)} className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ border: `1px solid ${t.border}`, color: t.rose }}><Trash2 size={12} /></button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

/* ---------- Restaurants ---------- */
function RestaurantsTab({ t, trip, onToggleFavorite, onAdd, onEdit, onDelete }) {
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const cuisines = ["All", ...new Set(trip.restaurants.map((r) => r.cuisine))];
  const list = trip.restaurants.filter((r) => cuisineFilter === "All" || r.cuisine === cuisineFilter);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
          {cuisines.map((c) => <Pill key={c} t={t} active={cuisineFilter === c} onClick={() => setCuisineFilter(c)}>{c}</Pill>)}
        </div>
        <Btn t={t} onClick={onAdd} className="shrink-0"><Plus size={14} /> Add</Btn>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {list.map((r, i) => (
          <GlassCard key={r.id} t={t} className="p-4 flex items-center gap-3 fade-in-up group" style={{ animationDelay: `${i * 40}ms` }}>
            <IconCircle t={t} color={t.coral} Icon={Utensils} size={44} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold truncate">{r.name}</div>
                <button onClick={() => onToggleFavorite(r.id)} style={{ color: r.favorite ? t.coral : t.textFaint }}><Heart size={15} fill={r.favorite ? t.coral : "none"} /></button>
              </div>
              <div className="text-[11px]" style={{ color: t.textFaint }}>{r.cuisine} · {r.budget} · {r.distanceKm} km away</div>
              <StarRating rating={r.rating} color={t.gold} />
            </div>
            <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button onClick={() => onEdit(r)} style={{ color: t.textMuted }}><Pencil size={13} /></button>
              <button onClick={() => onDelete(r.id)} style={{ color: t.rose }}><Trash2 size={13} /></button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

/* ---------- Hotels ---------- */
function HotelsTab({ t, trip, onAdd, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Btn t={t} onClick={onAdd}><Plus size={14} /> Add hotel</Btn></div>
      <div className="grid md:grid-cols-2 gap-4">
        {trip.hotels.map((h, i) => (
          <GlassCard key={h.id} t={t} className="p-4 flex items-center gap-3 fade-in-up group" style={{ animationDelay: `${i * 40}ms` }}>
            <IconCircle t={t} color={t.indigo} Icon={Hotel} size={44} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{h.name}</div>
              <div className="text-[11px]" style={{ color: t.textFaint }}>{h.area}</div>
              <div className="flex items-center gap-3 mt-1">
                <StarRating rating={h.rating} color={t.gold} />
                <span className="text-xs num font-medium">{money(h.pricePerNight)}<span className="text-[10px] font-normal" style={{ color: t.textFaint }}>/night</span></span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button onClick={() => onEdit(h)} style={{ color: t.textMuted }}><Pencil size={13} /></button>
              <button onClick={() => onDelete(h.id)} style={{ color: t.rose }}><Trash2 size={13} /></button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

/* ---------- Weather ---------- */
function WeatherTab({ t, trip }) {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
      {trip.weather.map((w, i) => (
        <GlassCard key={i} t={t} className="p-4 text-center fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
          <div className="text-xs" style={{ color: t.textFaint }}>Day {w.day}</div>
          <div className="flex justify-center my-2"><w.Icon size={28} color={t.gold} /></div>
          <div className="num text-lg font-semibold">{w.tempHigh}° <span className="text-xs font-normal" style={{ color: t.textFaint }}>/ {w.tempLow}°</span></div>
          <div className="text-[11px] mt-1" style={{ color: t.textMuted }}>{w.condition}</div>
          <div className="flex items-center justify-center gap-1 mt-2 text-[11px]" style={{ color: t.teal }}><Umbrella size={11} /> {w.rain}%</div>
          <div className="text-[10px] mt-2 leading-snug" style={{ color: t.textFaint }}>{w.clothing}</div>
        </GlassCard>
      ))}
    </div>
  );
}

/* ---------- Packing ---------- */
function PackingTab({ t, trip, onToggle, onAdd, onDelete }) {
  const [text, setText] = useState("");
  const cats = [...new Set(trip.packing.map((p) => p.category))];
  const done = trip.packing.filter((p) => p.checked).length;
  return (
    <div className="space-y-4">
      <GlassCard t={t} className="p-4 flex items-center justify-between">
        <div className="text-sm font-medium">Packing progress</div>
        <div className="flex items-center gap-3 flex-1 max-w-xs ml-4">
          <ProgressBar t={t} color={t.coral} pct={(done / trip.packing.length) * 100} />
          <span className="text-xs num shrink-0" style={{ color: t.textFaint }}>{done}/{trip.packing.length}</span>
        </div>
      </GlassCard>
      <GlassCard t={t} className="p-4">
        <form onSubmit={(e) => { e.preventDefault(); onAdd(text); setText(""); }} className="flex items-center gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a packing item…" className="flex-1 rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} />
          <Btn t={t} type="submit"><Plus size={14} /> Add</Btn>
        </form>
      </GlassCard>
      {cats.map((cat) => (
        <GlassCard key={cat} t={t} className="p-4">
          <div className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: t.textMuted }}>{cat}</div>
          <div className="space-y-2">
            {trip.packing.filter((p) => p.category === cat).map((p) => (
              <div key={p.id} className="flex items-center justify-between group">
                <button onClick={() => onToggle(p.id)} className="flex items-center gap-2.5 flex-1 text-left text-sm" style={{ color: p.checked ? t.textFaint : t.text, textDecoration: p.checked ? "line-through" : "none" }}>
                  {p.checked ? <CheckSquare size={16} color={t.coral} /> : <Square size={16} color={t.textFaint} />}
                  {p.item}
                </button>
                <button onClick={() => onDelete(p.id)} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.rose }}><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

/* ---------- Documents ---------- */
function DocumentsTab({ t, trip, onEdit, onDeleteEntry }) {
  const d = trip.documents;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <GlassCard t={t} className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="disp font-semibold text-sm flex items-center gap-1.5"><ShieldCheck size={15} color={t.coral} /> Passport</div>
          <button onClick={() => onEdit("passport")} style={{ color: t.textMuted }}><Pencil size={13} /></button>
        </div>
        {d.passport.fullName ? (
          <div className="text-xs space-y-1" style={{ color: t.textMuted }}>
            <div>{d.passport.fullName}</div><div>№ {d.passport.passportNumber}</div><div>Expires {d.passport.expiryDate}</div><div>{d.passport.nationality}</div>
          </div>
        ) : <div className="text-xs" style={{ color: t.textFaint }}>Not added yet.</div>}
      </GlassCard>
      <GlassCard t={t} className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="disp font-semibold text-sm flex items-center gap-1.5"><PlaneTakeoff size={15} color={t.coral} /> Flights</div>
          <button onClick={() => onEdit("flights")} style={{ color: t.textMuted }}><Plus size={14} /></button>
        </div>
        {d.flights.length === 0 ? <div className="text-xs" style={{ color: t.textFaint }}>No flights added yet.</div> : (
          <div className="space-y-2">{d.flights.map((f, i) => (
            <div key={i} className="flex items-center justify-between text-xs group" style={{ color: t.textMuted }}>
              <span>{f.airline} {f.flightNumber} · {f.date}</span>
              <button onClick={() => onDeleteEntry("flights", i)} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.rose }}><Trash2 size={12} /></button>
            </div>
          ))}</div>
        )}
      </GlassCard>
      <GlassCard t={t} className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="disp font-semibold text-sm flex items-center gap-1.5"><Hotel size={15} color={t.coral} /> Hotel reservations</div>
          <button onClick={() => onEdit("hotelReservations")} style={{ color: t.textMuted }}><Plus size={14} /></button>
        </div>
        {d.hotelReservations.length === 0 ? <div className="text-xs" style={{ color: t.textFaint }}>No reservations added yet.</div> : (
          <div className="space-y-2">{d.hotelReservations.map((h, i) => (
            <div key={i} className="flex items-center justify-between text-xs group" style={{ color: t.textMuted }}>
              <span>{h.hotelName} · {h.checkIn} – {h.checkOut}</span>
              <button onClick={() => onDeleteEntry("hotelReservations", i)} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.rose }}><Trash2 size={12} /></button>
            </div>
          ))}</div>
        )}
      </GlassCard>
      <GlassCard t={t} className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="disp font-semibold text-sm flex items-center gap-1.5"><Phone size={15} color={t.coral} /> Emergency contacts</div>
          <button onClick={() => onEdit("emergencyContacts")} style={{ color: t.textMuted }}><Plus size={14} /></button>
        </div>
        {d.emergencyContacts.length === 0 ? <div className="text-xs" style={{ color: t.textFaint }}>None added yet.</div> : (
          <div className="space-y-2">{d.emergencyContacts.map((c, i) => (
            <div key={i} className="flex items-center justify-between text-xs group" style={{ color: t.textMuted }}>
              <span>{c.name} ({c.relation}) · {c.phone}</span>
              <button onClick={() => onDeleteEntry("emergencyContacts", i)} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.rose }}><Trash2 size={12} /></button>
            </div>
          ))}</div>
        )}
      </GlassCard>
    </div>
  );
}

/* ---------- Expenses ---------- */
function ExpensesTab({ t, trip, onAdd, onEdit, onDelete }) {
  const chartData = trip.expenses.map((e) => ({ category: e.category, planned: e.planned, actual: e.actual }));
  const totalPlanned = trip.expenses.reduce((s, e) => s + e.planned, 0);
  const totalActual = trip.expenses.reduce((s, e) => s + e.actual, 0);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm" style={{ color: t.textFaint }}>Planned {money(totalPlanned)} · Actual {money(totalActual)}</div>
        <Btn t={t} onClick={onAdd}><Plus size={14} /> Log expense</Btn>
      </div>
      <GlassCard t={t} className="p-5">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
            <XAxis dataKey="category" tick={{ fill: t.textFaint, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: t.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} width={45} />
            <Tooltip contentStyle={{ background: t.bgSoft, border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 12 }} formatter={(v) => money(v)} />
            <Bar dataKey="planned" fill={t.textFaint} radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" fill={t.coral} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
      <div className="grid md:grid-cols-2 gap-3">
        {trip.expenses.map((e) => (
          <GlassCard key={e.id} t={t} className="p-4 flex items-center justify-between group">
            <div>
              <div className="text-sm font-medium capitalize">{e.category}</div>
              <div className="text-[11px]" style={{ color: t.textFaint }}>{e.note || "No note"}</div>
            </div>
            <div className="text-right">
              <div className="text-xs num" style={{ color: t.textFaint }}>Planned {money(e.planned)}</div>
              <div className="text-sm num font-semibold" style={{ color: e.actual > e.planned ? t.rose : t.text }}>{money(e.actual)}</div>
            </div>
            <div className="flex items-center gap-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(e)} style={{ color: t.textMuted }}><Pencil size={13} /></button>
              <button onClick={() => onDelete(e.id)} style={{ color: t.rose }}><Trash2 size={13} /></button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

/* ---------- Assistant ---------- */
function AssistantTab({ t, trip, chatInput, setChatInput, onSend, busy, chatEndRef }) {
  const suggestions = ["What should I visit first?", "Find hidden gems.", "Suggest cheaper hotels.", "What should I pack?", "How do I get from the airport to the city?"];
  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 320px)", minHeight: 420 }}>
      <div className="flex items-center gap-2.5 mb-4">
        <IconCircle t={t} color={t.coral} Icon={Bot} size={38} />
        <div>
          <div className="disp font-semibold text-sm">Trip Assistant</div>
          <div className="text-[11px]" style={{ color: t.textFaint }}>Knows everything about your {trip.destination} trip</div>
        </div>
      </div>
      <GlassCard t={t} className="flex-1 p-4 md:p-5 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {trip.chat.map((m, i) => (
            <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
              <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed" style={{ background: m.role === "user" ? t.coral : t.surfaceStrong, color: m.role === "user" ? "#0B1220" : t.text }}>{m.text}</div>
            </div>
          ))}
          {busy && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 flex gap-1" style={{ background: t.surfaceStrong }}>
                <span className="dot w-1.5 h-1.5 rounded-full" style={{ background: t.textMuted }} />
                <span className="dot w-1.5 h-1.5 rounded-full" style={{ background: t.textMuted, animationDelay: "150ms" }} />
                <span className="dot w-1.5 h-1.5 rounded-full" style={{ background: t.textMuted, animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="flex gap-2 flex-wrap mt-3 mb-3">
          {suggestions.map((s) => <button key={s} onClick={() => setChatInput(s)} className="text-[11px] px-2.5 py-1.5 rounded-full" style={{ border: `1px solid ${t.border}`, color: t.textMuted }}>{s}</button>)}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSend(); }} className="flex items-center gap-2 pt-3" style={{ borderTop: `1px solid ${t.border}` }}>
          <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask about your trip…" className="flex-1 rounded-xl px-3.5 py-2.5 text-sm" style={inputStyle(t)} />
          <button type="submit" disabled={busy} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50" style={{ background: t.coral, color: "#0B1220" }}><Send size={16} /></button>
        </form>
      </GlassCard>
    </div>
  );
}

/* ============================== MODALS ============================== */
function ExpenseModal({ t, mode, data, onClose, onSave }) {
  const [form, setForm] = useState(data || { category: "activities", planned: "", actual: "", note: "" });
  return (
    <Modal t={t} title={mode === "edit" ? "Edit expense" : "Log expense"} onClose={onClose}>
      <Field t={t} label="Category">
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm capitalize" style={inputStyle(t)}>
          {["flights", "hotels", "food", "transportation", "activities", "shopping"].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field t={t} label="Planned"><input type="number" value={form.planned} onChange={(e) => setForm({ ...form, planned: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm num" style={inputStyle(t)} /></Field>
        <Field t={t} label="Actual"><input type="number" value={form.actual} onChange={(e) => setForm({ ...form, actual: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm num" style={inputStyle(t)} /></Field>
      </div>
      <Field t={t} label="Note"><input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} placeholder="Optional" /></Field>
      <div className="flex gap-2 mt-2">
        <Btn t={t} variant="ghost" onClick={onClose} className="flex-1">Cancel</Btn>
        <Btn t={t} onClick={() => onSave({ ...form, planned: parseFloat(form.planned) || 0, actual: parseFloat(form.actual) || 0 })} className="flex-1">Save</Btn>
      </div>
    </Modal>
  );
}
function DocumentModal({ t, section, trip, onClose, onSave }) {
  const [passport, setPassport] = useState(trip.documents.passport);
  const [flight, setFlight] = useState({ airline: "", flightNumber: "", departure: "", arrival: "", date: "" });
  const [hotelRes, setHotelRes] = useState({ hotelName: "", confirmationNumber: "", checkIn: "", checkOut: "" });
  const [contact, setContact] = useState({ name: "", relation: "", phone: "" });

  if (section === "passport") {
    return (
      <Modal t={t} title="Passport details" onClose={onClose}>
        <Field t={t} label="Full name"><input value={passport.fullName} onChange={(e) => setPassport({ ...passport, fullName: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
        <Field t={t} label="Passport number"><input value={passport.passportNumber} onChange={(e) => setPassport({ ...passport, passportNumber: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field t={t} label="Expiry date"><input type="date" value={passport.expiryDate} onChange={(e) => setPassport({ ...passport, expiryDate: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
          <Field t={t} label="Nationality"><input value={passport.nationality} onChange={(e) => setPassport({ ...passport, nationality: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
        </div>
        <div className="flex gap-2 mt-2"><Btn t={t} variant="ghost" onClick={onClose} className="flex-1">Cancel</Btn><Btn t={t} onClick={() => onSave({ passport })} className="flex-1">Save</Btn></div>
      </Modal>
    );
  }
  if (section === "flights") {
    return (
      <Modal t={t} title="Add flight" onClose={onClose}>
        <div className="grid grid-cols-2 gap-3">
          <Field t={t} label="Airline"><input value={flight.airline} onChange={(e) => setFlight({ ...flight, airline: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
          <Field t={t} label="Flight number"><input value={flight.flightNumber} onChange={(e) => setFlight({ ...flight, flightNumber: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field t={t} label="Departure"><input value={flight.departure} onChange={(e) => setFlight({ ...flight, departure: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} placeholder="City / airport" /></Field>
          <Field t={t} label="Arrival"><input value={flight.arrival} onChange={(e) => setFlight({ ...flight, arrival: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} placeholder="City / airport" /></Field>
        </div>
        <Field t={t} label="Date"><input type="date" value={flight.date} onChange={(e) => setFlight({ ...flight, date: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
        <div className="flex gap-2 mt-2"><Btn t={t} variant="ghost" onClick={onClose} className="flex-1">Cancel</Btn><Btn t={t} onClick={() => onSave({ flights: [...trip.documents.flights, flight] })} className="flex-1">Add</Btn></div>
      </Modal>
    );
  }
  if (section === "hotelReservations") {
    return (
      <Modal t={t} title="Add hotel reservation" onClose={onClose}>
        <Field t={t} label="Hotel name"><input value={hotelRes.hotelName} onChange={(e) => setHotelRes({ ...hotelRes, hotelName: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
        <Field t={t} label="Confirmation number"><input value={hotelRes.confirmationNumber} onChange={(e) => setHotelRes({ ...hotelRes, confirmationNumber: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field t={t} label="Check-in"><input type="date" value={hotelRes.checkIn} onChange={(e) => setHotelRes({ ...hotelRes, checkIn: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
          <Field t={t} label="Check-out"><input type="date" value={hotelRes.checkOut} onChange={(e) => setHotelRes({ ...hotelRes, checkOut: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
        </div>
        <div className="flex gap-2 mt-2"><Btn t={t} variant="ghost" onClick={onClose} className="flex-1">Cancel</Btn><Btn t={t} onClick={() => onSave({ hotelReservations: [...trip.documents.hotelReservations, hotelRes] })} className="flex-1">Add</Btn></div>
      </Modal>
    );
  }
  if (section === "emergencyContacts") {
    return (
      <Modal t={t} title="Add emergency contact" onClose={onClose}>
        <Field t={t} label="Name"><input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field t={t} label="Relation"><input value={contact.relation} onChange={(e) => setContact({ ...contact, relation: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
          <Field t={t} label="Phone"><input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
        </div>
        <div className="flex gap-2 mt-2"><Btn t={t} variant="ghost" onClick={onClose} className="flex-1">Cancel</Btn><Btn t={t} onClick={() => onSave({ emergencyContacts: [...trip.documents.emergencyContacts, contact] })} className="flex-1">Add</Btn></div>
      </Modal>
    );
  }
  return null;
}

/* ---------- Trip meta / itinerary block / attraction / restaurant / hotel / budget category modals ---------- */
function TripMetaModal({ t, trip, onClose, onSave }) {
  const [form, setForm] = useState({
    destination: trip.destination, startDate: trip.startDate.slice(0, 10), endDate: trip.endDate.slice(0, 10),
    travelers: trip.travelers, budgetTotal: trip.budgetTotal,
  });
  return (
    <Modal t={t} title="Edit trip details" onClose={onClose}>
      <Field t={t} label="Destination name"><input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field t={t} label="Start date"><input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
        <Field t={t} label="End date"><input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field t={t} label="Travelers"><input type="number" min="1" value={form.travelers} onChange={(e) => setForm({ ...form, travelers: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm num" style={inputStyle(t)} /></Field>
        <Field t={t} label="Total budget"><input type="number" value={form.budgetTotal} onChange={(e) => setForm({ ...form, budgetTotal: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm num" style={inputStyle(t)} /></Field>
      </div>
      <p className="text-[11px] mb-3" style={{ color: t.textFaint }}>Changing the dates adjusts the number of itinerary days, reusing existing plans for any new days added.</p>
      <div className="flex gap-2">
        <Btn t={t} variant="ghost" onClick={onClose} className="flex-1">Cancel</Btn>
        <Btn t={t} onClick={() => onSave({ destination: form.destination, startDate: form.startDate, endDate: form.endDate, travelers: parseInt(form.travelers, 10) || 1, budgetTotal: parseFloat(form.budgetTotal) || 0 })} className="flex-1">Save</Btn>
      </div>
    </Modal>
  );
}
function ItineraryBlockModal({ t, blockKey, data, onClose, onSave }) {
  const [form, setForm] = useState({ title: data.title, desc: data.desc, cost: data.cost, duration: data.duration });
  return (
    <Modal t={t} title={`Edit ${blockKey}`} onClose={onClose}>
      <Field t={t} label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
      <Field t={t} label="Description"><textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field t={t} label="Cost"><input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm num" style={inputStyle(t)} /></Field>
        <Field t={t} label="Duration"><input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 2h" className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
      </div>
      <div className="flex gap-2 mt-2">
        <Btn t={t} variant="ghost" onClick={onClose} className="flex-1">Cancel</Btn>
        <Btn t={t} onClick={() => onSave({ ...form, cost: parseFloat(form.cost) || 0 })} className="flex-1">Save</Btn>
      </div>
    </Modal>
  );
}
function AttractionModal({ t, mode, data, onClose, onSave }) {
  const [form, setForm] = useState(data || { name: "", rating: 4.5, hours: "9:00–18:00", duration: "1.5h", price: 0 });
  return (
    <Modal t={t} title={mode === "edit" ? "Edit attraction" : "Add attraction"} onClose={onClose}>
      <Field t={t} label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field t={t} label="Rating"><input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm num" style={inputStyle(t)} /></Field>
        <Field t={t} label="Price"><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm num" style={inputStyle(t)} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field t={t} label="Hours"><input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
        <Field t={t} label="Visit duration"><input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
      </div>
      <div className="flex gap-2 mt-2">
        <Btn t={t} variant="ghost" onClick={onClose} className="flex-1">Cancel</Btn>
        <Btn t={t} onClick={() => form.name && onSave({ ...form, rating: parseFloat(form.rating) || 0, price: parseFloat(form.price) || 0 })} className="flex-1">Save</Btn>
      </div>
    </Modal>
  );
}
function RestaurantModal({ t, mode, data, onClose, onSave }) {
  const [form, setForm] = useState(data || { name: "", cuisine: "", budget: "$$", distanceKm: 1, rating: 4.5 });
  return (
    <Modal t={t} title={mode === "edit" ? "Edit restaurant" : "Add restaurant"} onClose={onClose}>
      <Field t={t} label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
      <Field t={t} label="Cuisine"><input value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
      <div className="grid grid-cols-3 gap-3">
        <Field t={t} label="Budget">
          <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)}>
            {["$", "$$", "$$$", "$$$$"].map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
        <Field t={t} label="Distance (km)"><input type="number" step="0.1" value={form.distanceKm} onChange={(e) => setForm({ ...form, distanceKm: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm num" style={inputStyle(t)} /></Field>
        <Field t={t} label="Rating"><input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm num" style={inputStyle(t)} /></Field>
      </div>
      <div className="flex gap-2 mt-2">
        <Btn t={t} variant="ghost" onClick={onClose} className="flex-1">Cancel</Btn>
        <Btn t={t} onClick={() => form.name && onSave({ ...form, distanceKm: parseFloat(form.distanceKm) || 0, rating: parseFloat(form.rating) || 0 })} className="flex-1">Save</Btn>
      </div>
    </Modal>
  );
}
function HotelModal({ t, mode, data, onClose, onSave }) {
  const [form, setForm] = useState(data || { name: "", pricePerNight: 100, rating: 4.5, area: "" });
  return (
    <Modal t={t} title={mode === "edit" ? "Edit hotel" : "Add hotel"} onClose={onClose}>
      <Field t={t} label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
      <Field t={t} label="Area / neighborhood"><input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle(t)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field t={t} label="Price per night"><input type="number" value={form.pricePerNight} onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm num" style={inputStyle(t)} /></Field>
        <Field t={t} label="Rating"><input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm num" style={inputStyle(t)} /></Field>
      </div>
      <div className="flex gap-2 mt-2">
        <Btn t={t} variant="ghost" onClick={onClose} className="flex-1">Cancel</Btn>
        <Btn t={t} onClick={() => form.name && onSave({ ...form, pricePerNight: parseFloat(form.pricePerNight) || 0, rating: parseFloat(form.rating) || 0 })} className="flex-1">Save</Btn>
      </div>
    </Modal>
  );
}
function BudgetCategoryModal({ t, category, value, onClose, onSave }) {
  const [amount, setAmount] = useState(value);
  return (
    <Modal t={t} title={`Edit ${category} budget`} onClose={onClose}>
      <Field t={t} label="Amount"><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm num" style={inputStyle(t)} autoFocus /></Field>
      <div className="flex gap-2 mt-2">
        <Btn t={t} variant="ghost" onClick={onClose} className="flex-1">Cancel</Btn>
        <Btn t={t} onClick={() => onSave(parseFloat(amount) || 0)} className="flex-1">Save</Btn>
      </div>
    </Modal>
  );
}
