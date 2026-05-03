export type CardTheme = "amber" | "crystal" | "deuterium" | "energy" | "destructive" | "metal";

export const themeMap: Record<CardTheme, {
  ring: string;        // gradient classes for top accent + glow orb
  dot: string;         // solid bg for icon disc / progress
  text: string;        // text accent
  glow: string;        // shadow color
  border: string;      // hover border
  iconBg: string;      // soft fill behind icon
  cssVar: string;      // raw css var for inline (cost pills etc.)
}> = {
  amber:       { ring: "from-primary/40 to-primary/0",         dot: "bg-primary",     text: "text-primary",     glow: "shadow-primary/30",     border: "hover:border-primary/40",     iconBg: "from-primary/15 to-transparent",     cssVar: "--primary" },
  crystal:     { ring: "from-crystal/40 to-crystal/0",         dot: "bg-crystal",     text: "text-crystal",     glow: "shadow-crystal/30",     border: "hover:border-crystal/40",     iconBg: "from-crystal/15 to-transparent",     cssVar: "--crystal" },
  deuterium:   { ring: "from-deuterium/40 to-deuterium/0",     dot: "bg-deuterium",   text: "text-deuterium",   glow: "shadow-deuterium/30",   border: "hover:border-deuterium/40",   iconBg: "from-deuterium/15 to-transparent",   cssVar: "--deuterium" },
  energy:      { ring: "from-energy/40 to-energy/0",           dot: "bg-energy",      text: "text-energy",      glow: "shadow-energy/30",      border: "hover:border-energy/40",      iconBg: "from-energy/15 to-transparent",      cssVar: "--energy" },
  destructive: { ring: "from-destructive/40 to-destructive/0", dot: "bg-destructive", text: "text-destructive", glow: "shadow-destructive/30", border: "hover:border-destructive/40", iconBg: "from-destructive/15 to-transparent", cssVar: "--destructive" },
  metal:       { ring: "from-metal/40 to-metal/0",             dot: "bg-metal",       text: "text-metal",       glow: "shadow-metal/30",       border: "hover:border-metal/40",       iconBg: "from-metal/15 to-transparent",       cssVar: "--metal" },
};

// Per-item theme assignments (by item id)
const ITEM_THEMES: Record<string, CardTheme> = {
  // Buildings
  "metal-mine": "metal",
  "crystal-mine": "crystal",
  "deut-synth": "deuterium",
  "solar-plant": "energy",
  "fusion-reactor": "destructive",
  "metal-storage": "amber",
  // Facilities
  "robot-factory": "amber",
  "shipyard-fac": "crystal",
  "research-lab": "deuterium",
  "nanite": "energy",
  "missile-silo": "destructive",
  "terraformer": "metal",
  // Research
  "energy-tech": "energy",
  "laser-tech": "destructive",
  "ion-tech": "crystal",
  "hyperspace": "deuterium",
  "combustion": "amber",
  "shielding": "crystal",
  // Ships
  "light-fighter": "amber",
  "heavy-fighter": "metal",
  "cruiser": "crystal",
  "battleship": "destructive",
  "bomber": "destructive",
  "recycler": "deuterium",
  // Defenses
  "rocket-launcher": "amber",
  "light-laser": "energy",
  "heavy-laser": "destructive",
  "gauss": "metal",
  "plasma": "crystal",
  "shield-dome": "deuterium",
};

export function themeFor(itemId: string): CardTheme {
  return ITEM_THEMES[itemId] ?? "amber";
}
