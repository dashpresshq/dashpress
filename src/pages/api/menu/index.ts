import { IAccountProfile } from "shared/types/user";
import { requestHandler } from "backend/lib/request";
import { menuApiController } from "backend/menu/menu.controller";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["authenticatedUser"]);

    return await menuApiController.getMenuItems(
      (validatedRequest.authenticatedUser as IAccountProfile).role
    );
  },
});
