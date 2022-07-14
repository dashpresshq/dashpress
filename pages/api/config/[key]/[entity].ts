import { configurationController } from "../../../../backend/configuration/configuration.controller";
import { validateConfigKeyFromRequest } from "../../../../backend/configuration/configuration.validations";
import { validateEntityFromRequest } from "../../../../backend/entities/entities.validations";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler({
  // is authenticated
  GET: async (req) => {
    const entity = validateEntityFromRequest(req.query);
    const key = validateConfigKeyFromRequest(req.query, entity);

    return await configurationController.showConfig(key, entity);
  },
  // TODO validate is developer
  PUT: async (req) => {
    const entity = validateEntityFromRequest(req.query);
    const key = validateConfigKeyFromRequest(req.query, entity);

    return await configurationController.upsertConfig(
      key,
      req.body.data,
      entity
    );
  },
});
