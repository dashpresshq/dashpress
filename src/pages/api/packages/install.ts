import { packagesController } from "backend/packages/packages.controller";
import { requestHandler } from "../../../backend/lib/request";

export default requestHandler(
  {
    POST: async () => {
      return await packagesController.installPackages();
    },
  },
  [
    {
      _type: "anyBody",
    },
  ]
);
