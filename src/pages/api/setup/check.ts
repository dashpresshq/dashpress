import { requestHandler } from "backend/lib/request";
import { setupApiService } from "backend/setup/setup.service";

export default requestHandler(
  {
    GET: async () => {
      return await setupApiService.check();
    },
  },
  [
    {
      _type: "guest",
    },
  ]
);
