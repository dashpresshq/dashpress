import { USER_PERMISSIONS } from "shared/types/user";
import { actionsController } from "backend/actions/actions.controller";
import { requestHandler } from "backend/lib/request";

export default requestHandler(
  {
    GET: async () => {
      return await actionsController.listActivatedActions();
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
    },
  ]
);
