import { configurationController } from "../../../../backend/configuration/configuration.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler(
  {
    GET: async (getRequest) => {
      return await configurationController.showConfig(
        getRequest("configKey"),
        getRequest("entity")
      );
    },
    PUT: async (getRequest) => {
      return await configurationController.upsertConfig(
        getRequest("configKey"),
        getRequest("configBody"),
        getRequest("entity")
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
