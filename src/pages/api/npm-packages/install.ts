import { npmPackagesApiController } from "backend/npm-packages/npm-packages.controller";
import { requestHandler } from "../../../backend/lib/request";

export default requestHandler(
  {
    GET: async () => {
      return await npmPackagesApiController.installPackages();
    },
  },
  [
    {
      _type: "anyBody",
    },
  ]
);
