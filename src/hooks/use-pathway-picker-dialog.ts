import { create } from "zustand";

type PathwayState = {
  open: boolean;
  toggle: () => void;
};

export const usePathwayPickerDialogStore = create<PathwayState>((set) => ({
  open: false,
  toggle: () => set((state) => ({ open: !state.open })),
}));
