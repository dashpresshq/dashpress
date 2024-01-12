import { requestHandler } from "backend/lib/request";
import { actionsApiService } from "backend/actions/actions.service";

export default requestHandler({
  GET: async () => {
    return await actionsApiService.listActivatedActions();
  },
});
