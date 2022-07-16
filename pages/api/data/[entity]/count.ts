import { dataController } from "../../../../backend/data/data.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler({
  GET: async (getRequest) => {
    return await dataController.countData(
      getRequest("entity"),
      getRequest("query_filters")
    );
  },
});
