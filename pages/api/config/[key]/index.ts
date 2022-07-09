import { configurationController } from "../../../../backend/configuration/configuration.controller";
import { validateConfigKeyFromRequest } from "../../../../backend/configuration/configuration.validations";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler({
  GET: async (req) => {
    const key = validateConfigKeyFromRequest(req.query);

    return await configurationController.showConfig(key);
  },
  PUT: async (req) => {
    const key = validateConfigKeyFromRequest(req.query);

    return await configurationController.upsertConfig(key, req.body.data);
  },
});
