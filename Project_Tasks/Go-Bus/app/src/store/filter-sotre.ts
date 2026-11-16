import { atom } from "jotai";

export type FilterState = {
  source: string | null;
  destination: string | null;
  tripDate: string | null;
  section: "manual" | "scheduled" | "both";
};
export const filterAtom = atom<FilterState>({
  source: null,
  destination: null,
  tripDate: null,
  section: "both"
});
