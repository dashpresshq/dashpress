import { actionsApiService } from "backend/actions/actions.service";
import { requestHandler } from "backend/lib/request";

export default requestHandler({
  GET: () => {
    return actionsApiService.listActionIntegrations();
  },
});
