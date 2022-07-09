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

    return await dataController.showData(entity, id);
  },
  PATCH: async (req) => {
    const entity = validateEntityFromRequest(req.query);
    const id = validateEntityIdFromRequest(req.query);

    return await dataController.updateData(entity, id, req.body.data);
  },
  DELETE: async (req) => {
    const entity = validateEntityFromRequest(req.query);
    const id = validateEntityIdFromRequest(req.query);

    return await dataController.deleteData(entity, id);
  },
});
