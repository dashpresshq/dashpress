import { entitiesController } from "../../../../backend/entities/entities.controller";
import { validateEntityFromRequest } from "../../../../backend/entities/entities.validations";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler(
  {
    GET: async (req) => {
      const entity = validateEntityFromRequest(req.query);

      return await entitiesController.getEntityFields(entity);
    },
  }
  // ["isAuthenticated", "isDeveloper", "isEntityAllowed"]
);
