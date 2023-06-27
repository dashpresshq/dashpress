import { DataActionType } from "shared/configurations";
import { IAccountProfile } from "shared/types/user";
import { validateEntityFields } from "backend/lib/request/validations/implementations/_validateEntityField";
import { dataApiController } from "backend/data/data.controller";
import { requestHandler } from "backend/lib/request";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      "entityId",
      {
        _type: "requestQuery",
        options: "column",
      },
      {
        _type: "crudEnabled",
        options: DataActionType.Details,
      },
    ]);

    const field = validatedRequest.requestQuery;

    if (field) {
      await validateEntityFields(validatedRequest.entity, [field]);
    }

    return await dataApiController.showData(
      validatedRequest.entity,
      validatedRequest.entityId,
      validatedRequest.requestQuery
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
