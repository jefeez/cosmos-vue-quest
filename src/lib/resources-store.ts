import { useSyncExternalStore } from "react";
import { initialResources, productionPerHour, type Resources } from "./game-data";

export const capacity = {
  metal: 850_000,
  crystal: 600_000,
  deuterium: 400_000,
};

export const energy = {
  produced: 8_240,
  consumed: 5_870,
};

let state: Resources = { ...initialResources };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

setInterval(() => {
  state = {
    metal: Math.min(capacity.metal, state.metal + productionPerHour.metal / 3600),
    crystal: Math.min(capacity.crystal, state.crystal + productionPerHour.crystal / 3600),
    deuterium: Math.min(capacity.deuterium, state.deuterium + productionPerHour.deuterium / 3600),
    energy: energy.produced - energy.consumed,
  };
  emit();
}, 1000);

export const resourcesStore = {
  get: () => state,
  subscribe: (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; },
  spend(cost: { metal?: number; crystal?: number; deuterium?: number }) {
    state = {
      ...state,
      metal: Math.max(0, state.metal - (cost.metal ?? 0)),
      crystal: Math.max(0, state.crystal - (cost.crystal ?? 0)),
      deuterium: Math.max(0, state.deuterium - (cost.deuterium ?? 0)),
    };
    emit();
  },
  canAfford(cost: { metal?: number; crystal?: number; deuterium?: number }) {
    return state.metal >= (cost.metal ?? 0)
      && state.crystal >= (cost.crystal ?? 0)
      && state.deuterium >= (cost.deuterium ?? 0);
  },
};

export function useResources() {
  return useSyncExternalStore(resourcesStore.subscribe, resourcesStore.get, resourcesStore.get);
}
