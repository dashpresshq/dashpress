import { configurationController } from "../../../../backend/configuration/configuration.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler(
  {
    GET: async (getRequest) => {
      return await configurationController.showConfig(getRequest("config_key"));
    },
    PUT: async (getRequest) => {
      return await configurationController.upsertConfig(
        getRequest("config_key"),
        getRequest("config_body")
      );
    },
  },
  [
    {
      _type: "is_developer",
      method: ["PUT"],
    },
  ]
);
