import { USER_PERMISSIONS } from "shared/constants/user";
import { storageApiController } from "backend/storage/storage.controller";
import { requestHandler } from "backend/lib/request";

export default requestHandler(
  {
    POST: async () => {
      return await storageApiController.showStorageCredentials();
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
    },
    {
      _type: "withPassword",
    },
  ]
);
