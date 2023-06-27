import { setupApiController } from "backend/setup/setup.controller";
import { requestHandler } from "backend/lib/request";

export default requestHandler(
  {
    GET: async () => {
      return await setupApiController.check();
    },
  },
  [
    {
      _type: "guest",
    },
  ]
);
