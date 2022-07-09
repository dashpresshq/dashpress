import { dataController } from "../../../../../backend/data/data.controller";
import {
  validateEntityFromRequest,
  validateEntityIdFromRequest,
} from "../../../../../backend/entities/entities.validations";
import { requestHandler } from "../../../../../backend/lib/request";

export default requestHandler({
  GET: async (req) => {
    const entity = validateEntityFromRequest(req.query);
    const id = validateEntityIdFromRequest(req.query);

    return await dataController.referenceData(entity, id);
  },
});
