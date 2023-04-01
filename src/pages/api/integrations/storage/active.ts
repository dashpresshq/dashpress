import { USER_PERMISSIONS } from "shared/constants/user";
import { storageApiController } from "backend/storage/storage.controller";
import { requestHandler } from "backend/lib/request";

export default requestHandler(
  {
    GET: async () => {
      return await storageApiController.listActivatedStorage();
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
    },
  ]
);
