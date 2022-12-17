import { USER_PERMISSIONS } from "shared/types/user";
import { storageController } from "backend/storage/storage.controller";
import { requestHandler } from "backend/lib/request";

export default requestHandler(
  {
    GET: async () => {
      return await storageController.listActivatedStorage();
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
    },
  ]
);
