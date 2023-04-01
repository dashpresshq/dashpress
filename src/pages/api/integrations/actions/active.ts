import { USER_PERMISSIONS } from "shared/constants/user";
import { actionsApiController } from "backend/actions/actions.controller";
import { requestHandler } from "backend/lib/request";

export default requestHandler(
  {
    GET: async () => {
      return await actionsApiController.listActivatedActions();
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
    },
  ]
);
