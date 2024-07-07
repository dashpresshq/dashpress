import { dataApiController } from "@/backend/data/data.controller";
import { requestHandler } from "@/backend/lib/request";
import { DataActionType } from "@/shared/configurations";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      "queryFilters",
      "paginationFilter",
      {
        _type: "crudEnabled",
        options: DataActionType.Table,
      },
    ]);

    return await dataApiController.tableData(
      validatedRequest.entity,
      validatedRequest.queryFilters,
      validatedRequest.paginationFilter
    );
  },
});
