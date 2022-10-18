import { configurationService } from "backend/configuration/configuration.service";
import {
  credentialsService,
  environmentVariablesService,
  appConstantsService,
} from "backend/integrations-configurations";
import { dataService } from "backend/data/data.service";
import { entitiesService } from "backend/entities/entities.service";
import { configService } from "backend/lib/config/config.service";
import { rolesService } from "backend/roles/roles.service";
import { schemasService } from "backend/schema/schema.service";
import { usersService } from "backend/users/users.service";
import noop from "lodash/noop";

import { requestHandler } from "../../../backend/lib/request";

export default requestHandler(
  {
    GET: async () => {
      try {
        configService.bootstrap();
        await dataService.bootstrap();
        await schemasService.bootstrap();
        await usersService.bootstrap();
        await rolesService.bootstrap();
        await credentialsService.bootstrap();
        await entitiesService.bootstrap();
        await configurationService.bootstrap();
        await environmentVariablesService.bootstrap();
        await appConstantsService.bootstrap();
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
      _type: "guest",
    },
  ]
);
