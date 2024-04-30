import { entitiesApiService } from "backend/entities/entities.service";
import { requestHandler } from "backend/lib/request";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["entity"]);

    return await entitiesApiService.getEntityFields(validatedRequest.entity);
  },
});
