import { get } from "../util/http";
const api = "/programs";
export const programService = {
  api,
  get: async () => {
    return await get({ api: `${api}`, options: { cache: 5 } });
  },
};
