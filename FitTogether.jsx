import React, { useState, useMemo, useRef } from "react";
import {
  Home, TrendingUp, ChefHat, ShoppingCart, Target, Trophy,
  Droplet, Footprints, Flame, Plus, Check, X, Camera, Users,
  Star, Loader2, Sparkles, Trash2, Pencil, ChevronRight, Scale,
  UtensilsCrossed, PartyPopper
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid
} from "recharts";

/* ---------------------------------------------------------------
   FIT TOGETHER — a warm, colourful family health app
   Signature motif: "fridge magnet" cards — rounded notes with a
   little coloured magnet dot, like the family fridge whiteboard.
----------------------------------------------------------------*/

const MEMBER_PALETTE = [
  { id: "coral", bg: "#FF6B4A", soft: "#FFE4DB" },
  { id: "teal", bg: "#159C86", soft: "#D9F1EC" },
  { id: "sky", bg: "#3FA9DD", soft: "#DDF0FA" },
  { id: "gold", bg: "#F0A400", soft: "#FCEACB" },
  { id: "berry", bg: "#D6486B", soft: "#FADCE3" },
  { id: "violet", bg: "#8B6FD1", soft: "#E7E1F8" },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CATEGORIES = ["Produce", "Protein", "Dairy", "Pantry", "Frozen", "Bakery", "Other"];
const GOAL_TYPES = [
  { id: "lose_weight", label: "Lose weight", unit: "lbs" },
  { id: "build_muscle", label: "Build muscle", unit: "sessions/wk" },
  { id: "more_protein", label: "Eat more protein", unit: "g/day" },
  { id: "exercise_more", label: "Exercise more often", unit: "days/wk" },
  { id: "drink_water", label: "Drink more water", unit: "cups/day" },
  { id: "custom", label: "Something else", unit: "" },
];

function uid() { return Math.random().toString(36).slice(2, 10); }

function seedMembers() {
  return [
    {
      id: "m1", name: "Mum", initial: "M", color: MEMBER_PALETTE[0], shareWithFamily: true,
      calorieGoal: 1900, waterGoal: 8, stepGoal: 8000,
      weeklySteps: [7200, 8100, 6400, 9200, 7800, 10500, 5400],
      weeklyCalories: [1850, 1920, 1780, 2010, 1890, 2150, 1700],
      todayCalories: 1240, todayWater: 5, todaySteps: 6120,
      weightLog: [{ label: "3 wks ago", value: 148 }, { label: "2 wks ago", value: 147 }, { label: "Last wk", value: 145.5 }, { label: "This wk", value: 144.8 }],
      photos: [],
      goals: [
        { id: uid(), type: "lose_weight", label: "Lose weight", target: 10, current: 3.2, unit: "lbs" },
        { id: uid(), type: "drink_water", label: "Drink more water", target: 8, current: 5, unit: "cups/day" },
      ],
    },
    {
      id: "m2", name: "Dad", initial: "D", color: MEMBER_PALETTE[1], shareWithFamily: true,
      calorieGoal: 2400, waterGoal: 10, stepGoal: 10000,
      weeklySteps: [9800, 11200, 8700, 10100, 12400, 15200, 6100],
      weeklyCalories: [2350, 2410, 2200, 2500, 2380, 2600, 2100],
      todayCalories: 1680, todayWater: 6, todaySteps: 8340,
      weightLog: [{ label: "3 wks ago", value: 191 }, { label: "2 wks ago", value: 189.5 }, { label: "Last wk", value: 188 }, { label: "This wk", value: 187 }],
      photos: [],
      goals: [
        { id: uid(), type: "build_muscle", label: "Build muscle", target: 4, current: 2, unit: "sessions/wk" },
      ],
    },
    {
      id: "m3", name: "Ellie", initial: "E", color: MEMBER_PALETTE[3], shareWithFamily: true,
      calorieGoal: 1800, waterGoal: 7, stepGoal: 9000,
      weeklySteps: [6200, 7100, 8900, 6700, 9400, 11000, 4200],
      weeklyCalories: [1650, 1720, 1800, 1690, 1750, 1900, 1600],
      todayCalories: 980, todayWater: 3, todaySteps: 4210,
      weightLog: [],
      photos: [],
      goals: [
        { id: uid(), type: "exercise_more", label: "Exercise more often", target: 5, current: 3, unit: "days/wk" },
      ],
    },
    {
      id: "m4", name: "Jack", initial: "J", color: MEMBER_PALETTE[2], shareWithFamily: false,
      calorieGoal: 2000, waterGoal: 7, stepGoal: 9000,
      weeklySteps: [8100, 9200, 7600, 10300, 8800, 13100, 5900],
      weeklyCalories: [1900, 2050, 1880, 2100, 1950, 2200, 1750],
      todayCalories: 1420, todayWater: 4, todaySteps: 7650,
      weightLog: [],
      photos: [],
      goals: [
        { id: uid(), type: "more_protein", label: "Eat more protein", target: 110, current: 68, unit: "g/day" },
      ],
    },
  ];
}

function seedShoppingList() {
  return [
    { id: uid(), name: "Chicken breast", category: "Protein", checked: false, addedBy: "Dad" },
    { id: uid(), name: "Broccoli", category: "Produce", checked: false, addedBy: "Mum" },
    { id: uid(), name: "Greek yoghurt", category: "Dairy", checked: true, addedBy: "Ellie" },
    { id: uid(), name: "Brown rice", category: "Pantry", checked: false, addedBy: "Mum" },
    { id: uid(), name: "Frozen berries", category: "Frozen", checked: false, addedBy: "Jack" },
    { id: uid(), name: "Wholemeal bread", category: "Bakery", checked: false, addedBy: "Dad" },
  ];
}

function seedChallenges() {
  return [
    {
      id: uid(), title: "Walk 50,000 steps this week", icon: "steps", unit: "steps", goal: 50000,
      contributions: { m1: 12400, m2: 18600, m3: 9800, m4: 7200 },
    },
    {
      id: uid(), title: "Eat five healthy dinners", icon: "meals", unit: "dinners", goal: 5,
      contributions: { m1: 2, m2: 1, m3: 1, m4: 1 },
    },
  ];
}

/* ------------------------- small ui bits ------------------------- */

function Ring({ pct, color, size = 64, stroke = 8, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, pct));
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#F1EADF" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={c - clamped * c} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .6s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

function MagnetCard({ children, accent = "#FF6B4A", style, className = "" }) {
  return (
    <div className={`ft-card ${className}`} style={style}>
      <span className="ft-magnet" style={{ background: accent }} />
      {children}
    </div>
  );
}

function BigButton({ icon: Icon, children, onClick, bg = "#FF6B4A", style, type = "button" }) {
  return (
    <button type={type} onClick={onClick} className="ft-bigbtn" style={{ background: bg, ...style }}>
      {Icon && <Icon size={20} strokeWidth={2.4} />}
      <span>{children}</span>
    </button>
  );
}

function ProgressBar({ pct, color = "#159C86" }) {
  return (
    <div className="ft-progress-track">
      <div className="ft-progress-fill" style={{ width: `${Math.min(100, pct * 100)}%`, background: color }} />
    </div>
  );
}

/* ------------------------- header / nav ------------------------- */

function Header({ members, activeId, setActiveId, onAddMember, screen }) {
  const titles = {
    home: "Home", progress: "Progress", food: "Food Creator",
    shopping: "Shopping List", goals: "Goals", challenges: "Family Challenges",
  };
  return (
    <div className="ft-header">
      <div className="ft-header-top">
        <div>
          <p className="ft-eyebrow">Fit Together</p>
          <h1 className="ft-title">{titles[screen]}</h1>
        </div>
        <div className="ft-logo">
          <UtensilsCrossed size={20} color="#fff" strokeWidth={2.4} />
        </div>
      </div>
      <div className="ft-avatars">
        {members.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveId(m.id)}
            className={`ft-avatar ${activeId === m.id ? "ft-avatar-active" : ""}`}
            style={{ "--avatar-color": m.color.bg }}
            title={m.name}
          >
            {m.initial}
          </button>
        ))}
        <button onClick={onAddMember} className="ft-avatar ft-avatar-add" title="Add family member">
          <Plus size={18} strokeWidth={2.6} />
        </button>
      </div>
    </div>
  );
}

