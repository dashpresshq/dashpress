import type { IAccountProfile } from "shared/types/user";
import { requestHandler } from "backend/lib/request";
import { navigationMenuApiService } from "backend/menu/menu.service";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["authenticatedUser"]);

    return await navigationMenuApiService.getMenuItems(
      (validatedRequest.authenticatedUser as IAccountProfile).role
    );
  },
});
