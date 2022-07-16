import { dataController } from "../../../../../backend/data/data.controller";
import { requestHandler } from "../../../../../backend/lib/request";

export default requestHandler(
  {
    GET: async (getRequest) => {
      return await dataController.showData(
        getRequest("entity"),
        getRequest("entity_id")
      );
    },
    PATCH: async (getRequest) => {
      return await dataController.updateData(
        getRequest("entity"),
        getRequest("entity_id"),
        getRequest("request_body")
      );
    },
    DELETE: async (getRequest) => {
      return await dataController.deleteData(
        getRequest("entity"),
        getRequest("entity_id")
      );
    },
  },
  [{ _type: "can_crud" }]
);
