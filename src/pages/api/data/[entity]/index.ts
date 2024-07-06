import { dataApiController } from "backend/data/data.controller";
import { requestHandler } from "backend/lib/request";
import { DataActionType } from "shared/configurations";
import type { IAccountProfile } from "shared/types/user";

export default requestHandler({
  POST: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      "authenticatedUser",
      {
        _type: "requestBody",
        options: {},
      },
      {
        _type: "crudEnabled",
        options: DataActionType.Create,
      },
    ]);
    return await dataApiController.createData(
      validatedRequest.entity,
      validatedRequest.requestBody.data,
      validatedRequest.authenticatedUser as IAccountProfile
    );
  },
});
