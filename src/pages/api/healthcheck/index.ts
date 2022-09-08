import { requestHandler } from "../../../backend/lib/request";

export default requestHandler(
  {
    GET: async () => {
      return { ok: true };
    },
  },
  [
    {
      _type: "guest",
    },
  ]
);
