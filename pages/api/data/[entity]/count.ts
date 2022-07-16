import { dataController } from "../../../../backend/data/data.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      "queryFilters",
    ]);

    return await dataController.countData(
      validatedRequest.entity,
      validatedRequest.queryFilters
    );
  },
});
