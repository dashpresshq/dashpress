import { GranularEntityPermissions } from "shared/types/user";
import { PORTAL_DASHBOARD_PERMISSION } from "./main";

describe("PORTAL_DASHBOARD_PERMISSION", () => {
  it("should return correct permission", () => {
    expect(
      PORTAL_DASHBOARD_PERMISSION("dashboardId", GranularEntityPermissions.Show)
    ).toBe("NO_PERMISSION_REQUIRED");
  });
});
