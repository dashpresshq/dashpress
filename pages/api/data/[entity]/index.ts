import { dataController } from "../../../../backend/data/data.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler(
  {
    GET: async (getRequest) => {
      return await dataController.listData(getRequest("entity"));
    },
    POST: async (getRequest) => {
      return await dataController.createData(
        getRequest("entity"),
        getRequest("requestBody")
      );
    },
    PATCH: async () => {
      // TODO
      // const entity = validateEntityFromRequest(req.query);
      // return await dataController.updateManyData(entity);
    },
    DELETE: async () => {
      // TODO
      // const entity = validateEntityFromRequest(req.query);
      // return await dataController.deleteManyData(entity, req.body.data);
    },
  },
  [
    {
      _type: "canCrud",
      method: ["POST"],
    },
  ]
);
