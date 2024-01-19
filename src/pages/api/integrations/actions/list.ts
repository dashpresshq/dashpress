import { integrationsApiService } from "backend/integrations/integrations.service";
import { requestHandler } from "backend/lib/request";

export default requestHandler({
  GET: () => {
    return integrationsApiService.listActionIntegrations();
  },
});
