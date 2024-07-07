import { GranularEntityPermissions } from "@/shared/types/user";

import { META_USER_PERMISSIONS } from "../user";

describe("META_USER_PERMISSIONS", () => {
  it("should return correct permission when can access entity is called on valid entity", () => {
    expect(
      META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
        "foo",
        GranularEntityPermissions.Show
      )
    ).toBe("CAN_ACCESS_ENTITY:FOO--show");
  });
});
