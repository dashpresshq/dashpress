import { USER_PERMISSIONS } from "shared/constants/user";
import { requestHandler } from "backend/lib/request";
import { storageApiService } from "backend/storage/storage.service";

export default requestHandler(
  {
    GET: async () => {
      return { data: await storageApiService.getCurrentActivatedStorage() };
    },
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: {},
        },
      ]);

      return await storageApiService.activateStorage(
        validatedRequest.requestBody
      );
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_APP_CREDENTIALS,
    },
  ]
);
