import { entitiesApiService } from "backend/entities/entities.service";
import { requestHandler } from "backend/lib/request";

export default requestHandler({
  GET: async () => {
    return await entitiesApiService.getAllEntities();
  },
});
