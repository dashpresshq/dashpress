import { actionsApiController } from "backend/actions/actions.controller";
import { requestHandler } from "backend/lib/request";

export default requestHandler({
  GET: () => {
    return actionsApiController.listIntegrations();
  },
});
