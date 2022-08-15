import { setupController } from "backend/setup/setup.controller";
import { requestHandler } from "../../../backend/lib/request";

export default requestHandler(
  {
    GET: async () => {
      return await setupController.check();
    },
  },
  [
    {
      _type: "guest",
    },
  ]
);
