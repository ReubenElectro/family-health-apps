import React, { useState, useMemo, useRef } from "react";
import {
  Home, Activity, Footprints, Droplet, Flame, Dumbbell, ShoppingCart,
  Target, Trophy, Users, Plus, Minus, Check, X, ChevronRight, Star,
  Sparkles, ExternalLink, ArrowRight, Loader2, Scale, UtensilsCrossed,
  Leaf, Clock, Lock, Crown, Search, Trash2, PartyPopper, ChefHat,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid,
} from "recharts";

/* =========================================================================
   FOODIE — a warm, premium family nutrition & fitness app
   Signature motif: a dotted "journey" trail linking each day's stats,
   and a gold passport-style stamp badge for Premium features.
========================================================================= */

const MEMBER_COLORS = ["#2F6D4F", "#E0A73C", "#3B7EA1", "#C1543A", "#6C5B9C", "#3F8F6B"];
const CATEGORIES = ["Produce", "Protein", "Dairy", "Pantry", "Frozen", "Bakery", "Other"];
const RECIPE_FILTERS = ["All", "High-Protein", "Vegetarian", "Quick", "High-Calorie", "Kid-Friendly"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function uid() { return Math.random().toString(36).slice(2, 10); }

/* --------------------------- recipe generation --------------------------- */

const PROTEINS = [
  { name: "Chicken Breast", veg: false, kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Turkey Mince", veg: false, kcal: 170, protein: 29, carbs: 0, fat: 5 },
  { name: "Salmon Fillet", veg: false, kcal: 208, protein: 20, carbs: 0, fat: 13 },
  { name: "King Prawns", veg: false, kcal: 99, protein: 24, carbs: 0.2, fat: 0.3 },
  { name: "Lean Beef Mince", veg: false, kcal: 212, protein: 26, carbs: 0, fat: 12 },
  { name: "Tofu", veg: true, kcal: 144, protein: 15, carbs: 3, fat: 9 },
  { name: "Chickpeas", veg: true, kcal: 164, protein: 9, carbs: 27, fat: 2.6 },
  { name: "Red Lentils", veg: true, kcal: 116, protein: 9, carbs: 20, fat: 0.4 },
  { name: "Free-Range Eggs", veg: true, kcal: 155, protein: 13, carbs: 1.1, fat: 11 },
  { name: "Cottage Cheese", veg: true, kcal: 98, protein: 11, carbs: 3.4, fat: 4.3 },
];

const CARBS = [
  { name: "Brown Rice", kcal: 112, carbs: 24, protein: 2.6, fat: 0.9 },
  { name: "Quinoa", kcal: 120, carbs: 21, protein: 4.4, fat: 1.9 },
  { name: "Sweet Potato", kcal: 86, carbs: 20, protein: 1.6, fat: 0.1 },
  { name: "Wholemeal Pasta", kcal: 124, carbs: 25, protein: 5, fat: 1.1 },
  { name: "Couscous", kcal: 112, carbs: 23, protein: 3.8, fat: 0.2 },
  { name: "Egg Noodles", kcal: 138, carbs: 25, protein: 4.5, fat: 2.1 },
  { name: "Flatbread", kcal: 275, carbs: 47, protein: 9, fat: 5 },
  { name: "New Potatoes", kcal: 77, carbs: 17, protein: 2, fat: 0.1 },
];

const VEG = ["Broccoli", "Spinach", "Mixed Peppers", "Courgette", "Green Beans", "Kale", "Carrots", "Cherry Tomatoes", "Peas", "Mushrooms"];

const STYLES = [
  { name: "Traybake", tags: ["Quick"], title: (p, c, v) => `${p} & ${v} Traybake with ${c}`,
    steps: (p, c, v) => [`Preheat the oven to 200°C.`, `Toss the ${p.toLowerCase()} with ${v.toLowerCase()} and a little olive oil on a large tray.`, `Roast for 20–25 minutes until cooked through.`, `Serve with ${c.toLowerCase()} on the side.`] },
  { name: "Stir-fry", tags: ["Quick"], title: (p, c, v) => `${p} Stir-fry with ${v} & ${c}`,
    steps: (p, c, v) => [`Cook the ${c.toLowerCase()} according to the packet and set aside.`, `Stir-fry the ${p.toLowerCase()} in a hot pan for 5–6 minutes.`, `Add the ${v.toLowerCase()} and cook for a further 3–4 minutes.`, `Toss everything together with a splash of soy sauce and serve.`] },
  { name: "Bowl", tags: ["Quick"], title: (p, c, v) => `${p} & ${c} Power Bowl with ${v}`,
    steps: (p, c, v) => [`Cook the ${c.toLowerCase()} and leave to cool slightly.`, `Pan-fry or bake the ${p.toLowerCase()} until cooked through.`, `Layer the ${c.toLowerCase()}, ${p.toLowerCase()} and ${v.toLowerCase()} in a bowl.`, `Finish with a simple dressing of your choice.`] },
  { name: "Curry", tags: [], title: (p, c, v) => `${p} & ${v} Curry with ${c}`,
    steps: (p, c, v) => [`Soften an onion and garlic in a large pan.`, `Add curry spices and cook for a minute until fragrant.`, `Stir in the ${p.toLowerCase()}, ${v.toLowerCase()} and a tin of tomatoes or coconut milk.`, `Simmer for 15–20 minutes and serve with ${c.toLowerCase()}.`] },
  { name: "Bake", tags: [], title: (p, c, v) => `Cheesy ${p} & ${c} Bake`,
    steps: (p, c, v) => [`Preheat the oven to 190°C.`, `Layer the ${p.toLowerCase()}, ${c.toLowerCase()} and ${v.toLowerCase()} in a baking dish.`, `Sprinkle with grated cheese.`, `Bake for 25–30 minutes until golden and bubbling.`] },
  { name: "Salad", tags: ["Quick"], title: (p, c, v) => `${p} & ${c} Salad with ${v}`,
    steps: (p, c, v) => [`Cook the ${c.toLowerCase()} and allow to cool.`, `Cook the ${p.toLowerCase()} and slice or flake.`, `Toss the ${c.toLowerCase()}, ${p.toLowerCase()} and ${v.toLowerCase()} together.`, `Dress lightly and serve.`] },
  { name: "Skewers", tags: ["Quick"], title: (p, c, v) => `${p} Skewers with ${c} & ${v}`,
    steps: (p, c, v) => [`Thread the ${p.toLowerCase()} and ${v.toLowerCase()} onto skewers.`, `Grill or barbecue for 10–12 minutes, turning occasionally.`, `Serve with ${c.toLowerCase()} and a squeeze of lemon.`] },
  { name: "Soup", tags: [], title: (p, c, v) => `${p} & ${v} Soup with ${c}`,
    steps: (p, c, v) => [`Soften the ${v.toLowerCase()} in a large pot with a little oil.`, `Add stock and the ${p.toLowerCase()}, then simmer for 15 minutes.`, `Stir through the ${c.toLowerCase()} for the final few minutes.`, `Season to taste and serve warm.`] },
  { name: "Wrap", tags: ["Quick"], title: (p, c, v) => `${p} Wrap with ${v}`,
    steps: (p, c, v) => [`Cook the ${p.toLowerCase()} and slice.`, `Warm the flatbread or wrap.`, `Fill with the ${p.toLowerCase()}, ${v.toLowerCase()} and a spoon of yoghurt or sauce.`, `Roll up and serve.`] },
  { name: "One-Pot", tags: [], title: (p, c, v) => `One-Pot ${p} with ${c} & ${v}`,
    steps: (p, c, v) => [`Brown the ${p.toLowerCase()} in a large pot.`, `Add the ${c.toLowerCase()} and enough stock to cover.`, `Simmer for 15–20 minutes, stirring occasionally.`, `Stir through the ${v.toLowerCase()} for the last 5 minutes and serve.`] },
];

function buildGeneratedRecipes() {
  const list = [];
  let n = 0;
  PROTEINS.forEach((p, pi) => {
    STYLES.forEach((s, si) => {
      n++;
      const carb = CARBS[(pi + si) % CARBS.length];
      const veg = VEG[(pi * 3 + si) % VEG.length];
      const heavy = ["Curry", "Bake", "One-Pot"].includes(s.name);
      const kcal = Math.round(p.kcal * 1.5 + carb.kcal * 1.5 + 35 + (heavy ? 110 : 55));
      const protein = Math.round(p.protein * 1.5 + carb.protein * 1.5 * 0.4);
      const carbsG = Math.round(p.carbs * 1.5 + carb.carbs * 1.5 + 6);
      const fat = Math.round(p.fat * 1.5 + carb.fat * 1.5 + (heavy ? 11 : 5));
      const tags = new Set(s.tags);
      if (p.veg) tags.add("Vegetarian");
      if (protein >= 32) tags.add("High-Protein");
      if (kcal >= 650) tags.add("High-Calorie");
      const kidFriendly = ["Traybake", "Bowl", "Wrap", "Skewers", "Bake"].includes(s.name);
      if (kidFriendly) tags.add("Kid-Friendly");
      const ingredients = [
        { name: p.name, amount: "300g", category: p.veg ? "Pantry" : "Protein" },
        { name: carb.name, amount: "200g", category: "Pantry" },
        { name: veg, amount: "150g", category: "Produce" },
        { name: "Olive oil", amount: "1 tbsp", category: "Pantry" },
        { name: "Salt & pepper", amount: "to taste", category: "Pantry" },
      ];
      if (["Curry", "One-Pot"].includes(s.name)) ingredients.push({ name: "Tinned tomatoes or coconut milk", amount: "400ml", category: "Pantry" });
      if (s.name === "Bake") ingredients.push({ name: "Grated cheese", amount: "50g", category: "Dairy" });
      list.push({
        id: `g${n}`, title: s.title(p.name, carb.name, veg), tags: Array.from(tags),
        time: s.tags.includes("Quick") ? 20 : (["Curry", "Bake", "One-Pot", "Soup"].includes(s.name) ? 40 : 30),
        servings: 4, calories: kcal, protein, carbs: carbsG, fat,
        ingredients, steps: s.steps(p.name, carb.name, veg),
      });
    });
  });
  return list;
}

const FAMILY_FAVOURITES = [
  { title: "Veggie-Packed Spaghetti Bolognese", tags: ["High-Protein", "Kid-Friendly"], time: 35, servings: 4, calories: 560, protein: 34, carbs: 58, fat: 16,
    ingredients: [{ name: "Lean Beef Mince", amount: "400g", category: "Protein" }, { name: "Wholemeal Spaghetti", amount: "300g", category: "Pantry" }, { name: "Grated Carrot & Courgette", amount: "200g", category: "Produce" }, { name: "Tinned Tomatoes", amount: "2 x 400g", category: "Pantry" }, { name: "Parmesan", amount: "40g", category: "Dairy" }],
    steps: ["Brown the mince in a large pan.", "Stir in the grated vegetables and cook for 3 minutes.", "Add the tinned tomatoes and simmer for 20 minutes.", "Cook the spaghetti and toss through the sauce, finishing with parmesan."] },
  { title: "Homemade Fish Fingers with Sweet Potato Wedges", tags: ["Kid-Friendly", "Quick"], time: 25, servings: 4, calories: 480, protein: 28, carbs: 46, fat: 15,
    ingredients: [{ name: "White Fish Fillets", amount: "500g", category: "Protein" }, { name: "Wholemeal Breadcrumbs", amount: "100g", category: "Pantry" }, { name: "Sweet Potato", amount: "600g", category: "Produce" }, { name: "Free-Range Eggs", amount: "2", category: "Dairy" }],
    steps: ["Cut the sweet potato into wedges and roast at 200°C for 25 minutes.", "Slice the fish into fingers, dip in egg, then breadcrumbs.", "Bake the fish fingers for 15 minutes until golden.", "Serve together with a wedge of lemon."] },
  { title: "Loaded Turkey Tacos", tags: ["High-Protein", "Quick", "Kid-Friendly"], time: 20, servings: 4, calories: 520, protein: 36, carbs: 42, fat: 18,
    ingredients: [{ name: "Turkey Mince", amount: "400g", category: "Protein" }, { name: "Soft Tortillas", amount: "8", category: "Bakery" }, { name: "Black Beans", amount: "1 tin", category: "Pantry" }, { name: "Shredded Lettuce & Tomato", amount: "1 bag", category: "Produce" }, { name: "Grated Cheese", amount: "80g", category: "Dairy" }],
    steps: ["Brown the turkey mince with taco seasoning.", "Warm the black beans through.", "Warm the tortillas.", "Build tacos with mince, beans, lettuce, tomato and cheese."] },
  { title: "Cheesy Broccoli Pasta Bake", tags: ["Vegetarian", "Kid-Friendly"], time: 35, servings: 4, calories: 610, protein: 26, carbs: 68, fat: 22,
    ingredients: [{ name: "Wholemeal Pasta", amount: "350g", category: "Pantry" }, { name: "Broccoli", amount: "300g", category: "Produce" }, { name: "Cheddar Cheese", amount: "150g", category: "Dairy" }, { name: "Milk", amount: "400ml", category: "Dairy" }, { name: "Flour", amount: "30g", category: "Pantry" }],
    steps: ["Cook the pasta and broccoli together until just tender.", "Make a cheese sauce with the flour, milk and most of the cheese.", "Combine the pasta, broccoli and sauce in a dish.", "Top with remaining cheese and bake at 190°C for 15 minutes."] },
  { title: "Salmon & New Potato Traybake", tags: ["High-Protein", "Quick"], time: 25, servings: 4, calories: 540, protein: 33, carbs: 34, fat: 24,
    ingredients: [{ name: "Salmon Fillets", amount: "4", category: "Protein" }, { name: "New Potatoes", amount: "600g", category: "Produce" }, { name: "Green Beans", amount: "200g", category: "Produce" }, { name: "Lemon", amount: "1", category: "Produce" }],
    steps: ["Parboil the potatoes for 10 minutes, then halve.", "Roast the potatoes at 200°C for 15 minutes.", "Add the salmon and green beans, roast for a further 12 minutes.", "Squeeze over lemon before serving."] },
  { title: "Veggie Fried Rice", tags: ["Vegetarian", "Quick"], time: 15, servings: 4, calories: 430, protein: 14, carbs: 62, fat: 12,
    ingredients: [{ name: "Cooked Brown Rice", amount: "500g", category: "Pantry" }, { name: "Frozen Peas & Carrots", amount: "250g", category: "Frozen" }, { name: "Free-Range Eggs", amount: "3", category: "Dairy" }, { name: "Soy Sauce", amount: "2 tbsp", category: "Pantry" }],
    steps: ["Scramble the eggs in a hot wok, then set aside.", "Stir-fry the frozen vegetables for 3 minutes.", "Add the rice and eggs back in, tossing well.", "Season with soy sauce and serve."] },
  { title: "BBQ Chicken Flatbreads", tags: ["High-Protein", "Kid-Friendly"], time: 25, servings: 4, calories: 590, protein: 38, carbs: 52, fat: 20,
    ingredients: [{ name: "Chicken Breast", amount: "400g", category: "Protein" }, { name: "Flatbreads", amount: "4", category: "Bakery" }, { name: "BBQ Sauce", amount: "4 tbsp", category: "Pantry" }, { name: "Mixed Peppers", amount: "200g", category: "Produce" }, { name: "Mozzarella", amount: "100g", category: "Dairy" }],
    steps: ["Grill the chicken and slice.", "Toss the chicken with BBQ sauce.", "Top flatbreads with chicken, peppers and mozzarella.", "Bake at 200°C for 10 minutes until melted."] },
  { title: "Mini Beef Meatball Subs", tags: ["High-Protein", "Kid-Friendly"], time: 30, servings: 4, calories: 570, protein: 34, carbs: 48, fat: 22,
    ingredients: [{ name: "Lean Beef Mince", amount: "400g", category: "Protein" }, { name: "Wholemeal Sub Rolls", amount: "4", category: "Bakery" }, { name: "Tomato Sauce", amount: "300ml", category: "Pantry" }, { name: "Mozzarella", amount: "80g", category: "Dairy" }],
    steps: ["Roll the mince into small meatballs.", "Fry until browned, then simmer in tomato sauce for 15 minutes.", "Fill the rolls with meatballs and sauce.", "Top with mozzarella and grill until melted."] },
  { title: "Sweetcorn & Black Bean Quesadillas", tags: ["Vegetarian", "Quick", "Kid-Friendly"], time: 15, servings: 4, calories: 460, protein: 18, carbs: 56, fat: 16,
    ingredients: [{ name: "Tortillas", amount: "8", category: "Bakery" }, { name: "Black Beans", amount: "1 tin", category: "Pantry" }, { name: "Sweetcorn", amount: "200g", category: "Frozen" }, { name: "Cheddar Cheese", amount: "120g", category: "Dairy" }],
    steps: ["Mash the black beans lightly with the sweetcorn.", "Spread onto a tortilla, top with cheese and another tortilla.", "Cook in a dry pan for 2–3 minutes each side.", "Slice into wedges and serve."] },
  { title: "Prawn & Veg Noodle Stir-fry", tags: ["High-Protein", "Quick"], time: 15, servings: 4, calories: 410, protein: 27, carbs: 48, fat: 10,
    ingredients: [{ name: "King Prawns", amount: "350g", category: "Protein" }, { name: "Egg Noodles", amount: "300g", category: "Pantry" }, { name: "Stir-fry Vegetable Mix", amount: "300g", category: "Produce" }, { name: "Soy & Ginger Sauce", amount: "3 tbsp", category: "Pantry" }],
    steps: ["Cook the noodles according to the packet.", "Stir-fry the vegetables for 3–4 minutes.", "Add the prawns and cook until pink.", "Toss through the noodles and sauce."] },
  { title: "Overnight Protein Oats", tags: ["High-Protein", "Vegetarian", "Quick"], time: 5, servings: 1, calories: 380, protein: 28, carbs: 46, fat: 9,
    ingredients: [{ name: "Rolled Oats", amount: "60g", category: "Pantry" }, { name: "Greek Yoghurt", amount: "150g", category: "Dairy" }, { name: "Milk", amount: "120ml", category: "Dairy" }, { name: "Berries", amount: "80g", category: "Produce" }],
    steps: ["Combine the oats, yoghurt and milk in a jar.", "Stir well and refrigerate overnight.", "Top with berries in the morning.", "Enjoy cold or warmed through."] },
  { title: "High-Calorie Peanut Butter Banana Smoothie", tags: ["High-Calorie", "Vegetarian", "Quick"], time: 5, servings: 1, calories: 650, protein: 24, carbs: 68, fat: 28,
    ingredients: [{ name: "Banana", amount: "2", category: "Produce" }, { name: "Peanut Butter", amount: "3 tbsp", category: "Pantry" }, { name: "Whole Milk", amount: "400ml", category: "Dairy" }, { name: "Rolled Oats", amount: "40g", category: "Pantry" }],
    steps: ["Add all ingredients to a blender.", "Blend until smooth.", "Pour into a large glass.", "Great post-workout for muscle gain."] },
];

function buildRecipeLibrary() {
  const gen = buildGeneratedRecipes();
  const fav = FAMILY_FAVOURITES.map((r, i) => ({ id: `f${i}`, ...r }));
  return [...fav, ...gen];
}
const RECIPE_LIBRARY = buildRecipeLibrary();

/* --------------------------------- ui bits -------------------------------- */

function Ring({ pct, color, size = 68, stroke = 8, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, pct || 0));
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#EDE6D6" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={c - clamped * c} strokeLinecap="round" style={{ transition: "stroke-dashoffset .6s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
}

function JourneyCard({ children, style, className = "" }) {
  return <div className={`fd-card ${className}`} style={style}><span className="fd-trail" />{children}</div>;
}

function BigButton({ icon: Icon, children, onClick, bg = "#2F6D4F", style, disabled }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className="fd-bigbtn" style={{ background: bg, ...style }}>
      {Icon && <Icon size={19} strokeWidth={2.3} />}
      <span>{children}</span>
    </button>
  );
}

