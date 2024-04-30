import { requestHandler } from "backend/lib/request";
import { storageApiService } from "backend/storage/storage.service";

export default requestHandler({
  GET: () => {
    return storageApiService.listStorageIntegrations();
  },
});