function BottomNav({ screen, setScreen }) {
  const items = [
    { id: "home", label: "Home", icon: Home },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "food", label: "Food", icon: ChefHat },
    { id: "shopping", label: "Shop", icon: ShoppingCart },
    { id: "goals", label: "Goals", icon: Target },
    { id: "challenges", label: "Challenges", icon: Trophy },
  ];
  return (
    <nav className="ft-nav">
      {items.map((it) => {
        const Icon = it.icon;
        const active = screen === it.id;
        return (
          <button key={it.id} className={`ft-nav-btn ${active ? "ft-nav-btn-active" : ""}`} onClick={() => setScreen(it.id)}>
            <Icon size={20} strokeWidth={active ? 2.6 : 2.1} />
            <span>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ------------------------- HOME ------------------------- */

function encouragement(pctSteps, pctCal, pctWater) {
  const avg = (pctSteps + pctCal + pctWater) / 3;
  if (avg > 0.9) return "Incredible day — you're smashing every goal! 🎉";
  if (avg > 0.6) return "Great momentum today, keep it up! 💪";
  if (avg > 0.3) return "Nice start — a short walk would go a long way. 🚶";
  return "Every step counts. Let's get moving today! 🌱";
}

function HomeScreen({ member, allMembers, setScreen, logWater, logSteps }) {
  const pctCal = member.todayCalories / member.calorieGoal;
  const pctWater = member.todayWater / member.waterGoal;
  const pctSteps = member.todaySteps / member.stepGoal;

  return (
    <div className="ft-screen">
      <MagnetCard accent="#FF6B4A" className="ft-hero">
        <p className="ft-hero-greet">Hi {member.name.split(" ")[0]}, welcome back 👋</p>
        <p className="ft-hero-msg">{encouragement(pctSteps, pctCal, pctWater)}</p>
      </MagnetCard>

      <div className="ft-ring-row">
        <MagnetCard accent="#FF6B4A" className="ft-ring-card">
          <Ring pct={pctCal} color="#FF6B4A" size={72}>
            <Flame size={18} color="#FF6B4A" />
          </Ring>
          <p className="ft-ring-val">{member.todayCalories}</p>
          <p className="ft-ring-label">of {member.calorieGoal} cal</p>
        </MagnetCard>
        <MagnetCard accent="#3FA9DD" className="ft-ring-card">
          <Ring pct={pctWater} color="#3FA9DD" size={72}>
            <Droplet size={18} color="#3FA9DD" />
          </Ring>
          <p className="ft-ring-val">{member.todayWater}</p>
          <p className="ft-ring-label">of {member.waterGoal} cups</p>
          <button className="ft-mini-add" onClick={logWater} style={{ background: "#3FA9DD" }}>+ 1 cup</button>
        </MagnetCard>
        <MagnetCard accent="#159C86" className="ft-ring-card">
          <Ring pct={pctSteps} color="#159C86" size={72}>
            <Footprints size={18} color="#159C86" />
          </Ring>
          <p className="ft-ring-val">{member.todaySteps.toLocaleString()}</p>
          <p className="ft-ring-label">of {member.stepGoal.toLocaleString()} steps</p>
          <button className="ft-mini-add" onClick={logSteps} style={{ background: "#159C86" }}>+ 1,000</button>
        </MagnetCard>
      </div>

      <MagnetCard accent="#F0A400" style={{ cursor: "pointer" }}>
        <div className="ft-row-between" onClick={() => setScreen("challenges")}>
          <div className="ft-row-icon-text">
            <div className="ft-icon-badge" style={{ background: "#FCEACB" }}>
              <Trophy size={18} color="#F0A400" />
            </div>
            <div>
              <p className="ft-card-title">This week's family challenge</p>
              <p className="ft-card-sub">Walk 50,000 steps together</p>
            </div>
          </div>
          <ChevronRight size={20} color="#B7AE9E" />
        </div>
      </MagnetCard>

      <MagnetCard accent="#8B6FD1" style={{ cursor: "pointer" }}>
        <div className="ft-row-between" onClick={() => setScreen("food")}>
          <div className="ft-row-icon-text">
            <div className="ft-icon-badge" style={{ background: "#E7E1F8" }}>
              <Sparkles size={18} color="#8B6FD1" />
            </div>
            <div>
              <p className="ft-card-title">Need dinner ideas?</p>
              <p className="ft-card-sub">Ask the Food Creator for a recipe</p>
            </div>
          </div>
          <ChevronRight size={20} color="#B7AE9E" />
        </div>
      </MagnetCard>

      <p className="ft-section-label">Family snapshot</p>
      <MagnetCard accent="#D6486B">
        <div className="ft-family-list">
          {allMembers.map((m) => (
            <div className="ft-family-row" key={m.id}>
              <span className="ft-dot" style={{ background: m.color.bg }}>{m.initial}</span>
              <span className="ft-family-name">{m.name}</span>
              {m.shareWithFamily ? (
                <span className="ft-family-steps"><Footprints size={14} /> {m.todaySteps.toLocaleString()}</span>
              ) : (
                <span className="ft-family-private">Private</span>
              )}
            </div>
          ))}
        </div>
      </MagnetCard>
    </div>
  );
}

/* ------------------------- PROGRESS ------------------------- */

function ProgressScreen({ member, updateMember }) {
  const stepData = WEEKDAYS.map((d, i) => ({ day: d, steps: member.weeklySteps[i] }));
  const calData = WEEKDAYS.map((d, i) => ({ day: d, cal: member.weeklyCalories[i] }));
  const weekSteps = member.weeklySteps.reduce((a, b) => a + b, 0);
  const weekStepGoal = member.stepGoal * 7;
  const stepPct = weekSteps / weekStepGoal;

  const msg =
    stepPct > 1 ? `Amazing week — ${weekSteps.toLocaleString()} steps, goal smashed! 🌟`
    : stepPct > 0.75 ? "So close to your weekly step goal — finish strong!"
    : "A solid week. Small daily walks add up fast.";

  return (
    <div className="ft-screen">
      <MagnetCard accent={member.color.bg}>
        <p className="ft-card-title">{member.name}'s week</p>
        <p className="ft-card-sub">{msg}</p>
      </MagnetCard>

      <MagnetCard accent="#159C86">
        <p className="ft-chart-title"><Footprints size={16} color="#159C86" /> Steps this week</p>
        <div style={{ width: "100%", height: 160 }}>
          <ResponsiveContainer>
            <BarChart data={stepData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1EADF" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8B8478" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#8B8478" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #F1EADF", fontSize: 12 }} />
              <Bar dataKey="steps" fill="#159C86" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </MagnetCard>

      <MagnetCard accent="#FF6B4A">
        <p className="ft-chart-title"><Flame size={16} color="#FF6B4A" /> Calories this week</p>
        <div style={{ width: "100%", height: 160 }}>
          <ResponsiveContainer>
            <LineChart data={calData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1EADF" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8B8478" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#8B8478" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #F1EADF", fontSize: 12 }} />
              <Line type="monotone" dataKey="cal" stroke="#FF6B4A" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </MagnetCard>

      {member.weightLog.length > 0 && (
        <MagnetCard accent="#8B6FD1">
          <p className="ft-chart-title"><Scale size={16} color="#8B6FD1" /> Weight trend (private)</p>
          <div style={{ width: "100%", height: 140 }}>
            <ResponsiveContainer>
              <LineChart data={member.weightLog} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1EADF" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#8B8478" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#8B8478" }} axisLine={false} tickLine={false} width={40} domain={["dataMin - 2", "dataMax + 2"]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #F1EADF", fontSize: 12 }} />
                <Line type="monotone" dataKey="value" stroke="#8B6FD1" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="ft-tiny-note">Only visible to {member.name} unless family sharing is turned on.</p>
        </MagnetCard>
      )}

      <PhotoLog member={member} updateMember={updateMember} />

      <MagnetCard accent="#3FA9DD">
        <div className="ft-row-between">
          <div>
            <p className="ft-card-title">Share progress with family</p>
            <p className="ft-card-sub">Only steps &amp; challenge activity are ever shared</p>
          </div>
          <label className="ft-switch">
            <input type="checkbox" checked={member.shareWithFamily} onChange={(e) => updateMember(member.id, { shareWithFamily: e.target.checked })} />
            <span className="ft-switch-track"><span className="ft-switch-thumb" /></span>
          </label>
        </div>
      </MagnetCard>
    </div>
  );
}

function PhotoLog({ member, updateMember }) {
  const fileRef = useRef(null);
  const onPick = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateMember(member.id, { photos: [{ id: uid(), url, date: "Today" }, ...member.photos] });
    e.target.value = "";
  };
  return (
    <MagnetCard accent="#F0A400">
      <div className="ft-row-between">
        <p className="ft-card-title"><Camera size={16} color="#F0A400" style={{ marginRight: 6, verticalAlign: "-3px" }} />Progress photos</p>
        <button className="ft-pill-btn" style={{ background: "#F0A400" }} onClick={() => fileRef.current && fileRef.current.click()}>
          <Plus size={14} /> Add
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onPick} />
      </div>
      {member.photos.length === 0 ? (
        <p className="ft-empty-note">No photos yet — private to {member.name}, add one to track your journey.</p>
      ) : (
        <div className="ft-photo-strip">
          {member.photos.map((p) => (
            <div key={p.id} className="ft-photo-thumb">
              <img src={p.url} alt="progress" />
              <span>{p.date}</span>
            </div>
          ))}
        </div>
      )}
    </MagnetCard>
  );
}

/* ------------------------- FOOD CREATOR ------------------------- */

function FoodCreatorScreen({ addIngredientsToList, memberName }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [added, setAdded] = useState(false);

  const suggestions = [
    "High-protein dinner for the whole family",
    "Healthy meal using chicken and rice",
    "Vegetarian dinner under 600 calories",
    "Quick high-fibre breakfast for kids",
  ];

  async function generate(text) {
    const q = (text ?? prompt).trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setRecipe(null);
    setAdded(false);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          system:
            "You are the Food Creator inside a friendly family health app called Fit Together. " +
            "Given a request, invent one wholesome, achievable recipe. " +
            "Respond with ONLY valid JSON, no markdown fences, no preamble, no trailing text, matching exactly this shape: " +
            '{"title": string, "description": string, "servings": number, "calories_per_serving": number, ' +
            '"protein_g": number, "carbs_g": number, "fat_g": number, ' +
            '"ingredients": [{"name": string, "amount": string, "category": one of "Produce"|"Protein"|"Dairy"|"Pantry"|"Frozen"|"Bakery"|"Other"}], ' +
            '"instructions": [string]}',
          messages: [{ role: "user", content: q }],
        }),
      });
      const data = await res.json();
      const block = (data.content || []).find((b) => b.type === "text");
      if (!block) throw new Error("no text");
      let clean = block.text.trim();
      clean = clean.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(clean);
      setRecipe(parsed);
    } catch (e) {
      setError("Couldn't create a recipe just now — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ft-screen">
      <MagnetCard accent="#8B6FD1">
        <p className="ft-card-title"><Sparkles size={16} color="#8B6FD1" style={{ marginRight: 6, verticalAlign: "-3px" }} />Ask the Food Creator</p>
        <p className="ft-card-sub">Tell it what you're after — it'll build a recipe and calories for you.</p>
        <textarea
          className="ft-textarea"
          rows={3}
          placeholder='e.g. "Make a healthy meal using chicken and rice"'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <BigButton icon={loading ? Loader2 : Sparkles} bg="#8B6FD1" onClick={() => generate()} style={loading ? { opacity: 0.8 } : {}}>
          {loading ? "Creating your recipe..." : "Create recipe"}
        </BigButton>
        <div className="ft-chip-row">
          {suggestions.map((s) => (
            <button key={s} className="ft-chip" onClick={() => { setPrompt(s); generate(s); }}>{s}</button>
          ))}
        </div>
      </MagnetCard>

      {error && (
        <MagnetCard accent="#D6486B">
          <p className="ft-card-sub">{error}</p>
        </MagnetCard>
      )}

      {recipe && (
        <MagnetCard accent="#FF6B4A">
          <p className="ft-recipe-title">{recipe.title}</p>
          <p className="ft-card-sub">{recipe.description}</p>
          <div className="ft-macro-row">
            <div className="ft-macro"><span className="ft-macro-val">{recipe.calories_per_serving}</span><span className="ft-macro-label">kcal</span></div>
            <div className="ft-macro"><span className="ft-macro-val">{recipe.protein_g}g</span><span className="ft-macro-label">protein</span></div>
            <div className="ft-macro"><span className="ft-macro-val">{recipe.carbs_g}g</span><span className="ft-macro-label">carbs</span></div>
            <div className="ft-macro"><span className="ft-macro-val">{recipe.fat_g}g</span><span className="ft-macro-label">fat</span></div>
            <div className="ft-macro"><span className="ft-macro-val">{recipe.servings}</span><span className="ft-macro-label">servings</span></div>
          </div>

          <p className="ft-section-label" style={{ marginTop: 14 }}>Ingredients</p>
          <ul className="ft-ingredient-list">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}><span>{ing.name}</span><span className="ft-ing-amount">{ing.amount}</span></li>
            ))}
          </ul>

          <p className="ft-section-label">Method</p>
          <ol className="ft-steps-list">
            {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
          </ol>

          <BigButton
            icon={added ? Check : ShoppingCart}
            bg={added ? "#159C86" : "#F0A400"}
            onClick={() => { addIngredientsToList(recipe.ingredients, memberName); setAdded(true); }}
          >
            {added ? "Added to shopping list" : "Add all ingredients to shopping list"}
          </BigButton>
        </MagnetCard>
      )}
    </div>
  );
}

