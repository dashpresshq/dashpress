import { dataController } from "../../../../backend/data/data.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest(["entity"]);
      return await dataController.listData(validatedRequest.entity);
    },
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "entity",
        "entityRequestBody",
      ]);
      return await dataController.createData(
        validatedRequest.entity,
        validatedRequest.entityRequestBody
      );
    },
  },
  [
    {
      _type: "canCrud",
      method: ["POST"],
    },
  ]
);
