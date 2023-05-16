import { DataActionType } from "shared/configurations";
import { IAccountProfile } from "shared/types/user";
import { dataApiController } from "../../../../../backend/data/data.controller";
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

    return await dataApiController.showData(
      validatedRequest.entity,
      validatedRequest.entityId
    );
  },
  PATCH: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      "entityId",
      "authenticatedUser",
      "entityRequestBody",
      {
        _type: "crudEnabled",
        options: DataActionType.Update,
      },
    ]);
    return await dataApiController.updateData(
      validatedRequest.entity,
      validatedRequest.entityId,
      validatedRequest.entityRequestBody,
      validatedRequest.authenticatedUser as IAccountProfile
    );
  },
  DELETE: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      "authenticatedUser",
      "entityId",
      {
        _type: "crudEnabled",
        options: DataActionType.Delete,
      },
    ]);
    return await dataApiController.deleteData(
      validatedRequest.entity,
      validatedRequest.entityId,
      validatedRequest.authenticatedUser as IAccountProfile
    );
  },
});