/* ------------------------- SHOPPING LIST ------------------------- */

function ShoppingListScreen({ list, setList }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Produce");

  function addItem() {
    if (!name.trim()) return;
    setList([{ id: uid(), name: name.trim(), category, checked: false, addedBy: "You" }, ...list]);
    setName("");
  }
  function toggle(id) { setList(list.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it))); }
  function remove(id) { setList(list.filter((it) => it.id !== id)); }

  const grouped = CATEGORIES.map((cat) => ({ cat, items: list.filter((i) => i.category === cat) })).filter((g) => g.items.length > 0);
  const doneCount = list.filter((i) => i.checked).length;

  return (
    <div className="ft-screen">
      <MagnetCard accent="#F0A400">
        <p className="ft-card-title">Shared shopping list</p>
        <p className="ft-card-sub">{doneCount} of {list.length} ticked off — visible to the whole family</p>
        <div className="ft-add-row">
          <input className="ft-input" placeholder="Add an item..." value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addItem()} />
          <select className="ft-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="ft-round-add" onClick={addItem}><Plus size={18} /></button>
        </div>
      </MagnetCard>

      {grouped.length === 0 && (
        <MagnetCard accent="#B7AE9E"><p className="ft-empty-note">Your list is empty — add something above, or generate one from the Food Creator.</p></MagnetCard>
      )}

      {grouped.map((g) => (
        <MagnetCard key={g.cat} accent="#159C86">
          <p className="ft-section-label">{g.cat}</p>
          <ul className="ft-shop-list">
            {g.items.map((it) => (
              <li key={it.id} className={it.checked ? "ft-shop-checked" : ""}>
                <button className={`ft-checkbox ${it.checked ? "ft-checkbox-on" : ""}`} onClick={() => toggle(it.id)}>
                  {it.checked && <Check size={13} strokeWidth={3} color="#fff" />}
                </button>
                <div className="ft-shop-text">
                  <span>{it.name}</span>
                  <span className="ft-shop-by">added by {it.addedBy}</span>
                </div>
                <button className="ft-trash" onClick={() => remove(it.id)}><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
        </MagnetCard>
      ))}
    </div>
  );
}

/* ------------------------- GOALS ------------------------- */

function GoalsScreen({ member, updateMember }) {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState(GOAL_TYPES[0].id);
  const [customLabel, setCustomLabel] = useState("");
  const [target, setTarget] = useState("");

  function addGoal() {
    const meta = GOAL_TYPES.find((g) => g.id === type);
    const goal = {
      id: uid(),
      type,
      label: type === "custom" ? (customLabel || "My goal") : meta.label,
      target: Number(target) || 1,
      current: 0,
      unit: meta.unit,
    };
    updateMember(member.id, { goals: [...member.goals, goal] });
    setShowForm(false); setTarget(""); setCustomLabel("");
  }
  function removeGoal(id) { updateMember(member.id, { goals: member.goals.filter((g) => g.id !== id) }); }
  function bump(id, delta) {
    updateMember(member.id, {
      goals: member.goals.map((g) => (g.id === id ? { ...g, current: Math.max(0, g.current + delta) } : g)),
    });
  }

  return (
    <div className="ft-screen">
      <MagnetCard accent={member.color.bg}>
        <p className="ft-card-title">{member.name}'s goals</p>
        <p className="ft-card-sub">Personal &amp; private — visible only to {member.name}</p>
      </MagnetCard>

      {member.goals.map((g) => {
        const pct = g.target > 0 ? g.current / g.target : 0;
        const reached = pct >= 1;
        return (
          <MagnetCard key={g.id} accent={reached ? "#159C86" : "#FF6B4A"}>
            <div className="ft-row-between">
              <p className="ft-card-title">{g.label} {reached && <PartyPopper size={16} color="#F0A400" style={{ marginLeft: 4, verticalAlign: "-2px" }} />}</p>
              <button className="ft-trash" onClick={() => removeGoal(g.id)}><Trash2 size={16} /></button>
            </div>
            <p className="ft-card-sub">{g.current} / {g.target} {g.unit}</p>
            <ProgressBar pct={pct} color={reached ? "#159C86" : "#FF6B4A"} />
            <div className="ft-goal-actions">
              <button className="ft-pill-btn" style={{ background: "#F1EADF", color: "#2B2640" }} onClick={() => bump(g.id, -1)}>-1</button>
              <button className="ft-pill-btn" style={{ background: member.color.bg }} onClick={() => bump(g.id, 1)}>+1</button>
            </div>
          </MagnetCard>
        );
      })}

      {showForm ? (
        <MagnetCard accent="#3FA9DD">
          <p className="ft-card-title">New goal</p>
          <select className="ft-select ft-select-full" value={type} onChange={(e) => setType(e.target.value)}>
            {GOAL_TYPES.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
          </select>
          {type === "custom" && (
            <input className="ft-input ft-input-full" placeholder="Name your goal" value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} />
          )}
          <input className="ft-input ft-input-full" type="number" placeholder="Target number" value={target} onChange={(e) => setTarget(e.target.value)} />
          <div className="ft-goal-actions">
            <button className="ft-pill-btn" style={{ background: "#F1EADF", color: "#2B2640" }} onClick={() => setShowForm(false)}>Cancel</button>
            <button className="ft-pill-btn" style={{ background: "#3FA9DD" }} onClick={addGoal}>Save goal</button>
          </div>
        </MagnetCard>
      ) : (
        <BigButton icon={Plus} bg="#3FA9DD" onClick={() => setShowForm(true)}>Add a goal</BigButton>
      )}
    </div>
  );
}

/* ------------------------- CHALLENGES ------------------------- */

function ChallengesScreen({ challenges, setChallenges, members }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [unit, setUnit] = useState("steps");

  function addChallenge() {
    if (!title.trim() || !goal) return;
    const contributions = {};
    members.forEach((m) => (contributions[m.id] = 0));
    setChallenges([{ id: uid(), title: title.trim(), goal: Number(goal), unit, contributions, icon: "steps" }, ...challenges]);
    setShowForm(false); setTitle(""); setGoal("");
  }
  function contribute(challengeId, memberId, amount) {
    setChallenges(challenges.map((c) => c.id === challengeId ? { ...c, contributions: { ...c.contributions, [memberId]: (c.contributions[memberId] || 0) + amount } } : c));
  }

  return (
    <div className="ft-screen">
      <MagnetCard accent="#F0A400">
        <p className="ft-card-title"><Trophy size={16} color="#F0A400" style={{ marginRight: 6, verticalAlign: "-3px" }} />Family challenges</p>
        <p className="ft-card-sub">Everyone's effort adds up — cheer each other on!</p>
      </MagnetCard>

      {challenges.map((c) => {
        const total = Object.values(c.contributions).reduce((a, b) => a + b, 0);
        const pct = total / c.goal;
        const reached = pct >= 1;
        return (
          <MagnetCard key={c.id} accent={reached ? "#159C86" : "#8B6FD1"}>
            <p className="ft-card-title">{c.title} {reached && "🎉"}</p>
            <p className="ft-card-sub">{total.toLocaleString()} / {c.goal.toLocaleString()} {c.unit}</p>
            <ProgressBar pct={pct} color={reached ? "#159C86" : "#8B6FD1"} />
            <div className="ft-contrib-list">
              {members.map((m) => (
                <div key={m.id} className="ft-contrib-row">
                  <span className="ft-dot" style={{ background: m.color.bg }}>{m.initial}</span>
                  <span className="ft-family-name">{m.name}</span>
                  <span className="ft-contrib-amount">{(c.contributions[m.id] || 0).toLocaleString()}</span>
                  <button className="ft-mini-plus" style={{ background: m.color.bg }} onClick={() => contribute(c.id, m.id, c.unit === "dinners" ? 1 : 500)}>+</button>
                </div>
              ))}
            </div>
          </MagnetCard>
        );
      })}

      {showForm ? (
        <MagnetCard accent="#3FA9DD">
          <p className="ft-card-title">New challenge</p>
          <input className="ft-input ft-input-full" placeholder='e.g. "Eat five healthy dinners"' value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="ft-add-row">
            <input className="ft-input" type="number" placeholder="Goal amount" value={goal} onChange={(e) => setGoal(e.target.value)} />
            <select className="ft-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="steps">steps</option>
              <option value="dinners">dinners</option>
              <option value="cups">cups of water</option>
              <option value="workouts">workouts</option>
            </select>
          </div>
          <div className="ft-goal-actions">
            <button className="ft-pill-btn" style={{ background: "#F1EADF", color: "#2B2640" }} onClick={() => setShowForm(false)}>Cancel</button>
            <button className="ft-pill-btn" style={{ background: "#3FA9DD" }} onClick={addChallenge}>Start challenge</button>
          </div>
        </MagnetCard>
      ) : (
        <BigButton icon={Plus} bg="#3FA9DD" onClick={() => setShowForm(true)}>Start a new challenge</BigButton>
      )}
    </div>
  );
}

/* ------------------------- ADD MEMBER MODAL ------------------------- */

function AddMemberModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [colorIdx, setColorIdx] = useState(0);
  return (
    <div className="ft-modal-backdrop" onClick={onClose}>
      <div className="ft-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ft-row-between">
          <p className="ft-card-title">Add a family member</p>
          <button className="ft-trash" onClick={onClose}><X size={18} /></button>
        </div>
        <input className="ft-input ft-input-full" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <p className="ft-section-label">Colour</p>
        <div className="ft-color-row">
          {MEMBER_PALETTE.map((c, i) => (
            <button key={c.id} className={`ft-color-dot ${colorIdx === i ? "ft-color-dot-active" : ""}`} style={{ background: c.bg }} onClick={() => setColorIdx(i)} />
          ))}
        </div>
        <BigButton
          icon={Plus}
          bg="#FF6B4A"
          onClick={() => { if (name.trim()) { onAdd(name.trim(), MEMBER_PALETTE[colorIdx]); onClose(); } }}
        >
          Add to family
        </BigButton>
      </div>
    </div>
  );
}

