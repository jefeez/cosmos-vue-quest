export interface Universe {
  id: string;
  name: string;
  speed: number; // economy speed multiplier
  fleetSpeed: number;
  players: number;
  maxPlayers: number;
  age: string; // e.g. "47 dias"
  pvp: "PvP" | "Pacífico" | "Híbrido";
  galaxies: number;
  language: string;
  theme: "amber" | "crystal" | "deuterium" | "energy" | "destructive";
  tag?: string; // e.g. "Novo", "Quente"
  description: string;
}

export const UNIVERSES: Universe[] = [
  {
    id: "u-orion",
    name: "Orion",
    speed: 1,
    fleetSpeed: 1,
    players: 9412,
    maxPlayers: 12000,
    age: "847 dias",
    pvp: "PvP",
    galaxies: 9,
    language: "PT-BR",
    theme: "amber",
    description: "Universo clássico. Economia equilibrada e PvP aberto desde o começo.",
  },
  {
    id: "u-vega",
    name: "Vega",
    speed: 3,
    fleetSpeed: 4,
    players: 6203,
    maxPlayers: 8000,
    age: "212 dias",
    pvp: "PvP",
    galaxies: 7,
    language: "PT-BR",
    theme: "crystal",
    tag: "Quente",
    description: "Velocidade x3, frotas x4. Para quem quer guerra rápida e progressão acelerada.",
  },
  {
    id: "u-nebulon",
    name: "Nebulon",
    speed: 2,
    fleetSpeed: 2,
    players: 1840,
    maxPlayers: 6000,
    age: "12 dias",
    pvp: "Híbrido",
    galaxies: 6,
    language: "PT-BR",
    theme: "deuterium",
    tag: "Novo",
    description: "Universo recém-aberto. Coordenadas centrais ainda disponíveis.",
  },
  {
    id: "u-helios",
    name: "Helios",
    speed: 1,
    fleetSpeed: 1,
    players: 4120,
    maxPlayers: 5000,
    age: "1.420 dias",
    pvp: "Pacífico",
    galaxies: 5,
    language: "PT-BR",
    theme: "energy",
    description: "Servidor veterano, focado em economia e diplomacia. Combate por consentimento.",
  },
  {
    id: "u-pyra",
    name: "Pyra",
    speed: 5,
    fleetSpeed: 6,
    players: 2987,
    maxPlayers: 4000,
    age: "63 dias",
    pvp: "PvP",
    galaxies: 5,
    language: "EN",
    theme: "destructive",
    tag: "Brutal",
    description: "Sem proteção a inativos. Reciclagem 100%. Não recomendado para iniciantes.",
  },
  {
    id: "u-andromeda",
    name: "Andrômeda",
    speed: 2,
    fleetSpeed: 3,
    players: 5210,
    maxPlayers: 9000,
    age: "390 dias",
    pvp: "PvP",
    galaxies: 8,
    language: "PT-BR",
    theme: "crystal",
    description: "Equilíbrio entre veteranos e novatos. Alianças fortes e mercado ativo.",
  },
];

// Mock — universos que o jogador já participa
export const JOINED_UNIVERSE_IDS = new Set<string>(["u-orion", "u-nebulon"]);

export const universeProgress: Record<string, { rank: number; points: string; planets: number }> = {
  "u-orion": { rank: 247, points: "1.24M", planets: 4 },
  "u-nebulon": { rank: 1820, points: "12.4k", planets: 1 },
};
