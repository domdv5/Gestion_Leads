import { create } from "zustand";
import { programSlice } from "@/store/ProgramSlice";
import { trackingSlice } from "@/store/TrackingSlice";
import { leadsSlice } from "@/store/LeadsSlice";

interface Program {
  _id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  code: number;
  message: string;
}

interface Tracking {
  _id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Lead {
  _id: string;
  incremental: number;
  number: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_phone: string;
  interestProgram: string;
  status: string;
  trackings: any[];
  created_at: string;
  updated_at: string;
}

interface StoreState {
  programs: Program[];
  fetchPrograms: () => Promise<void>;
  trackings: Tracking[];
  fetchTrackings: () => Promise<void>;
  leads: Lead[];
  fetchLeads: () => Promise<void>;
  deleteLead: (id: string) => Promise<ApiResponse>;
}

const useStore = create<StoreState>((set, get) => ({
  ...programSlice(set, get),
  ...trackingSlice(set, get),
  ...leadsSlice(set, get),
}));

export default useStore;
