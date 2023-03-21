import { DataActionType } from "shared/configurations";
import { dataController } from "../../../../../backend/data/data.controller";
import { requestHandler } from "../../../../../backend/lib/request";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      "entityId",
      {
        _type: "crudEnabled",
        options: DataActionType.Details,
      },
    ]);

    return await dataController.showData(
      validatedRequest.entity,
      validatedRequest.entityId
    );
  },
  PATCH: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      "entityId",
      "entityRequestBody",
      {
        _type: "crudEnabled",
        options: DataActionType.Update,
      },
    ]);
    return await dataController.updateData(
      validatedRequest.entity,
      validatedRequest.entityId,
      validatedRequest.entityRequestBody
    );
  },
  DELETE: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      "entityId",
      {
        _type: "crudEnabled",
        options: DataActionType.Delete,
      },
    ]);
    return await dataController.deleteData(
      validatedRequest.entity,
      validatedRequest.entityId
    );
  },
});
