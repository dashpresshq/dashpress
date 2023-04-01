import { packagesApiController } from "backend/packages/packages.controller";
import { requestHandler } from "../../../backend/lib/request";

export default requestHandler(
  {
    POST: async () => {
      return await packagesApiController.installPackages();
    },
  },
  [
    {
      _type: "anyBody",
    },
  ]
);
