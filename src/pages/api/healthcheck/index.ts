import noop from "lodash/noop";
import { requestHandler } from "backend/lib/request";
import { configurationApiService } from "backend/configuration/configuration.service";
import {
  credentialsApiService,
  environmentVariablesApiService,
  appConstantsApiService,
} from "backend/integrations-configurations";
import { dataApiService } from "backend/data/data.service";
import { entitiesApiService } from "backend/entities/entities.service";
import { configApiService } from "backend/lib/config/config.service";
import { rolesApiService } from "backend/roles/roles.service";
import { schemasApiService } from "backend/schema/schema.service";
import { usersApiService } from "backend/users/users.service";
import { packagesApiService } from "backend/packages/packages.service";
import { storageApiService } from "backend/storage/storage.service";
import { actionsApiService } from "backend/actions/actions.service";
import { dashboardWidgetsApiService } from "backend/dashboard-widgets/dashboard-widgets.service";
import { listOrderApiService } from "backend/list-order/list-order.service";
import { bootstrapPortalServices } from "./portal";

export default requestHandler(
  {
    GET: async () => {
      try {
        configApiService.bootstrap();

        await credentialsApiService.bootstrap();
        await configurationApiService.bootstrap();
        await environmentVariablesApiService.bootstrap();
        await appConstantsApiService.bootstrap();
        await rolesApiService.bootstrap();

        await dataApiService.bootstrap();
        await schemasApiService.bootstrap();
        await usersApiService.bootstrap();
        await entitiesApiService.bootstrap();
        await actionsApiService.bootstrap();
        await dashboardWidgetsApiService.bootstrap();
        await storageApiService.bootstrap();
        await listOrderApiService.bootstrap();

        await packagesApiService.bootstrap();

        await bootstrapPortalServices();

        await packagesApiService.installPackages();
      } catch (error) {
        noop();
      }
      return {
        ok: true,
      };
    },
  },
  [
    {
      _type: "anyBody",
    },
  ]
);