/* ------------------------- APP ------------------------- */

export default function FitTogetherApp() {
  const [members, setMembers] = useState(seedMembers);
  const [activeId, setActiveId] = useState("m1");
  const [screen, setScreen] = useState("home");
  const [shoppingList, setShoppingList] = useState(seedShoppingList);
  const [challenges, setChallenges] = useState(seedChallenges);
  const [showAddMember, setShowAddMember] = useState(false);

  const member = members.find((m) => m.id === activeId) || members[0];

  function updateMember(id, patch) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }
  function addMember(name, color) {
    const newMember = {
      id: uid(), name, initial: name[0].toUpperCase(), color, shareWithFamily: true,
      calorieGoal: 2000, waterGoal: 8, stepGoal: 8000,
      weeklySteps: [0, 0, 0, 0, 0, 0, 0], weeklyCalories: [0, 0, 0, 0, 0, 0, 0],
      todayCalories: 0, todayWater: 0, todaySteps: 0,
      weightLog: [], photos: [], goals: [],
    };
    setMembers((prev) => [...prev, newMember]);
    setActiveId(newMember.id);
  }
  function addIngredientsToList(ingredients, addedBy) {
    const items = ingredients.map((ing) => ({
      id: uid(), name: ing.name, category: CATEGORIES.includes(ing.category) ? ing.category : "Other",
      checked: false, addedBy: addedBy || "Food Creator",
    }));
    setShoppingList((prev) => [...items, ...prev]);
  }
  function logWater() { updateMember(member.id, { todayWater: member.todayWater + 1 }); }
  function logSteps() { updateMember(member.id, { todaySteps: member.todaySteps + 1000 }); }

  return (
    <div className="ft-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        .ft-app {
          --cream: #FFF7EC;
          --paper: #FFFFFF;
          --coral: #FF6B4A;
          --teal: #159C86;
          --gold: #F0A400;
          --sky: #3FA9DD;
          --plum: #2B2640;
          --plum-soft: #8B8478;
          font-family: 'Inter', sans-serif;
          background: var(--cream);
          color: var(--plum);
          max-width: 460px;
          margin: 0 auto;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(43,38,64,0.12);
          display: flex;
          flex-direction: column;
          height: 780px;
          position: relative;
        }
        .ft-header {
          background: var(--paper);
          padding: 20px 20px 14px;
          border-bottom: 1px solid #F1EADF;
        }
        .ft-header-top { display: flex; align-items: flex-start; justify-content: space-between; }
        .ft-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--coral); margin: 0 0 2px; }
        .ft-title { font-family: 'Baloo 2', sans-serif; font-size: 26px; font-weight: 700; margin: 0; color: var(--plum); }
        .ft-logo { width: 40px; height: 40px; border-radius: 14px; background: var(--plum); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ft-avatars { display: flex; gap: 8px; margin-top: 16px; align-items: center; }
        .ft-avatar {
          width: 42px; height: 42px; border-radius: 50%; border: 2.5px solid transparent;
          background: var(--avatar-color); color: #fff; font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 16px;
          display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform .15s ease;
          padding: 0;
        }
        .ft-avatar-active { border-color: var(--plum); transform: scale(1.08); }
        .ft-avatar-add { background: var(--cream); color: var(--plum-soft); border: 2px dashed #D9CFBE; }

        .ft-nav {
          display: flex; background: var(--paper); border-top: 1px solid #F1EADF;
          padding: 8px 4px calc(8px + env(safe-area-inset-bottom, 0px));
          flex-shrink: 0;
        }
        .ft-nav-btn {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
          background: none; border: none; padding: 6px 2px; color: var(--plum-soft); cursor: pointer; border-radius: 12px;
        }
        .ft-nav-btn span { font-size: 10px; font-weight: 600; }
        .ft-nav-btn-active { color: var(--coral); }

        .ft-screen { padding: 18px 18px 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 14px; }

        .ft-card {
          position: relative; background: var(--paper); border-radius: 22px; padding: 18px;
          border: 1px solid #F1EADF; box-shadow: 0 2px 0 #F1EADF;
        }
        .ft-magnet { position: absolute; top: -7px; left: 22px; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.15); }

        .ft-hero { background: linear-gradient(135deg, #FF6B4A, #F0A400); border: none; color: #fff; }
        .ft-hero-greet { font-family: 'Baloo 2', sans-serif; font-size: 19px; font-weight: 700; margin: 4px 0 4px; }
        .ft-hero-msg { font-size: 14px; opacity: .95; margin: 0; }

        .ft-ring-row { display: flex; gap: 10px; }
        .ft-ring-card { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 14px 8px; }
        .ft-ring-val { font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 15px; margin: 6px 0 0; }
        .ft-ring-label { font-size: 10px; color: var(--plum-soft); margin: 0; text-align: center; }
        .ft-mini-add { margin-top: 8px; border: none; color: #fff; font-size: 10px; font-weight: 700; padding: 5px 9px; border-radius: 20px; cursor: pointer; }

        .ft-row-between { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .ft-row-icon-text { display: flex; align-items: center; gap: 12px; }
        .ft-icon-badge { width: 40px; height: 40px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ft-card-title { font-family: 'Baloo 2', sans-serif; font-weight: 600; font-size: 15px; margin: 0 0 2px; }
        .ft-card-sub { font-size: 12.5px; color: var(--plum-soft); margin: 0; }

        .ft-section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--plum-soft); margin: 0 0 8px; }
        .ft-family-list { display: flex; flex-direction: column; gap: 10px; }
        .ft-family-row { display: flex; align-items: center; gap: 10px; }
        .ft-dot { width: 28px; height: 28px; border-radius: 50%; color: #fff; font-family: 'Baloo 2', sans-serif; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ft-family-name { font-weight: 600; font-size: 13.5px; flex: 1; }
        .ft-family-steps { font-size: 12px; color: var(--plum-soft); display: flex; align-items: center; gap: 4px; }
        .ft-family-private { font-size: 11px; color: #B7AE9E; font-style: italic; }

        .ft-chart-title { display: flex; align-items: center; gap: 6px; font-family: 'Baloo 2', sans-serif; font-weight: 600; font-size: 14px; margin: 0 0 4px; }
        .ft-tiny-note { font-size: 11px; color: var(--plum-soft); margin: 6px 0 0; }

        .ft-switch { position: relative; display: inline-block; width: 44px; height: 26px; flex-shrink: 0; }
        .ft-switch input { opacity: 0; width: 0; height: 0; }
        .ft-switch-track { position: absolute; inset: 0; background: #E8E1D3; border-radius: 20px; transition: .2s; }
        .ft-switch-thumb { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; background: #fff; border-radius: 50%; transition: .2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
        .ft-switch input:checked + .ft-switch-track { background: var(--sky); }
        .ft-switch input:checked + .ft-switch-track .ft-switch-thumb { transform: translateX(18px); }

        .ft-empty-note { font-size: 13px; color: var(--plum-soft); margin: 0; }
        .ft-photo-strip { display: flex; gap: 8px; overflow-x: auto; margin-top: 10px; }
        .ft-photo-thumb { flex-shrink: 0; width: 72px; text-align: center; }
        .ft-photo-thumb img { width: 72px; height: 72px; object-fit: cover; border-radius: 14px; border: 1px solid #F1EADF; }
        .ft-photo-thumb span { font-size: 10px; color: var(--plum-soft); }

        .ft-bigbtn {
          width: 100%; border: none; color: #fff; font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 15px;
          padding: 15px 18px; border-radius: 18px; display: flex; align-items: center; justify-content: center; gap: 8px;
          cursor: pointer; box-shadow: 0 3px 0 rgba(0,0,0,0.12);
        }
        .ft-bigbtn:active { transform: translateY(2px); box-shadow: none; }

        .ft-textarea {
          width: 100%; border: 1.5px solid #F1EADF; border-radius: 16px; padding: 12px 14px; font-family: 'Inter', sans-serif;
          font-size: 13.5px; resize: none; margin: 10px 0 12px; box-sizing: border-box; color: var(--plum);
        }
        .ft-textarea:focus { outline: none; border-color: var(--sky); }
        .ft-chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
        .ft-chip { background: #F1EADF; border: none; border-radius: 20px; padding: 7px 12px; font-size: 11.5px; color: var(--plum); cursor: pointer; font-weight: 500; }

        .ft-recipe-title { font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 18px; margin: 0 0 4px; }
        .ft-macro-row { display: flex; justify-content: space-between; margin: 14px 0; background: var(--cream); border-radius: 14px; padding: 10px 6px; }
        .ft-macro { display: flex; flex-direction: column; align-items: center; }
        .ft-macro-val { font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 14px; }
        .ft-macro-label { font-size: 9.5px; color: var(--plum-soft); }
        .ft-ingredient-list { list-style: none; margin: 0 0 10px; padding: 0; display: flex; flex-direction: column; gap: 7px; }
        .ft-ingredient-list li { display: flex; justify-content: space-between; font-size: 13px; border-bottom: 1px dashed #F1EADF; padding-bottom: 6px; }
        .ft-ing-amount { color: var(--plum-soft); }
        .ft-steps-list { margin: 0 0 14px; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; font-size: 13px; }
        .ft-steps-list li { padding-left: 2px; }

        .ft-add-row { display: flex; gap: 8px; margin-top: 10px; }
        .ft-input { flex: 1; min-width: 0; border: 1.5px solid #F1EADF; border-radius: 14px; padding: 10px 12px; font-size: 13px; font-family: 'Inter', sans-serif; color: var(--plum); }
        .ft-input:focus { outline: none; border-color: var(--sky); }
        .ft-input-full { width: 100%; box-sizing: border-box; margin: 10px 0; }
        .ft-select { border: 1.5px solid #F1EADF; border-radius: 14px; padding: 10px 8px; font-size: 12.5px; font-family: 'Inter', sans-serif; color: var(--plum); background: #fff; }
        .ft-select-full { width: 100%; box-sizing: border-box; margin: 10px 0; }
        .ft-round-add { width: 40px; height: 40px; border-radius: 14px; border: none; background: var(--coral); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }

        .ft-shop-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .ft-shop-list li { display: flex; align-items: center; gap: 10px; }
        .ft-shop-checked .ft-shop-text span:first-child { text-decoration: line-through; color: #B7AE9E; }
        .ft-checkbox { width: 24px; height: 24px; border-radius: 8px; border: 2px solid #D9CFBE; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; padding: 0; }
        .ft-checkbox-on { background: var(--teal); border-color: var(--teal); }
        .ft-shop-text { flex: 1; display: flex; flex-direction: column; }
        .ft-shop-text span:first-child { font-size: 13.5px; font-weight: 500; }
        .ft-shop-by { font-size: 10.5px; color: var(--plum-soft); }
        .ft-trash { background: none; border: none; color: #C9BFAE; cursor: pointer; padding: 4px; display: flex; }

        .ft-goal-actions { display: flex; gap: 8px; margin-top: 12px; }
        .ft-pill-btn { border: none; border-radius: 14px; padding: 9px 16px; font-size: 12.5px; font-weight: 700; color: #fff; cursor: pointer; flex: 1; }
        .ft-progress-track { width: 100%; height: 10px; background: #F1EADF; border-radius: 20px; margin: 10px 0 2px; overflow: hidden; }
        .ft-progress-fill { height: 100%; border-radius: 20px; transition: width .5s ease; }

        .ft-contrib-list { display: flex; flex-direction: column; gap: 9px; margin-top: 14px; }
        .ft-contrib-row { display: flex; align-items: center; gap: 10px; }
        .ft-contrib-amount { font-size: 12px; color: var(--plum-soft); font-weight: 600; }
        .ft-mini-plus { width: 26px; height: 26px; border-radius: 50%; border: none; color: #fff; font-weight: 700; font-size: 15px; cursor: pointer; flex-shrink: 0; }

        .ft-modal-backdrop { position: absolute; inset: 0; background: rgba(43,38,64,0.45); display: flex; align-items: flex-end; z-index: 20; }
        .ft-modal { background: #fff; width: 100%; border-radius: 24px 24px 0 0; padding: 22px; box-sizing: border-box; }
        .ft-color-row { display: flex; gap: 10px; margin-bottom: 16px; }
        .ft-color-dot { width: 32px; height: 32px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; }
        .ft-color-dot-active { border-color: var(--plum); }

        .ft-app::-webkit-scrollbar { width: 6px; }
        .ft-app *::-webkit-scrollbar { width: 6px; }
        .ft-app *::-webkit-scrollbar-thumb { background: #E8E1D3; border-radius: 10px; }
      `}</style>

      <Header members={members} activeId={activeId} setActiveId={setActiveId} onAddMember={() => setShowAddMember(true)} screen={screen} />

      {screen === "home" && <HomeScreen member={member} allMembers={members} setScreen={setScreen} logWater={logWater} logSteps={logSteps} />}
      {screen === "progress" && <ProgressScreen member={member} updateMember={updateMember} />}
      {screen === "food" && <FoodCreatorScreen addIngredientsToList={addIngredientsToList} memberName={member.name} />}
      {screen === "shopping" && <ShoppingListScreen list={shoppingList} setList={setShoppingList} />}
      {screen === "goals" && <GoalsScreen member={member} updateMember={updateMember} />}
      {screen === "challenges" && <ChallengesScreen challenges={challenges} setChallenges={setChallenges} members={members} />}

      <BottomNav screen={screen} setScreen={setScreen} />

      {showAddMember && <AddMemberModal onClose={() => setShowAddMember(false)} onAdd={addMember} />}
    </div>
  );
}
