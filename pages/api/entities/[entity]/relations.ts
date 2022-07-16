import { entitiesController } from "../../../../backend/entities/entities.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["entity"]);

    return await entitiesController.getEntityRelations(validatedRequest.entity);
  },
});
