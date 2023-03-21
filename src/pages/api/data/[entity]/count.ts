import { DataActionType } from "shared/configurations";
import { dataController } from "../../../../backend/data/data.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      "queryFilters",
      {
        _type: "crudEnabled",
        options: DataActionType.Count,
      },
    ]);
    return await dataController.countData(
      validatedRequest.entity,
      validatedRequest.queryFilters
    );
  },
});
