import { entitiesApiService } from "@/backend/entities/entities.service";
import { requestHandler } from "@/backend/lib/request";
import type { IAccountProfile } from "@/shared/types/user";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      "authenticatedUser",
    ]);

    return await entitiesApiService.getEntityRelationsForUserRole(
      validatedRequest.entity,
      (validatedRequest.authenticatedUser as IAccountProfile).role
    );
  },
});
