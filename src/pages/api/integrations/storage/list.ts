import { storageController } from "backend/storage/storage.controller";
import { requestHandler } from "backend/lib/request";

export default requestHandler({
  GET: () => {
    return storageController.listIntegrations();
  },
});
