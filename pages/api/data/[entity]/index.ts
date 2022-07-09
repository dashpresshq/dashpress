import { dataController } from "../../../../backend/data/data.controller";
import { validateEntityFromRequest } from "../../../../backend/entities/entities.validations";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler({
  GET: async (req) => {
    const entity = validateEntityFromRequest(req.query);

    return await dataController.listData(entity);
  },
  POST: async (req) => {
    const entity = validateEntityFromRequest(req.query);

    return await dataController.createData(entity, req.body.data);
  },
  PATCH: async () => {
    // TODO
    // const entity = validateEntityFromRequest(req.query);
    // return await dataController.updateManyData(entity);
  },
  DELETE: async () => {
    // TODO
    // const entity = validateEntityFromRequest(req.query);
    // return await dataController.deleteManyData(entity, req.body.data);
  },
});
