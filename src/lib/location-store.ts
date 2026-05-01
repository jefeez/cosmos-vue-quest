import { useSyncExternalStore } from "react";

export type LocationKind = "planet" | "moon";

export interface PlanetLoc {
  id: string;
  name: string;
  coords: string;
  hasMoon: boolean;
  moonName?: string;
  moonDiameter?: number;
}

export const planetList: PlanetLoc[] = [
  { id: "p1", name: "Aetheria Prime", coords: "[1:147:8]", hasMoon: true, moonName: "Selene", moonDiameter: 8420 },
  { id: "p2", name: "Vexor", coords: "[1:147:6]", hasMoon: false },
  { id: "p3", name: "Krios", coords: "[2:241:11]", hasMoon: true, moonName: "Nyxos", moonDiameter: 6210 },
];

interface State {
  planetId: string;
  kind: LocationKind;
}

let state: State = { planetId: planetList[0].id, kind: "planet" };
const listeners = new Set<() => void>();

export const locationStore = {
  get: () => state,
  setPlanet(id: string) {
    state = { planetId: id, kind: "planet" };
    listeners.forEach((l) => l());
  },
  setKind(kind: LocationKind) {
    state = { ...state, kind };
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useLocation() {
  const s = useSyncExternalStore(locationStore.subscribe, locationStore.get, locationStore.get);
  const planet = planetList.find((p) => p.id === s.planetId)!;
  return { ...s, planet };
}
