import { DataActionType } from "shared/configurations";
import { dataApiController } from "../../../../backend/data/data.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler({
  POST: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      "entityRequestBody",
      {
        _type: "crudEnabled",
        options: DataActionType.Create,
      },
    ]);
    return await dataApiController.createData(
      validatedRequest.entity,
      validatedRequest.entityRequestBody
    );
  },
});
