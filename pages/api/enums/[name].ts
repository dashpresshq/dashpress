import { requestHandler } from "../../../backend/lib/request";
import { enumsController } from "../../../backend/enums/enums.controller";
import { validateEnumNameFromRequest } from "../../../backend/enums/enums.validation";

export default requestHandler({
  GET: async (req) => {
    const name = validateEnumNameFromRequest(req.query);

    return enumsController.listEnumValues(name);
  },
});
