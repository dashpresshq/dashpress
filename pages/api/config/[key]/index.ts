import { configurationController } from "../../../../backend/configuration/configuration.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler(
  {
    GET: async (getRequest) => {
      return await configurationController.showConfig(getRequest("configKey"));
    },
    PUT: async (getRequest) => {
      return await configurationController.upsertConfig(
        getRequest("configKey"),
        getRequest("configBody")
      );
    },
  },
  [
    {
      _type: "isDeveloper",
      method: ["PUT"],
    },
  ]
);
