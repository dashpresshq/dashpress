import { IAccountProfile } from "shared/types/user";
import { requestHandler } from "backend/lib/request";
import { entitiesApiController } from "backend/entities/entities.controller";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["authenticatedUser"]);

    return await entitiesApiController.getUserMenuEntities(
      (validatedRequest.authenticatedUser as IAccountProfile).role
    );
  },
});
