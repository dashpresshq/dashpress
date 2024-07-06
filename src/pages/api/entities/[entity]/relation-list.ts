import { entitiesApiController } from "backend/entities/entities.controller";
import { requestHandler } from "backend/lib/request";
import { UserPermissions } from "shared/constants/user";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest(["entity"]);

      return await entitiesApiController.listAllEntityRelations(
        validatedRequest.entity
      );
    },
  },
  [
    {
      _type: "canUser",
      body: UserPermissions.CAN_CONFIGURE_APP,
    },
  ]
);
