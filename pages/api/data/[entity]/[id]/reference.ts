import { dataController } from "../../../../../backend/data/data.controller";
import { requestHandler } from "../../../../../backend/lib/request";

export default requestHandler({
  GET: async (getRequest) => {
    return await dataController.referenceData(
      getRequest("entity"),
      getRequest("entity_id")
    );
  },
});
