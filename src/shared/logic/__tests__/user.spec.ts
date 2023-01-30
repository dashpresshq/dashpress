import {
  canRoleDoThisSync,
  canRoleDoThisAsync,
  doesPermissionAllowPermission,
} from "../permissions";

describe("user role checks", () => {
  describe("canRoleDoThisSync", () => {
    it("should return true for any check for creator", () => {
      expect(canRoleDoThisSync("creator", "ANY_PERMISSSION", [])).toBe(true);
    });

    it("should return true for only check starting with 'CAN_ACCESS_ENTITY' for viewer", () => {
      expect(canRoleDoThisSync("viewer", "CAN_ACCESS_ENTITY:HELLO", [])).toBe(
        true
      );
      expect(canRoleDoThisSync("viewer", "ANY_OTHER", [])).toBe(false);
    });

    it("should return true for custom permission when permission is present", () => {
      expect(
        canRoleDoThisSync("custom", "PRESENT_ENTITY", ["PRESENT_ENTITY"])
      ).toBe(true);
      expect(canRoleDoThisSync("custom", "ANY_OTHER", ["PRESENT_ENTITY"])).toBe(
        false
      );
    });
  });

  describe("canRoleDoThisAsync", () => {
    it("should return true for any check for creator", async () => {
      expect(
        await canRoleDoThisAsync("creator", "ANY_PERMISSSION", () => {
          throw new Error("Do not call me");
        })
      ).toBe(true);
    });

    it("should return true for only check starting with 'CAN_ACCESS_ENTITY' for viewer", async () => {
      expect(
        await canRoleDoThisAsync("viewer", "CAN_ACCESS_ENTITY:HELLO", () => {
          throw new Error("Do not call me");
        })
      ).toBe(true);
      expect(
        await canRoleDoThisAsync("viewer", "ANY_OTHER", () => {
          throw new Error("Do not call me");
        })
      ).toBe(false);
    });

    it("should return true for custom permission when permission is present", async () => {
      expect(
        await canRoleDoThisAsync("custom", "PRESENT_ENTITY", async () => [
          "PRESENT_ENTITY",
        ])
      ).toBe(true);
      expect(
        await canRoleDoThisAsync("custom", "ANY_OTHER", async () => [
          "PRESENT_ENTITY",
        ])
      ).toBe(false);
    });
  });

  describe("doesPermissionAllowPermission", () => {
    it("should return true when permission is contained", () => {
      expect(
        doesPermissionAllowPermission(
          ["PERMISSION_1", "PERMISSION_2"],
          "PERMISSION_2"
        )
      ).toBe(true);
    });
    it("should return false when permission is not contained", () => {
      expect(
        doesPermissionAllowPermission(
          ["PERMISSION_1", "PERMISSION_2"],
          "SUPER_DUPER_PERMISSION"
        )
      ).toBe(false);
      expect(doesPermissionAllowPermission([], "SUPER_DUPER_PERMISSION")).toBe(
        false
      );
    });
    it("should return true for `CAN_MANAGE_ALL_ENTITIES` when permission starts with APPLIED_CAN_ACCESS_ENTITY", () => {
      expect(
        doesPermissionAllowPermission(
          ["CAN_MANAGE_ALL_ENTITIES", "PERMISSION_2"],
          "CAN_ACCESS_ENTITY:FOO"
        )
      ).toBe(true);
    });

    it("should return false for `CAN_MANAGE_ALL_ENTITIES` when permission doesn't start with APPLIED_CAN_ACCESS_ENTITY", () => {
      expect(
        doesPermissionAllowPermission(
          ["CAN_MANAGE_ALL_ENTITIES", "PERMISSION_2"],
          "XXX:FOO"
        )
      ).toBe(false);
    });
  });
});
