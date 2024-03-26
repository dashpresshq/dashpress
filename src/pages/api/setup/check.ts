import { setupApiService } from "backend/setup/setup.service";
import { requestHandler } from "backend/lib/request";

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