function ProgressBar({ pct, color = "#2F6D4F" }) {
  return <div className="fd-progress-track"><div className="fd-progress-fill" style={{ width: `${Math.min(100, (pct || 0) * 100)}%`, background: color }} /></div>;
}

function PremiumStamp({ small }) {
  return (
    <span className="fd-stamp" style={small ? { width: 22, height: 22 } : {}}>
      <Crown size={small ? 11 : 14} color="#8A5A16" strokeWidth={2.4} />
    </span>
  );
}

/* -------------------------------- splash -------------------------------- */

function SplashScreen({ onEnter, exiting }) {
  return (
    <div className={`fd-splash ${exiting ? "fd-splash-exit" : ""}`}>
      <div className="fd-splash-inner">
        <p className="fd-splash-logo">Foodie</p>
        <p className="fd-splash-sub">This is your journey</p>
        <button className="fd-enter-btn" onClick={onEnter}>
          Enter <ArrowRight size={18} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- onboarding ------------------------------- */

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [homeName, setHomeName] = useState("");
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");

  function addMember() {
    if (!name.trim()) return;
    const color = MEMBER_COLORS[members.length % MEMBER_COLORS.length];
    setMembers([...members, { id: uid(), name: name.trim(), initial: name.trim()[0].toUpperCase(), color }]);
    setName("");
  }
  function removeMember(id) { setMembers(members.filter((m) => m.id !== id)); }

  return (
    <div className="fd-onboard">
      <div className="fd-onboard-head">
        <p className="fd-eyebrow">Foodie</p>
        <h1 className="fd-onboard-title">{step === 1 ? "Set up your private home" : "Who's on the journey?"}</h1>
        <p className="fd-onboard-sub">{step === 1 ? "Only your family will ever see what's inside." : "Add each family member — everyone gets their own private profile."}</p>
      </div>

      {step === 1 ? (
        <div className="fd-onboard-body">
          <input className="fd-input fd-input-full fd-input-lg" placeholder="e.g. The Whitmore Home" value={homeName} onChange={(e) => setHomeName(e.target.value)} />
          <BigButton icon={ArrowRight} onClick={() => homeName.trim() && setStep(2)} disabled={!homeName.trim()}>Continue</BigButton>
        </div>
      ) : (
        <div className="fd-onboard-body">
          <div className="fd-add-row">
            <input className="fd-input" placeholder="Family member's name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addMember()} />
            <button className="fd-round-add" onClick={addMember}><Plus size={18} /></button>
          </div>
          <div className="fd-onboard-members">
            {members.map((m) => (
              <div key={m.id} className="fd-onboard-member">
                <span className="fd-dot" style={{ background: m.color }}>{m.initial}</span>
                <span>{m.name}</span>
                <button className="fd-trash" onClick={() => removeMember(m.id)}><X size={15} /></button>
              </div>
            ))}
            {members.length === 0 && <p className="fd-empty-note">No one added yet — add at least one family member to continue.</p>}
          </div>
          <BigButton icon={Sparkles} onClick={() => members.length > 0 && onComplete(homeName.trim(), members)} disabled={members.length === 0}>
            Create the {homeName.trim() || "Foodie"} home
          </BigButton>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- header --------------------------------- */

function Header({ homeName, members, activeId, setActiveId, screenTitle, isPremium }) {
  return (
    <div className="fd-header">
      <div className="fd-header-top">
        <div>
          <p className="fd-eyebrow">{homeName}</p>
          <h1 className="fd-title">{screenTitle}{isPremium && <PremiumStamp small />}</h1>
        </div>
        <div className="fd-logo"><UtensilsCrossed size={19} color="#fff" strokeWidth={2.3} /></div>
      </div>
      <div className="fd-avatars">
        {members.map((m) => (
          <button key={m.id} onClick={() => setActiveId(m.id)} className={`fd-avatar ${activeId === m.id ? "fd-avatar-active" : ""}`} style={{ "--avatar-color": m.color }} title={m.name}>
            {m.initial}
          </button>
        ))}
      </div>
    </div>
  );
}

function BottomNav({ screen, setScreen, isPremium }) {
  const items = [
    { id: "home", label: "Home", icon: Home },
    { id: "track", label: "Track", icon: Activity },
    { id: "recipes", label: "Recipes", icon: ChefHat },
    { id: "creator", label: "Creator", icon: isPremium ? Sparkles : Lock },
    { id: "shop", label: "Shop", icon: ShoppingCart },
    { id: "family", label: "Family", icon: Users },
  ];
  return (
    <nav className="fd-nav">
      {items.map((it) => {
        const Icon = it.icon;
        const active = screen === it.id;
        return (
          <button key={it.id} className={`fd-nav-btn ${active ? "fd-nav-btn-active" : ""}`} onClick={() => setScreen(it.id)}>
            <Icon size={19} strokeWidth={active ? 2.5 : 2} />
            <span>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* --------------------------------- home --------------------------------- */

function encouragement(pct) {
  if (pct > 0.9) return "You're right on track today — brilliant work! 🌿";
  if (pct > 0.6) return "Good progress today, keep the momentum going.";
  if (pct > 0.3) return "A little more movement would set today up nicely.";
  return "Every healthy choice today is a step on the journey.";
}

function HomeScreen({ member, members, setScreen, bumpWater, bumpSteps }) {
  const pctCal = member.todayCalories / member.calorieGoal;
  const pctProtein = member.todayProtein / member.proteinGoal;
  const pctWater = member.todayWater / member.waterGoal;
  const pctSteps = member.todaySteps / member.stepGoal;
  const avg = (pctCal + pctWater + pctSteps) / 3;

  return (
    <div className="fd-screen">
      <JourneyCard className="fd-hero">
        <p className="fd-hero-greet">Good to see you, {member.name.split(" ")[0]}</p>
        <p className="fd-hero-msg">{encouragement(avg)}</p>
      </JourneyCard>

      <div className="fd-ring-row">
        <JourneyCard className="fd-ring-card">
          <Ring pct={pctCal} color="#2F6D4F" size={68}><Flame size={17} color="#2F6D4F" /></Ring>
          <p className="fd-ring-val">{member.todayCalories}</p>
          <p className="fd-ring-label">of {member.calorieGoal} kcal</p>
        </JourneyCard>
        <JourneyCard className="fd-ring-card">
          <Ring pct={pctProtein} color="#C1543A" size={68}><Dumbbell size={16} color="#C1543A" /></Ring>
          <p className="fd-ring-val">{member.todayProtein}g</p>
          <p className="fd-ring-label">of {member.proteinGoal}g protein</p>
        </JourneyCard>
        <JourneyCard className="fd-ring-card">
          <Ring pct={pctWater} color="#3B7EA1" size={68}><Droplet size={16} color="#3B7EA1" /></Ring>
          <p className="fd-ring-val">{member.todayWater}</p>
          <p className="fd-ring-label">of {member.waterGoal} glasses</p>
          <button className="fd-mini-add" style={{ background: "#3B7EA1" }} onClick={bumpWater}>+1 glass</button>
        </JourneyCard>
        <JourneyCard className="fd-ring-card">
          <Ring pct={pctSteps} color="#E0A73C" size={68}><Footprints size={16} color="#E0A73C" /></Ring>
          <p className="fd-ring-val">{member.todaySteps.toLocaleString()}</p>
          <p className="fd-ring-label">of {member.stepGoal.toLocaleString()} steps</p>
          <button className="fd-mini-add" style={{ background: "#E0A73C" }} onClick={bumpSteps}>+1,000</button>
        </JourneyCard>
      </div>

      <JourneyCard style={{ cursor: "pointer" }}>
        <div className="fd-row-between" onClick={() => setScreen("creator")}>
          <div className="fd-row-icon-text">
            <div className="fd-icon-badge" style={{ background: "#F7ECD3" }}><Sparkles size={18} color="#E0A73C" /></div>
            <div>
              <p className="fd-card-title">Need meal inspiration? <PremiumStamp small /></p>
              <p className="fd-card-sub">Ask the Food Creator to find a real recipe</p>
            </div>
          </div>
          <ChevronRight size={19} color="#B8AD97" />
        </div>
      </JourneyCard>

      <JourneyCard style={{ cursor: "pointer" }}>
        <div className="fd-row-between" onClick={() => setScreen("recipes")}>
          <div className="fd-row-icon-text">
            <div className="fd-icon-badge" style={{ background: "#E4EFE6" }}><ChefHat size={18} color="#2F6D4F" /></div>
            <div>
              <p className="fd-card-title">Browse the recipe library</p>
              <p className="fd-card-sub">{RECIPE_LIBRARY.length}+ healthy family recipes</p>
            </div>
          </div>
          <ChevronRight size={19} color="#B8AD97" />
        </div>
      </JourneyCard>

      <p className="fd-section-label">Family snapshot</p>
      <JourneyCard>
        <div className="fd-family-list">
          {members.map((m) => (
            <div className="fd-family-row" key={m.id}>
              <span className="fd-dot" style={{ background: m.color }}>{m.initial}</span>
              <span className="fd-family-name">{m.name}</span>
              <span className="fd-family-steps"><Footprints size={13} /> {m.todaySteps.toLocaleString()}</span>
              <span className="fd-family-cal"><Flame size={13} /> {m.todayCalories} kcal</span>
            </div>
          ))}
        </div>
      </JourneyCard>
    </div>
  );
}

/* --------------------------------- track --------------------------------- */

function TrackScreen({ member, updateMember }) {
  const [mealName, setMealName] = useState("");
  const [mealCal, setMealCal] = useState("");
  const [mealProtein, setMealProtein] = useState("");
  const [exName, setExName] = useState("");
  const [exMin, setExMin] = useState("");
  const [weightInput, setWeightInput] = useState("");

  function addMeal() {
    if (!mealName.trim() || !mealCal) return;
    const cal = Number(mealCal) || 0;
    const pro = Number(mealProtein) || 0;
    updateMember(member.id, {
      todayMeals: [{ id: uid(), name: mealName.trim(), calories: cal, protein: pro }, ...member.todayMeals],
      todayCalories: member.todayCalories + cal,
      todayProtein: member.todayProtein + pro,
    });
    setMealName(""); setMealCal(""); setMealProtein("");
  }
  function removeMeal(id) {
    const meal = member.todayMeals.find((m) => m.id === id);
    if (!meal) return;
    updateMember(member.id, {
      todayMeals: member.todayMeals.filter((m) => m.id !== id),
      todayCalories: Math.max(0, member.todayCalories - meal.calories),
      todayProtein: Math.max(0, member.todayProtein - meal.protein),
    });
  }
  function addExercise(type, minutes, kcal) {
    updateMember(member.id, { todayExercise: [{ id: uid(), type, minutes, kcal }, ...member.todayExercise] });
  }
  function removeExercise(id) { updateMember(member.id, { todayExercise: member.todayExercise.filter((e) => e.id !== id) }); }
  function logWeight() {
    const val = Number(weightInput);
    if (!val) return;
    updateMember(member.id, { weightLog: [...member.weightLog, { label: `Entry ${member.weightLog.length + 1}`, value: val }] });
    setWeightInput("");
  }

  const stepData = WEEKDAYS.map((d, i) => ({ day: d, steps: member.weeklySteps[i] }));
  const calData = WEEKDAYS.map((d, i) => ({ day: d, cal: member.weeklyCalories[i] }));

  return (
    <div className="fd-screen">
      <JourneyCard>
        <p className="fd-card-title">Log a meal</p>
        <div className="fd-add-row">
          <input className="fd-input" placeholder="Meal name" value={mealName} onChange={(e) => setMealName(e.target.value)} />
        </div>
        <div className="fd-add-row" style={{ marginTop: 8 }}>
          <input className="fd-input" type="number" placeholder="Calories" value={mealCal} onChange={(e) => setMealCal(e.target.value)} />
          <input className="fd-input" type="number" placeholder="Protein (g)" value={mealProtein} onChange={(e) => setMealProtein(e.target.value)} />
          <button className="fd-round-add" onClick={addMeal}><Plus size={18} /></button>
        </div>
        {member.todayMeals.length > 0 && (
          <ul className="fd-meal-list">
            {member.todayMeals.map((m) => (
              <li key={m.id}>
                <span>{m.name}</span>
                <span className="fd-meal-macros">{m.calories} kcal · {m.protein}g protein</span>
                <button className="fd-trash" onClick={() => removeMeal(m.id)}><Trash2 size={14} /></button>
              </li>
            ))}
          </ul>
        )}
      </JourneyCard>

      <JourneyCard>
        <p className="fd-card-title">Exercise today</p>
        <div className="fd-chip-row">
          <button className="fd-chip" onClick={() => addExercise("Walk", 30, 120)}>Walk · 30 min</button>
          <button className="fd-chip" onClick={() => addExercise("Gym session", 45, 300)}>Gym · 45 min</button>
          <button className="fd-chip" onClick={() => addExercise("Swim", 30, 250)}>Swim · 30 min</button>
          <button className="fd-chip" onClick={() => addExercise("Run", 25, 260)}>Run · 25 min</button>
        </div>
        <div className="fd-add-row" style={{ marginTop: 10 }}>
          <input className="fd-input" placeholder="Custom activity" value={exName} onChange={(e) => setExName(e.target.value)} />
          <input className="fd-input" type="number" placeholder="Minutes" value={exMin} onChange={(e) => setExMin(e.target.value)} style={{ maxWidth: 90 }} />
          <button className="fd-round-add" onClick={() => { if (exName.trim() && exMin) { addExercise(exName.trim(), Number(exMin), Math.round(Number(exMin) * 6)); setExName(""); setExMin(""); } }}><Plus size={18} /></button>
        </div>
        {member.todayExercise.length > 0 && (
          <ul className="fd-meal-list">
            {member.todayExercise.map((e) => (
              <li key={e.id}>
                <span>{e.type}</span>
                <span className="fd-meal-macros">{e.minutes} min · ~{e.kcal} kcal</span>
                <button className="fd-trash" onClick={() => removeExercise(e.id)}><Trash2 size={14} /></button>
              </li>
            ))}
          </ul>
        )}
      </JourneyCard>

      <JourneyCard>
        <p className="fd-chart-title"><Footprints size={15} color="#E0A73C" /> Steps this week</p>
        <div style={{ width: "100%", height: 150 }}>
          <ResponsiveContainer>
            <BarChart data={stepData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE6D6" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#93876F" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#93876F" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EDE6D6", fontSize: 12 }} />
              <Bar dataKey="steps" fill="#E0A73C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </JourneyCard>

      <JourneyCard>
        <p className="fd-chart-title"><Flame size={15} color="#2F6D4F" /> Calories this week</p>
        <div style={{ width: "100%", height: 150 }}>
          <ResponsiveContainer>
            <LineChart data={calData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE6D6" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#93876F" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#93876F" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EDE6D6", fontSize: 12 }} />
              <Line type="monotone" dataKey="cal" stroke="#2F6D4F" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </JourneyCard>

      <JourneyCard>
        <p className="fd-card-title"><Scale size={15} color="#6C5B9C" style={{ marginRight: 6, verticalAlign: "-3px" }} />Weight (private)</p>
        <div className="fd-add-row">
          <input className="fd-input" type="number" placeholder="Weight in kg" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} />
          <button className="fd-round-add" onClick={logWeight}><Plus size={18} /></button>
        </div>
        {member.weightLog.length > 0 && (
          <div style={{ width: "100%", height: 130, marginTop: 10 }}>
            <ResponsiveContainer>
              <LineChart data={member.weightLog} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE6D6" />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#93876F" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#93876F" }} axisLine={false} tickLine={false} width={36} domain={["dataMin - 2", "dataMax + 2"]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EDE6D6", fontSize: 12 }} />
                <Line type="monotone" dataKey="value" stroke="#6C5B9C" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <p className="fd-tiny-note">Visible only to {member.name} within your private home.</p>
      </JourneyCard>
    </div>
  );
}

/* -------------------------------- recipes -------------------------------- */

function RecipeCard({ recipe, onOpen }) {
  return (
    <button className="fd-recipe-card" onClick={() => onOpen(recipe)}>
      <div className="fd-recipe-card-top">
        <p className="fd-recipe-card-title">{recipe.title}</p>
        <span className="fd-recipe-time"><Clock size={12} /> {recipe.time}m</span>
      </div>
      <div className="fd-recipe-tags">
        {recipe.tags.slice(0, 3).map((t) => <span key={t} className="fd-tag">{t}</span>)}
      </div>
      <div className="fd-recipe-macros">
        <span>{recipe.calories} kcal</span><span>·</span><span>{recipe.protein}g protein</span>
      </div>
    </button>
  );
}

function RecipeDetailModal({ recipe, onClose, onAddToList }) {
  const [added, setAdded] = useState(false);
  return (
    <div className="fd-modal-backdrop" onClick={onClose}>
      <div className="fd-modal fd-modal-scroll" onClick={(e) => e.stopPropagation()}>
        <div className="fd-row-between">
          <p className="fd-recipe-title">{recipe.title}</p>
          <button className="fd-trash" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="fd-recipe-tags" style={{ marginBottom: 10 }}>
          {recipe.tags.map((t) => <span key={t} className="fd-tag">{t}</span>)}
        </div>
        <div className="fd-macro-row">
          <div className="fd-macro"><span className="fd-macro-val">{recipe.calories}</span><span className="fd-macro-label">kcal</span></div>
          <div className="fd-macro"><span className="fd-macro-val">{recipe.protein}g</span><span className="fd-macro-label">protein</span></div>
          <div className="fd-macro"><span className="fd-macro-val">{recipe.carbs}g</span><span className="fd-macro-label">carbs</span></div>
          <div className="fd-macro"><span className="fd-macro-val">{recipe.fat}g</span><span className="fd-macro-label">fat</span></div>
          <div className="fd-macro"><span className="fd-macro-val">{recipe.servings}</span><span className="fd-macro-label">servings</span></div>
        </div>
        <p className="fd-section-label" style={{ marginTop: 14 }}>Ingredients</p>
        <ul className="fd-ingredient-list">
          {recipe.ingredients.map((ing, i) => <li key={i}><span>{ing.name}</span><span className="fd-ing-amount">{ing.amount}</span></li>)}
        </ul>
        <p className="fd-section-label">Method</p>
        <ol className="fd-steps-list">{recipe.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        <BigButton icon={added ? Check : ShoppingCart} bg={added ? "#2F6D4F" : "#E0A73C"} onClick={() => { onAddToList(recipe.ingredients); setAdded(true); }}>
          {added ? "Added to shopping list" : "Add ingredients to shopping list"}
        </BigButton>
      </div>
    </div>
  );
}

function RecipesScreen({ onAddToList }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return RECIPE_LIBRARY.filter((r) => (filter === "All" || r.tags.includes(filter)) && r.title.toLowerCase().includes(search.toLowerCase())).slice(0, 60);
  }, [filter, search]);

  return (
    <div className="fd-screen">
      <JourneyCard>
        <p className="fd-card-title">Recipe library</p>
        <p className="fd-card-sub">{RECIPE_LIBRARY.length} healthy family recipes, free for everyone</p>
        <div className="fd-search-row">
          <Search size={16} color="#93876F" />
          <input className="fd-search-input" placeholder="Search recipes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="fd-chip-row" style={{ marginTop: 10 }}>
          {RECIPE_FILTERS.map((f) => (
            <button key={f} className={`fd-chip ${filter === f ? "fd-chip-active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </JourneyCard>

      <div className="fd-recipe-grid">
        {filtered.map((r) => <RecipeCard key={r.id} recipe={r} onOpen={setSelected} />)}
      </div>
      {filtered.length === 0 && <JourneyCard><p className="fd-empty-note">No recipes match — try a different search or filter.</p></JourneyCard>}

      {selected && <RecipeDetailModal recipe={selected} onClose={() => setSelected(null)} onAddToList={onAddToList} />}
    </div>
  );
}

/* ----------------------------- food creator ----------------------------- */

function PaywallCard({ onUnlock }) {
  return (
    <JourneyCard style={{ textAlign: "center", padding: "26px 20px" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <span className="fd-stamp" style={{ width: 52, height: 52 }}><Crown size={24} color="#8A5A16" strokeWidth={2.2} /></span>
      </div>
      <p className="fd-card-title" style={{ fontSize: 17, textAlign: "center" }}>Food Creator is a Premium feature</p>
      <p className="fd-card-sub" style={{ textAlign: "center", marginBottom: 14 }}>Ask for any meal in plain English and Foodie searches the web for a real, reliable recipe with a source link.</p>
      <ul className="fd-benefit-list">
        <li><Check size={14} color="#2F6D4F" /> Real recipes sourced from the web</li>
        <li><Check size={14} color="#2F6D4F" /> Full nutrition breakdown</li>
        <li><Check size={14} color="#2F6D4F" /> One-tap add to shopping list</li>
      </ul>
      <p className="fd-price">£10.95<span>/month</span></p>
      <BigButton icon={Crown} bg="#E0A73C" onClick={onUnlock}>Preview Premium (Demo)</BigButton>
      <p className="fd-tiny-note" style={{ textAlign: "center", marginTop: 10 }}>This preview unlocks Premium for this session only — no payment is taken.</p>
    </JourneyCard>
  );
}

function CreatorScreen({ isPremium, onUnlock, addIngredientsToList }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [added, setAdded] = useState(false);

  const suggestions = ["High-protein chicken pasta", "Quick vegetarian dinner", "High-calorie meal for muscle gain", "Healthy meal using salmon and rice"];

  async function generate(text) {
    const q = (text ?? prompt).trim();
    if (!q) return;
    setLoading(true); setError(null); setResult(null); setAdded(false);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          system:
            "You are Foodie's Food Creator, a feature inside a family health app. " +
            "Use web search to find one reliable, real, family-friendly recipe matching the user's request. " +
            "Write the ingredients and method in your own words rather than copying text verbatim from the source. " +
            "After searching, respond with your FINAL answer as ONLY a valid JSON object, no markdown fences, no preamble, no text before or after it, matching exactly this shape: " +
            '{"title": string, "source_name": string, "source_url": string, "servings": number, ' +
            '"calories": number or null, "protein_g": number or null, "carbs_g": number or null, "fat_g": number or null, ' +
            '"ingredients": [{"name": string, "amount": string, "category": one of "Produce"|"Protein"|"Dairy"|"Pantry"|"Frozen"|"Bakery"|"Other"}], ' +
            '"instructions": [string]}',
          messages: [{ role: "user", content: q }],
          tools: [{ type: "web_search_20250305", name: "web_search" }],
        }),
      });
      const data = await res.json();
      const textBlocks = (data.content || []).filter((b) => b.type === "text");
      const last = textBlocks[textBlocks.length - 1];
      if (!last) throw new Error("no text");
      let clean = last.text.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setError("Couldn't find a recipe just now — please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isPremium) {
    return (
      <div className="fd-screen">
        <PaywallCard onUnlock={onUnlock} />
        <JourneyCard>
          <p className="fd-card-title">Your Free plan includes</p>
          <ul className="fd-benefit-list">
            <li><Check size={14} color="#2F6D4F" /> Calorie &amp; protein tracking</li>
            <li><Check size={14} color="#2F6D4F" /> Exercise &amp; steps tracking</li>
            <li><Check size={14} color="#2F6D4F" /> Personal goals</li>
            <li><Check size={14} color="#2F6D4F" /> Family challenges</li>
            <li><Check size={14} color="#2F6D4F" /> Shared shopping list</li>
            <li><Check size={14} color="#2F6D4F" /> Full recipe library</li>
          </ul>
        </JourneyCard>
      </div>
    );
  }

  return (
    <div className="fd-screen">
      <JourneyCard>
        <p className="fd-card-title"><Sparkles size={16} color="#E0A73C" style={{ marginRight: 6, verticalAlign: "-3px" }} />Ask the Food Creator</p>
        <p className="fd-card-sub">Tell it what you're after — it searches the web for a real recipe.</p>
        <textarea className="fd-textarea" rows={3} placeholder='e.g. "High-protein chicken pasta"' value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <BigButton icon={loading ? Loader2 : Sparkles} bg="#E0A73C" onClick={() => generate()} style={loading ? { opacity: 0.85 } : {}}>
          {loading ? "Searching the web..." : "Find a recipe"}
        </BigButton>
        <div className="fd-chip-row" style={{ marginTop: 12 }}>
          {suggestions.map((s) => <button key={s} className="fd-chip" onClick={() => { setPrompt(s); generate(s); }}>{s}</button>)}
        </div>
      </JourneyCard>

      {error && <JourneyCard><p className="fd-card-sub">{error}</p></JourneyCard>}

      {result && (
        <JourneyCard>
          <p className="fd-recipe-title">{result.title}</p>
          {result.source_url && (
            <a className="fd-source-link" href={result.source_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={13} /> {result.source_name || "View original recipe"}
            </a>
          )}
          <div className="fd-macro-row" style={{ marginTop: 12 }}>
            <div className="fd-macro"><span className="fd-macro-val">{result.calories ?? "—"}</span><span className="fd-macro-label">kcal</span></div>
            <div className="fd-macro"><span className="fd-macro-val">{result.protein_g ?? "—"}</span><span className="fd-macro-label">protein</span></div>
            <div className="fd-macro"><span className="fd-macro-val">{result.carbs_g ?? "—"}</span><span className="fd-macro-label">carbs</span></div>
            <div className="fd-macro"><span className="fd-macro-val">{result.fat_g ?? "—"}</span><span className="fd-macro-label">fat</span></div>
            <div className="fd-macro"><span className="fd-macro-val">{result.servings ?? "—"}</span><span className="fd-macro-label">servings</span></div>
          </div>
          <p className="fd-section-label" style={{ marginTop: 14 }}>Ingredients</p>
          <ul className="fd-ingredient-list">
            {(result.ingredients || []).map((ing, i) => <li key={i}><span>{ing.name}</span><span className="fd-ing-amount">{ing.amount}</span></li>)}
          </ul>
          <p className="fd-section-label">Method</p>
          <ol className="fd-steps-list">{(result.instructions || []).map((s, i) => <li key={i}>{s}</li>)}</ol>
          <BigButton icon={added ? Check : ShoppingCart} bg={added ? "#2F6D4F" : "#E0A73C"} onClick={() => { addIngredientsToList(result.ingredients || []); setAdded(true); }}>
            {added ? "Added to shopping list" : "Add ingredients to shopping list"}
          </BigButton>
        </JourneyCard>
      )}
    </div>
  );
}

/* -------------------------------- shopping -------------------------------- */

function ShopScreen({ list, setList }) {
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
    <div className="fd-screen">
      <JourneyCard>
        <p className="fd-card-title">Shared shopping list</p>
        <p className="fd-card-sub">{doneCount} of {list.length} ticked off — shared with your whole home</p>
        <div className="fd-add-row">
          <input className="fd-input" placeholder="Add an item..." value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addItem()} />
          <select className="fd-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="fd-round-add" onClick={addItem}><Plus size={18} /></button>
        </div>
      </JourneyCard>

      {grouped.length === 0 && <JourneyCard><p className="fd-empty-note">Your list is empty — add something above, or generate one from a recipe.</p></JourneyCard>}

      {grouped.map((g) => (
        <JourneyCard key={g.cat}>
          <p className="fd-section-label">{g.cat}</p>
          <ul className="fd-shop-list">
            {g.items.map((it) => (
              <li key={it.id} className={it.checked ? "fd-shop-checked" : ""}>
                <button className={`fd-checkbox ${it.checked ? "fd-checkbox-on" : ""}`} onClick={() => toggle(it.id)}>{it.checked && <Check size={13} strokeWidth={3} color="#fff" />}</button>
                <div className="fd-shop-text"><span>{it.name}</span><span className="fd-shop-by">added by {it.addedBy}</span></div>
                <button className="fd-trash" onClick={() => remove(it.id)}><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
        </JourneyCard>
      ))}
    </div>
  );
}

/* -------------------------------- family -------------------------------- */

const GOAL_TYPES = [
  { id: "lose_weight", label: "Lose weight", unit: "kg" },
  { id: "build_muscle", label: "Build muscle", unit: "sessions/wk" },
  { id: "more_protein", label: "Eat more protein", unit: "g/day" },
  { id: "exercise_more", label: "Exercise more often", unit: "days/wk" },
  { id: "custom", label: "Something else", unit: "" },
];

function FamilyScreen({ homeName, members, addMember, activeId, setActiveId, member, updateMember, challenges, setChallenges, isPremium, onUnlock, onEndDemo }) {
  const [name, setName] = useState("");
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalType, setGoalType] = useState(GOAL_TYPES[0].id);
  const [goalLabel, setGoalLabel] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [chTitle, setChTitle] = useState("");
  const [chGoal, setChGoal] = useState("");
  const [chUnit, setChUnit] = useState("steps");

  function addNewMember() {
    if (!name.trim()) return;
    addMember(name.trim());
    setName("");
  }
  function addGoal() {
    const meta = GOAL_TYPES.find((g) => g.id === goalType);
    const goal = { id: uid(), label: goalType === "custom" ? (goalLabel || "My goal") : meta.label, target: Number(goalTarget) || 1, current: 0, unit: meta.unit };
    updateMember(member.id, { goals: [...member.goals, goal] });
    setShowGoalForm(false); setGoalTarget(""); setGoalLabel("");
  }
  function bumpGoal(id, delta) {
    updateMember(member.id, { goals: member.goals.map((g) => (g.id === id ? { ...g, current: Math.max(0, g.current + delta) } : g)) });
  }
  function removeGoal(id) { updateMember(member.id, { goals: member.goals.filter((g) => g.id !== id) }); }

  function addChallenge() {
    if (!chTitle.trim() || !chGoal) return;
    const contributions = {};
    members.forEach((m) => (contributions[m.id] = 0));
    setChallenges([{ id: uid(), title: chTitle.trim(), goal: Number(chGoal), unit: chUnit, contributions }, ...challenges]);
    setShowChallengeForm(false); setChTitle(""); setChGoal("");
  }
  function contribute(cid, mid, amount) {
    setChallenges(challenges.map((c) => (c.id === cid ? { ...c, contributions: { ...c.contributions, [mid]: (c.contributions[mid] || 0) + amount } } : c)));
  }

  return (
    <div className="fd-screen">
      <JourneyCard>
        <p className="fd-card-title">{homeName}</p>
        <p className="fd-card-sub">{isPremium ? "Premium home" : "Free plan"} {isPremium && <PremiumStamp small />}</p>
        <div className="fd-family-list" style={{ marginTop: 10 }}>
          {members.map((m) => (
            <div className="fd-family-row" key={m.id}>
              <span className="fd-dot" style={{ background: m.color }}>{m.initial}</span>
              <span className="fd-family-name">{m.name}</span>
              {m.id === activeId && <span className="fd-tag" style={{ marginLeft: "auto" }}>Viewing</span>}
              {m.id !== activeId && <button className="fd-pill-btn" style={{ background: "#EDE6D6", color: "#1F2A24", flex: "none" }} onClick={() => setActiveId(m.id)}>Switch</button>}
            </div>
          ))}
        </div>
        <div className="fd-add-row" style={{ marginTop: 10 }}>
          <input className="fd-input" placeholder="Add a family member" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addNewMember()} />
          <button className="fd-round-add" onClick={addNewMember}><Plus size={18} /></button>
        </div>
      </JourneyCard>

      {isPremium ? (
        <JourneyCard>
          <div className="fd-row-between">
            <div>
              <p className="fd-card-title">Premium <PremiumStamp small /></p>
              <p className="fd-card-sub">£10.95/month · Food Creator unlocked</p>
            </div>
            <button className="fd-pill-btn" style={{ background: "#EDE6D6", color: "#1F2A24", flex: "none" }} onClick={onEndDemo}>End demo</button>
          </div>
        </JourneyCard>
      ) : (
        <JourneyCard>
          <div className="fd-row-between">
            <div>
              <p className="fd-card-title">Upgrade to Premium</p>
              <p className="fd-card-sub">£10.95/month — unlock the AI Food Creator</p>
            </div>
            <button className="fd-pill-btn" style={{ background: "#E0A73C", flex: "none" }} onClick={onUnlock}>Preview</button>
          </div>
        </JourneyCard>
      )}

      <p className="fd-section-label">{member.name}'s goals</p>
      {member.goals.map((g) => {
        const pct = g.target > 0 ? g.current / g.target : 0;
        const reached = pct >= 1;
        return (
          <JourneyCard key={g.id}>
            <div className="fd-row-between">
              <p className="fd-card-title">{g.label} {reached && <PartyPopper size={15} color="#E0A73C" style={{ marginLeft: 4, verticalAlign: "-2px" }} />}</p>
              <button className="fd-trash" onClick={() => removeGoal(g.id)}><Trash2 size={16} /></button>
            </div>
            <p className="fd-card-sub">{g.current} / {g.target} {g.unit}</p>
            <ProgressBar pct={pct} color={reached ? "#2F6D4F" : "#C1543A"} />
            <div className="fd-goal-actions">
              <button className="fd-pill-btn" style={{ background: "#EDE6D6", color: "#1F2A24" }} onClick={() => bumpGoal(g.id, -1)}>-1</button>
              <button className="fd-pill-btn" style={{ background: member.color }} onClick={() => bumpGoal(g.id, 1)}>+1</button>
            </div>
          </JourneyCard>
        );
      })}
      {showGoalForm ? (
        <JourneyCard>
          <select className="fd-select fd-select-full" value={goalType} onChange={(e) => setGoalType(e.target.value)}>
            {GOAL_TYPES.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
          </select>
          {goalType === "custom" && <input className="fd-input fd-input-full" placeholder="Name your goal" value={goalLabel} onChange={(e) => setGoalLabel(e.target.value)} />}
          <input className="fd-input fd-input-full" type="number" placeholder="Target number" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} />
          <div className="fd-goal-actions">
            <button className="fd-pill-btn" style={{ background: "#EDE6D6", color: "#1F2A24" }} onClick={() => setShowGoalForm(false)}>Cancel</button>
            <button className="fd-pill-btn" style={{ background: "#3B7EA1" }} onClick={addGoal}>Save goal</button>
          </div>
        </JourneyCard>
      ) : (
        <BigButton icon={Target} bg="#3B7EA1" onClick={() => setShowGoalForm(true)}>Add a goal for {member.name}</BigButton>
      )}

      <p className="fd-section-label">Family challenges</p>
      {challenges.map((c) => {
        const total = Object.values(c.contributions).reduce((a, b) => a + b, 0);
        const pct = total / c.goal;
        const reached = pct >= 1;
        return (
          <JourneyCard key={c.id}>
            <p className="fd-card-title">{c.title} {reached && "🎉"}</p>
            <p className="fd-card-sub">{total.toLocaleString()} / {c.goal.toLocaleString()} {c.unit}</p>
            <ProgressBar pct={pct} color={reached ? "#2F6D4F" : "#6C5B9C"} />
            <div className="fd-contrib-list">
              {members.map((m) => (
                <div key={m.id} className="fd-contrib-row">
                  <span className="fd-dot" style={{ background: m.color }}>{m.initial}</span>
                  <span className="fd-family-name">{m.name}</span>
                  <span className="fd-contrib-amount">{(c.contributions[m.id] || 0).toLocaleString()}</span>
                  <button className="fd-mini-plus" style={{ background: m.color }} onClick={() => contribute(c.id, m.id, c.unit === "dinners" ? 1 : 500)}>+</button>
                </div>
              ))}
            </div>
          </JourneyCard>
        );
      })}
      {showChallengeForm ? (
        <JourneyCard>
          <input className="fd-input fd-input-full" placeholder='e.g. "Walk 50,000 steps this week"' value={chTitle} onChange={(e) => setChTitle(e.target.value)} />
          <div className="fd-add-row">
            <input className="fd-input" type="number" placeholder="Goal amount" value={chGoal} onChange={(e) => setChGoal(e.target.value)} />
            <select className="fd-select" value={chUnit} onChange={(e) => setChUnit(e.target.value)}>
              <option value="steps">steps</option><option value="dinners">dinners</option><option value="glasses">glasses of water</option><option value="workouts">workouts</option>
            </select>
          </div>
          <div className="fd-goal-actions">
            <button className="fd-pill-btn" style={{ background: "#EDE6D6", color: "#1F2A24" }} onClick={() => setShowChallengeForm(false)}>Cancel</button>
            <button className="fd-pill-btn" style={{ background: "#3B7EA1" }} onClick={addChallenge}>Start challenge</button>
          </div>
        </JourneyCard>
      ) : (
        <BigButton icon={Trophy} bg="#3B7EA1" onClick={() => setShowChallengeForm(true)}>Start a family challenge</BigButton>
      )}
    </div>
  );
}

/* ---------------------------------- app ---------------------------------- */

function seedMember(name, color, i) {
  return {
    id: uid(), name, initial: name[0].toUpperCase(), color,
    calorieGoal: 2000, proteinGoal: 120, waterGoal: 8, stepGoal: 9000,
    todayCalories: 900 + i * 120, todayProtein: 40 + i * 8, todayWater: 3 + i, todaySteps: 3200 + i * 900,
    todayMeals: [], todayExercise: [],
    weeklySteps: [7200, 8100, 6400, 9200, 7800, 10500, 5400].map((v) => v + i * 300),
    weeklyCalories: [1850, 1920, 1780, 2010, 1890, 2150, 1700].map((v) => v + i * 50),
    weightLog: [], goals: [],
  };
}

export default function FoodieApp() {
  const [view, setView] = useState("splash");
  const [exiting, setExiting] = useState(false);
  const [homeName, setHomeName] = useState("");
  const [members, setMembers] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [screen, setScreen] = useState("home");
  const [shoppingList, setShoppingList] = useState([]);
  const [challenges, setChallenges] = useState([
    { id: uid(), title: "Walk 50,000 steps this week", goal: 50000, unit: "steps", contributions: {} },
    { id: uid(), title: "Eat five healthy dinners", goal: 5, unit: "dinners", contributions: {} },
  ]);
  const [isPremium, setIsPremium] = useState(false);

  function handleEnter() {
    setExiting(true);
    setTimeout(() => setView("onboarding"), 620);
  }
  function handleOnboardComplete(hName, onboardMembers) {
    const seeded = onboardMembers.map((m, i) => seedMember(m.name, m.color, i));
    setHomeName(hName);
    setMembers(seeded);
    setActiveId(seeded[0].id);
    const contributions = {};
    seeded.forEach((m) => (contributions[m.id] = 0));
    setChallenges((prev) => prev.map((c) => ({ ...c, contributions })));
    setView("app");
  }
  function updateMember(id, patch) { setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m))); }
  function addFamilyMember(name) {
    const color = MEMBER_COLORS[members.length % MEMBER_COLORS.length];
    const newMember = seedMember(name, color, members.length);
    newMember.todayCalories = 0; newMember.todayProtein = 0; newMember.todayWater = 0; newMember.todaySteps = 0;
    newMember.weeklySteps = [0, 0, 0, 0, 0, 0, 0]; newMember.weeklyCalories = [0, 0, 0, 0, 0, 0, 0];
    setMembers((prev) => [...prev, newMember]);
    setChallenges((prev) => prev.map((c) => ({ ...c, contributions: { ...c.contributions, [newMember.id]: 0 } })));
  }
  function addIngredientsToList(ingredients) {
    const items = (ingredients || []).map((ing) => ({ id: uid(), name: ing.name, category: CATEGORIES.includes(ing.category) ? ing.category : "Other", checked: false, addedBy: "Recipe" }));
    setShoppingList((prev) => [...items, ...prev]);
  }
  function bumpWater() { updateMember(activeId, { todayWater: (member?.todayWater || 0) + 1 }); }
  function bumpSteps() { updateMember(activeId, { todaySteps: (member?.todaySteps || 0) + 1000 }); }

  const member = members.find((m) => m.id === activeId);

  const titles = { home: "Home", track: "Track", recipes: "Recipes", creator: "Food Creator", shop: "Shopping List", family: "Family" };

  return (
    <div className="fd-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

        .fd-app {
          --cream: #FBF6EE; --paper: #FFFFFF; --ink: #1F2A24; --ink-soft: #8B8272;
          --green: #2F6D4F; --gold: #E0A73C; --sky: #3B7EA1; --coral: #C1543A; --violet: #6C5B9C;
          font-family: 'Inter', sans-serif; background: var(--cream); color: var(--ink);
          max-width: 460px; margin: 0 auto; border-radius: 28px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(31,42,36,0.14); position: relative; height: 780px;
          display: flex; flex-direction: column;
        }

        .fd-splash {
          position: absolute; inset: 0; z-index: 30; display: flex; align-items: center; justify-content: center;
          background: linear-gradient(160deg, #1F2A24 0%, #2F6D4F 60%, #3F8F6B 100%);
          transition: opacity .6s ease, transform .6s ease;
        }
        .fd-splash-exit { opacity: 0; transform: scale(1.15); }
        .fd-splash-inner { text-align: center; padding: 0 30px; }
        .fd-splash-logo { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 64px; color: #fff; letter-spacing: .02em; margin: 0; line-height: 1; }
        .fd-splash-sub { font-family: 'Rajdhani', sans-serif; font-weight: 500; font-size: 17px; color: #E0EAE2; letter-spacing: .08em; text-transform: uppercase; margin: 10px 0 34px; }
        .fd-enter-btn {
          font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 17px; letter-spacing: .04em;
          background: #E0A73C; color: #1F2A24; border: none; padding: 14px 34px; border-radius: 30px;
          display: inline-flex; align-items: center; gap: 8px; cursor: pointer; box-shadow: 0 6px 20px rgba(224,167,60,0.4);
        }

        .fd-onboard { padding: 40px 26px; height: 100%; overflow-y: auto; box-sizing: border-box; }
        .fd-onboard-head { margin-bottom: 22px; }
        .fd-onboard-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 26px; margin: 4px 0 6px; }
        .fd-onboard-sub { font-size: 13.5px; color: var(--ink-soft); margin: 0; }
        .fd-onboard-body { display: flex; flex-direction: column; gap: 12px; }
        .fd-onboard-members { display: flex; flex-direction: column; gap: 8px; margin: 4px 0 6px; }
        .fd-onboard-member { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid #EDE6D6; border-radius: 14px; padding: 9px 12px; }
        .fd-onboard-member span:nth-child(2) { flex: 1; font-weight: 600; font-size: 13.5px; }

        .fd-eyebrow { font-size: 11.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--gold); margin: 0 0 2px; }
        .fd-header { background: var(--paper); padding: 18px 20px 14px; border-bottom: 1px solid #EDE6D6; flex-shrink: 0; }
        .fd-header-top { display: flex; align-items: flex-start; justify-content: space-between; }
        .fd-title { font-family: 'Rajdhani', sans-serif; font-size: 25px; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 6px; }
        .fd-logo { width: 38px; height: 38px; border-radius: 13px; background: var(--ink); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .fd-avatars { display: flex; gap: 8px; margin-top: 14px; }
        .fd-avatar { width: 40px; height: 40px; border-radius: 50%; border: 2.5px solid transparent; background: var(--avatar-color); color: #fff; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; }
        .fd-avatar-active { border-color: var(--ink); transform: scale(1.08); }

        .fd-nav { display: flex; background: var(--paper); border-top: 1px solid #EDE6D6; padding: 7px 2px calc(7px + env(safe-area-inset-bottom, 0px)); flex-shrink: 0; }
        .fd-nav-btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; background: none; border: none; padding: 6px 1px; color: var(--ink-soft); cursor: pointer; border-radius: 12px; }
        .fd-nav-btn span { font-size: 9.5px; font-weight: 600; }
        .fd-nav-btn-active { color: var(--green); }

        .fd-screen { padding: 16px 18px 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 13px; }

        .fd-card { position: relative; background: var(--paper); border-radius: 20px; padding: 17px; border: 1px solid #EDE6D6; box-shadow: 0 2px 0 #EDE6D6; }
        .fd-trail { position: absolute; top: -5px; left: 20px; width: 26px; height: 4px; border-radius: 4px; background: repeating-linear-gradient(90deg, var(--gold) 0 6px, transparent 6px 10px); }
        .fd-hero { background: linear-gradient(135deg, var(--green), #3F8F6B); border: none; color: #fff; }
        .fd-hero-greet { font-family: 'Rajdhani', sans-serif; font-size: 19px; font-weight: 700; margin: 4px 0 4px; }
        .fd-hero-msg { font-size: 13.5px; opacity: .95; margin: 0; }

        .fd-ring-row { display: flex; gap: 8px; }
        .fd-ring-card { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 13px 5px; }
        .fd-ring-val { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 15px; margin: 6px 0 0; }
        .fd-ring-label { font-size: 9px; color: var(--ink-soft); margin: 0; text-align: center; }
        .fd-mini-add { margin-top: 7px; border: none; color: #fff; font-size: 9.5px; font-weight: 700; padding: 5px 8px; border-radius: 20px; cursor: pointer; }

        .fd-row-between { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .fd-row-icon-text { display: flex; align-items: center; gap: 12px; }
        .fd-icon-badge { width: 38px; height: 38px; border-radius: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .fd-card-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 16px; margin: 0 0 2px; display: flex; align-items: center; gap: 5px; }
        .fd-card-sub { font-size: 12.5px; color: var(--ink-soft); margin: 0; }

        .fd-section-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--ink-soft); margin: 0 0 8px; }
        .fd-family-list { display: flex; flex-direction: column; gap: 10px; }
        .fd-family-row { display: flex; align-items: center; gap: 10px; }
        .fd-dot { width: 27px; height: 27px; border-radius: 50%; color: #fff; font-family: 'Rajdhani', sans-serif; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .fd-family-name { font-weight: 600; font-size: 13px; flex: 1; }
        .fd-family-steps, .fd-family-cal { font-size: 11.5px; color: var(--ink-soft); display: flex; align-items: center; gap: 4px; }

        .fd-stamp { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: radial-gradient(circle, #FCEFC9, #F2D385); border: 2px dotted #C99A3E; flex-shrink: 0; }
        .fd-price { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 30px; margin: 10px 0 14px; }
        .fd-price span { font-size: 14px; font-weight: 500; color: var(--ink-soft); }
        .fd-benefit-list { list-style: none; padding: 0; margin: 10px 0 4px; display: flex; flex-direction: column; gap: 8px; text-align: left; }
        .fd-benefit-list li { display: flex; align-items: center; gap: 8px; font-size: 13px; }

        .fd-chart-title { display: flex; align-items: center; gap: 6px; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 14.5px; margin: 0 0 4px; }
        .fd-tiny-note { font-size: 11px; color: var(--ink-soft); margin: 6px 0 0; }
        .fd-empty-note { font-size: 13px; color: var(--ink-soft); margin: 0; }

        .fd-bigbtn { width: 100%; border: none; color: #fff; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 15.5px; letter-spacing: .02em; padding: 14px 18px; border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; box-shadow: 0 3px 0 rgba(0,0,0,0.12); }
        .fd-bigbtn:active { transform: translateY(2px); box-shadow: none; }
        .fd-bigbtn:disabled { opacity: .5; cursor: not-allowed; }

        .fd-textarea { width: 100%; border: 1.5px solid #EDE6D6; border-radius: 14px; padding: 11px 13px; font-family: 'Inter', sans-serif; font-size: 13.5px; resize: none; margin: 10px 0 12px; box-sizing: border-box; color: var(--ink); }
        .fd-textarea:focus { outline: none; border-color: var(--sky); }
        .fd-chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
        .fd-chip { background: #EFE9DA; border: none; border-radius: 20px; padding: 7px 12px; font-size: 11px; color: var(--ink); cursor: pointer; font-weight: 500; }
        .fd-chip-active { background: var(--green); color: #fff; }

        .fd-recipe-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 19px; margin: 0 0 4px; }
        .fd-source-link { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: var(--sky); text-decoration: none; font-weight: 600; }
        .fd-macro-row { display: flex; justify-content: space-between; margin: 12px 0 4px; background: var(--cream); border-radius: 14px; padding: 10px 5px; }
        .fd-macro { display: flex; flex-direction: column; align-items: center; }
        .fd-macro-val { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 14px; }
        .fd-macro-label { font-size: 9px; color: var(--ink-soft); }
        .fd-ingredient-list { list-style: none; margin: 0 0 10px; padding: 0; display: flex; flex-direction: column; gap: 7px; }
        .fd-ingredient-list li { display: flex; justify-content: space-between; font-size: 13px; border-bottom: 1px dashed #EDE6D6; padding-bottom: 6px; }
        .fd-ing-amount { color: var(--ink-soft); }
        .fd-steps-list { margin: 0 0 14px; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; font-size: 13px; }

        .fd-add-row { display: flex; gap: 8px; margin-top: 8px; }
        .fd-input { flex: 1; min-width: 0; border: 1.5px solid #EDE6D6; border-radius: 13px; padding: 10px 12px; font-size: 13px; font-family: 'Inter', sans-serif; color: var(--ink); }
        .fd-input:focus { outline: none; border-color: var(--sky); }
        .fd-input-full { width: 100%; box-sizing: border-box; margin: 8px 0; }
        .fd-input-lg { padding: 14px 16px; font-size: 15px; border-radius: 16px; }
        .fd-select { border: 1.5px solid #EDE6D6; border-radius: 13px; padding: 10px 6px; font-size: 12px; font-family: 'Inter', sans-serif; color: var(--ink); background: #fff; }
        .fd-select-full { width: 100%; box-sizing: border-box; margin: 8px 0; }
        .fd-round-add { width: 40px; height: 40px; border-radius: 13px; border: none; background: var(--green); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }

        .fd-search-row { display: flex; align-items: center; gap: 8px; border: 1.5px solid #EDE6D6; border-radius: 14px; padding: 9px 13px; margin-top: 10px; }
        .fd-search-input { border: none; outline: none; flex: 1; font-size: 13px; font-family: 'Inter', sans-serif; background: transparent; }
        .fd-recipe-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .fd-recipe-card { text-align: left; background: #fff; border: 1px solid #EDE6D6; border-radius: 16px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 6px; }
        .fd-recipe-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 6px; }
        .fd-recipe-card-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 13.5px; margin: 0; line-height: 1.15; }
        .fd-recipe-time { font-size: 10px; color: var(--ink-soft); display: flex; align-items: center; gap: 3px; flex-shrink: 0; }
        .fd-recipe-tags { display: flex; flex-wrap: wrap; gap: 4px; }
        .fd-tag { background: var(--cream); color: var(--green); font-size: 9px; font-weight: 700; padding: 3px 7px; border-radius: 10px; }
        .fd-recipe-macros { font-size: 10.5px; color: var(--ink-soft); display: flex; gap: 5px; }

        .fd-meal-list { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .fd-meal-list li { display: flex; align-items: center; gap: 8px; font-size: 12.5px; border-bottom: 1px dashed #EDE6D6; padding-bottom: 6px; }
        .fd-meal-list li span:first-child { flex: 1; font-weight: 500; }
        .fd-meal-macros { color: var(--ink-soft); font-size: 11px; }

        .fd-shop-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .fd-shop-list li { display: flex; align-items: center; gap: 10px; }
        .fd-shop-checked .fd-shop-text span:first-child { text-decoration: line-through; color: #B8AD97; }
        .fd-checkbox { width: 23px; height: 23px; border-radius: 7px; border: 2px solid #D9CFB8; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; padding: 0; }
        .fd-checkbox-on { background: var(--green); border-color: var(--green); }
        .fd-shop-text { flex: 1; display: flex; flex-direction: column; }
        .fd-shop-text span:first-child { font-size: 13.5px; font-weight: 500; }
        .fd-shop-by { font-size: 10.5px; color: var(--ink-soft); }
        .fd-trash { background: none; border: none; color: #C9BF9F; cursor: pointer; padding: 4px; display: flex; flex-shrink: 0; }

        .fd-goal-actions { display: flex; gap: 8px; margin-top: 11px; }
        .fd-pill-btn { border: none; border-radius: 13px; padding: 9px 14px; font-size: 12px; font-weight: 700; color: #fff; cursor: pointer; flex: 1; }
        .fd-progress-track { width: 100%; height: 10px; background: #EDE6D6; border-radius: 20px; margin: 9px 0 2px; overflow: hidden; }
        .fd-progress-fill { height: 100%; border-radius: 20px; transition: width .5s ease; }
        .fd-contrib-list { display: flex; flex-direction: column; gap: 9px; margin-top: 13px; }
        .fd-contrib-row { display: flex; align-items: center; gap: 10px; }
        .fd-contrib-amount { font-size: 11.5px; color: var(--ink-soft); font-weight: 600; }
        .fd-mini-plus { width: 25px; height: 25px; border-radius: 50%; border: none; color: #fff; font-weight: 700; font-size: 14px; cursor: pointer; flex-shrink: 0; }

        .fd-modal-backdrop { position: absolute; inset: 0; background: rgba(31,42,36,0.5); display: flex; align-items: flex-end; z-index: 20; }
        .fd-modal { background: #fff; width: 100%; border-radius: 22px 22px 0 0; padding: 22px; box-sizing: border-box; }
        .fd-modal-scroll { max-height: 88%; overflow-y: auto; }

        .fd-app *::-webkit-scrollbar { width: 6px; }
        .fd-app *::-webkit-scrollbar-thumb { background: #E2D9C2; border-radius: 10px; }
      `}</style>

      {view === "splash" && <SplashScreen onEnter={handleEnter} exiting={exiting} />}
      {view === "onboarding" && <Onboarding onComplete={handleOnboardComplete} />}

      {view === "app" && member && (
        <>
          <Header homeName={homeName} members={members} activeId={activeId} setActiveId={setActiveId} screenTitle={titles[screen]} isPremium={isPremium} />
          {screen === "home" && <HomeScreen member={member} members={members} setScreen={setScreen} bumpWater={bumpWater} bumpSteps={bumpSteps} />}
          {screen === "track" && <TrackScreen member={member} updateMember={updateMember} />}
          {screen === "recipes" && <RecipesScreen onAddToList={addIngredientsToList} />}
          {screen === "creator" && <CreatorScreen isPremium={isPremium} onUnlock={() => setIsPremium(true)} addIngredientsToList={addIngredientsToList} />}
          {screen === "shop" && <ShopScreen list={shoppingList} setList={setShoppingList} />}
          {screen === "family" && (
            <FamilyScreen
              homeName={homeName} members={members} addMember={addFamilyMember}
              activeId={activeId} setActiveId={setActiveId} member={member} updateMember={updateMember}
              challenges={challenges} setChallenges={setChallenges}
              isPremium={isPremium} onUnlock={() => setIsPremium(true)} onEndDemo={() => setIsPremium(false)}
            />
          )}
          <BottomNav screen={screen} setScreen={setScreen} isPremium={isPremium} />
        </>
      )}
    </div>
  );
}
