import { programService } from "../services/programService";

export const programSlice = (set, get) => ({
  programs: [],

  fetchPrograms: async () => {
    try {
      const response = await programService.get();
      set({ programs: response.list || [] });
    } catch (error) {
      console.log("Error in fetchPrograms:", error);
    }
  },
});
