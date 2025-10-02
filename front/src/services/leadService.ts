import { get, post } from "../util/http";
const api = "/lead";
export const leadService = {
  api,
  get: async ({ _id }: { _id: string }) => {
    return await get({ api: `${api}/get/${_id}` });
  },
  list: async () => {
    return await get({ api: `${api}`, options: { cache: 5 } });
  },
  create: async (data: any) => {
    return await post({ api: `${api}/upsert`, options: { data } });
  },
  delete: async (id: string) => {
    return await post({ api: `${api}/delete/${id}`, options: { data: {} } });
  },
};
