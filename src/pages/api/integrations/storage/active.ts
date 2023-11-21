import { USER_PERMISSIONS } from "shared/constants/user";
import { storageApiController } from "backend/storage/storage.controller";
import { requestHandler } from "backend/lib/request";

export default requestHandler(
  {
    GET: async () => {
      return await storageApiController.getCurrentActivatedStorage();
    },
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: {},
        },
      ]);

      return await storageApiController.activateStorage(
        validatedRequest.requestBody
      );
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
    },
  ]
);
