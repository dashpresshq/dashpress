import { USER_PERMISSIONS } from "shared/constants/user";
import { entitiesApiController } from "backend/entities/entities.controller";
import { requestHandler } from "backend/lib/request";

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
      body: USER_PERMISSIONS.CAN_CONFIGURE_APP,
    },
  ]
);
