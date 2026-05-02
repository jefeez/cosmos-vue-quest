import { Plane, Rocket, Bomb, Satellite, Eye, Truck, Compass } from "lucide-react";

export interface FleetShipDef {
  id: string;
  name: string;
  available: number;
  capacity: number; // cargo
  speed: number;
  consumption: number; // deut per 1k distance
  icon: typeof Plane;
}

export const fleetShips: FleetShipDef[] = [
  { id: "light-fighter", name: "Caça Leve", available: 248, capacity: 50, speed: 12500, consumption: 20, icon: Plane },
  { id: "heavy-fighter", name: "Caça Pesado", available: 86, capacity: 100, speed: 10000, consumption: 75, icon: Plane },
  { id: "cruiser", name: "Cruzador", available: 42, capacity: 800, speed: 15000, consumption: 300, icon: Rocket },
  { id: "battleship", name: "Nave de Batalha", available: 18, capacity: 1500, speed: 10000, consumption: 500, icon: Rocket },
  { id: "bomber", name: "Bombardeiro", available: 6, capacity: 500, speed: 4000, consumption: 1000, icon: Bomb },
  { id: "recycler", name: "Reciclador", available: 12, capacity: 20000, speed: 2000, consumption: 300, icon: Satellite },
  { id: "espionage-probe", name: "Sonda", available: 24, capacity: 5, speed: 100000000, consumption: 1, icon: Eye },
  { id: "small-cargo", name: "Cargueiro Pequeno", available: 60, capacity: 5000, speed: 5000, consumption: 10, icon: Truck },
  { id: "large-cargo", name: "Cargueiro Grande", available: 32, capacity: 25000, speed: 7500, consumption: 50, icon: Truck },
  { id: "colony-ship", name: "Nave Colonizadora", available: 1, capacity: 7500, speed: 2500, consumption: 1000, icon: Compass },
];

export const missionTypes = [
  "Ataque",
  "Transporte",
  "Espionagem",
  "Colonizar",
  "Reciclar",
  "Estacionar",
  "Expedição",
  "Destruir",
] as const;
