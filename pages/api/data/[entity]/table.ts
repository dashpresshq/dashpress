import { dataController } from "../../../../backend/data/data.controller";
import { validateEntityFromRequest } from "../../../../backend/entities/entities.validations";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler({
  GET: async (req) => {
    const entity = validateEntityFromRequest(req.query);

    return await dataController.tableData(entity, req.query);
  },
});
