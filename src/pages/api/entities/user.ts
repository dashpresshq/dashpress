import { IAccountProfile } from "shared/types/user";
import { entitiesController } from "../../../backend/entities/entities.controller";
import { requestHandler } from "../../../backend/lib/request";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["authenticatedUser"]);

    return await entitiesController.getUserActiveEntities(
      (validatedRequest.authenticatedUser as IAccountProfile).role
    );
  },
});
