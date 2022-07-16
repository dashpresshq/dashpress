import { dataController } from "../../../../backend/data/data.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler({
  GET: async (getRequest) => {
    return await dataController.tableData(
      getRequest("entity"),
      getRequest("queryFilters"),
      getRequest("paginationFilter")
    );
  },
});
