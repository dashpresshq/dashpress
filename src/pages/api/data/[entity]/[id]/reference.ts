import { DataActionType } from "shared/configurations";
import { dataApiController } from "../../../../../backend/data/data.controller";
import { requestHandler } from "../../../../../backend/lib/request";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      "entityId",
      {
        _type: "crudEnabled",
        options: DataActionType.Reference,
      },
    ]);

    return await dataApiController.referenceData(
      validatedRequest.entity,
      validatedRequest.entityId
    );
  },
});
