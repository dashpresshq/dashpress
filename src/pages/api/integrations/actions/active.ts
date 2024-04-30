import { integrationsApiService } from "backend/integrations/integrations.service";
import { requestHandler } from "backend/lib/request";

export default requestHandler({
  GET: async () => {
    return await integrationsApiService.listActivatedIntegrations();
  },
});
