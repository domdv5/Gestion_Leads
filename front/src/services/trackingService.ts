import { get } from "../util/http";
const api = "/trackings";
export const trackingService = {
  api,
  get: async () => {
    return await get({ api: `${api}`, options: { cache: 5 } });
  },
};
