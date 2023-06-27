import { DataActionType } from "shared/configurations";
import { dataApiController } from "backend/data/data.controller";
import { requestHandler } from "backend/lib/request";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      {
        _type: "requestQuery",
        options: "search",
      },
      {
        _type: "crudEnabled",
        options: DataActionType.List,
      },
    ]);
    return await dataApiController.listData(
      validatedRequest.entity,
      validatedRequest.requestQuery
    );
  },
});
