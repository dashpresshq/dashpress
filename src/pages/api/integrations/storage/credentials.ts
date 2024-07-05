import { requestHandler } from "backend/lib/request";
import { storageApiService } from "backend/storage/storage.service";
import { UserPermissions } from "shared/constants/user";

export default requestHandler(
  {
    POST: async () => {
      return await storageApiService.showStorageCredentials();
    },
  },
  [
    {
      _type: "canUser",
      body: UserPermissions.CAN_MANAGE_APP_CREDENTIALS,
    },
    {
      _type: "withPassword",
    },
  ]
);
