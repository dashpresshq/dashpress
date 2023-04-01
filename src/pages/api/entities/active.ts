import { entitiesApiController } from "../../../backend/entities/entities.controller";
import { requestHandler } from "../../../backend/lib/request";

export default requestHandler({
  GET: async () => {
    return await entitiesApiController.getActiveEntities();
  },
});
