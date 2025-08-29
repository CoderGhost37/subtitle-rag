import { create } from "zustand";
import type { PathwayBasicInfoType } from "@/actions/admin/get-pathways-basic-info";

type PathwayState = {
  pathwayId: string | null;
  pathwayName: string | null;
  setPathway: (pathway: PathwayBasicInfoType) => void;
  clearPathway: () => void;
};

export const usePathwayStore = create<PathwayState>((set) => ({
  pathwayId: null,
  pathwayName: null,
  setPathway: (pathway) =>
    set({ pathwayId: pathway.id, pathwayName: pathway.title }),
  clearPathway: () => set({ pathwayId: null, pathwayName: null }),
}));
