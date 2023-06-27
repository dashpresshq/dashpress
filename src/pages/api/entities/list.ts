import { requestHandler } from "backend/lib/request";
import { entitiesApiController } from "backend/entities/entities.controller";

export default requestHandler({
  GET: async () => {
    return await entitiesApiController.listAllEntities();
  },
});
