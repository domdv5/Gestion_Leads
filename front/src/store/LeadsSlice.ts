import { leadService } from "../services/leadService";

export const leadsSlice = (set, get) => ({
  leads: [],

  fetchLeads: async () => {
    set({ leadsLoading: true });
    try {
      const response = await leadService.list();
      set({ leads: response.list || [] });
    } catch (error) {
      console.log("Error in fetchLeads:", error);
      set({ leadsError: "Error al cargar leads" });
    }
  },

  deleteLead: async (id: string) => {
    try {
      const response = await leadService.delete(id);
      set((state) => ({
        leads: state.leads.filter((lead) => lead._id !== id),
      }));

      return response;
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  },
});
