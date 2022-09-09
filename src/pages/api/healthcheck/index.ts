import { configurationService } from "backend/configuration/configuration.service";
import { credentialsService } from "backend/credentials/credentials.service";
import { dataService } from "backend/data/data.service";
import { entitiesService } from "backend/entities/entities.service";
import { configService } from "backend/lib/config/config.service";
import { rolesService } from "backend/roles/roles.service";
import { schemasService } from "backend/schema/schema.service";
import { usersService } from "backend/users/users.service";
import { requestHandler } from "../../../backend/lib/request";

export default requestHandler(
  {
    GET: async () => {
      dataService.bootstrap();
      schemasService.bootstrap();
      configService.bootstrap();
      usersService.bootstrap();
      rolesService.bootstrap();
      credentialsService.bootstrap();
      entitiesService.bootstrap();
      configurationService.bootstrap();
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
