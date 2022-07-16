import { dataController } from "../../../../../backend/data/data.controller";
import { requestHandler } from "../../../../../backend/lib/request";

export default requestHandler(
  {
    GET: async (getRequest) => {
      return await dataController.showData(
        getRequest("entity"),
        getRequest("entityId")
      );
    },
    PATCH: async (getRequest) => {
      return await dataController.updateData(
        getRequest("entity"),
        getRequest("entityId"),
        getRequest("requestBody")
      );
    },
    DELETE: async (getRequest) => {
      return await dataController.deleteData(
        getRequest("entity"),
        getRequest("entityId")
      );
    },
  },
  [{ _type: "canCrud" }]
);
