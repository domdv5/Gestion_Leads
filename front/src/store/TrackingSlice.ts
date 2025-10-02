import { trackingService } from "@/services/trackingService";

export const trackingSlice = (set, get) => ({
  trackings: [],

  fetchTrackings: async () => {
    set({ trackingLoading: true });
    try {
      const response = await trackingService.get();
      set({ trackings: response.list || [] });
    } catch (error) {
      console.log("Error in fetchTrackings:", error);
    }
  },
});
