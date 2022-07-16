import { dataController } from "../../../../../backend/data/data.controller";
import { requestHandler } from "../../../../../backend/lib/request";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["entity", "entityId"]);

    return await dataController.referenceData(
      validatedRequest.entity,
      validatedRequest.entityId
    );
  },
});
