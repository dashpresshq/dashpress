import { actionsController } from "backend/actions/actions.controller";
import { requestHandler } from "backend/lib/request";

export default requestHandler({
  GET: () => {
    return actionsController.listIntegrations();
  },
});
