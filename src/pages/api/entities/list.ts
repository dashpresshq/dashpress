import { requestHandler } from "backend/lib/request";
import { entitiesApiService } from "backend/entities/entities.service";

export default requestHandler({
  GET: async () => {
    return await entitiesApiService.getAllEntities();
  },
});
