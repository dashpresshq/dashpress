import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { META_USER_PERMISSIONS } from "../user";

describe("META_USER_PERMISSIONS", () => {
  it("should return NO_PERMISSION when can access entity is called on loading entity", () => {
    expect(
      META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(SLUG_LOADING_VALUE, false)
    ).toBe("NO_PERMISSION_REQUIRED");
  });

  it("should return correct permission when can access entity is called on valid entity", () => {
    expect(META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY("foo", false)).toBe(
      "CAN_ACCESS_ENTITY:FOO"
    );
  });
});
