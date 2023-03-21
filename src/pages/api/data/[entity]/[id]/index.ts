import { dataController } from "../../../../../backend/data/data.controller";
import { requestHandler } from "../../../../../backend/lib/request";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "entity",
        "entityId",
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
      ]);
      return await dataController.deleteData(
        validatedRequest.entity,
        validatedRequest.entityId
      );
    },
  },
  [{ _type: "crudEnabled" }]
);
