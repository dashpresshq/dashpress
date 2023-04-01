import { entitiesApiController } from "backend/entities/entities.controller";
import { requestHandler } from "backend/lib/request";
import { IAccountProfile } from "shared/types/user";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      "authenticatedUser",
    ]);

    return await entitiesApiController.getEntityRelations(
      validatedRequest.entity,
      (validatedRequest.authenticatedUser as IAccountProfile).role
    );
  },
});
