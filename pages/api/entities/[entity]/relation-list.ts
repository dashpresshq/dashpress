import { USER_PERMISSIONS } from "shared/types";
import { entitiesController } from "../../../../backend/entities/entities.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest(["entity"]);

      return await entitiesController.listAllEntityRelations(
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
