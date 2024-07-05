import {
  canRoleDoThisAsync,
  canRoleDoThisSync,
  doesPermissionAllowPermission,
} from "..";

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
        await canRoleDoThisAsync("creator", "ANY_PERMISSSION", false, () => {
          throw new Error("Do not call me");
        })
      ).toBe(true);
    });

    it("should return true for only check starting with 'CAN_ACCESS_ENTITY' for viewer", async () => {
      expect(
        await canRoleDoThisAsync(
          "viewer",
          "CAN_ACCESS_ENTITY:HELLO",
          false,
          () => {
            throw new Error("Do not call me");
          }
        )
      ).toBe(true);
      expect(
        await canRoleDoThisAsync("viewer", "ANY_OTHER", false, () => {
          throw new Error("Do not call me");
        })
      ).toBe(false);
    });

    it("should return true for custom permission when permission is present", async () => {
      expect(
        await canRoleDoThisAsync(
          "custom",
          "PRESENT_ENTITY",
          false,
          async () => ["PRESENT_ENTITY"]
        )
      ).toBe(true);
      expect(
        await canRoleDoThisAsync("custom", "ANY_OTHER", false, async () => [
          "PRESENT_ENTITY",
        ])
      ).toBe(false);
    });
  });

  describe("doesPermissionAllowPermission", () => {
    describe("Basic", () => {
      it("should return true when permission is 'NO_PERMISSION_REQUIRED'", () => {
        expect(
          doesPermissionAllowPermission([], "NO_PERMISSION_REQUIRED", true)
        ).toBe(true);
      });

      it("should return true when permission is contained", () => {
        expect(
          doesPermissionAllowPermission(
            ["PERMISSION_1", "PERMISSION_2"],
            "PERMISSION_2",
            false
          )
        ).toBe(true);
      });

      it("should return false when permission is not contained", () => {
        expect(
          doesPermissionAllowPermission(
            ["PERMISSION_1", "PERMISSION_2"],
            "SUPER_DUPER_PERMISSION",
            false
          )
        ).toBe(false);
        expect(
          doesPermissionAllowPermission([], "SUPER_DUPER_PERMISSION", false)
        ).toBe(false);
      });
    });

    describe("Group", () => {
      it("should return true for `CAN_MANAGE_ALL_ENTITIES` when permission starts with APPLIED_CAN_ACCESS_ENTITY", () => {
        expect(
          doesPermissionAllowPermission(
            ["CAN_MANAGE_ALL_ENTITIES", "PERMISSION_2"],
            "CAN_ACCESS_ENTITY:FOO--show",
            false
          )
        ).toBe(true);
      });

      it("should return false for `CAN_MANAGE_ALL_ENTITIES` when permission doesn't start with APPLIED_CAN_ACCESS_ENTITY", () => {
        expect(
          doesPermissionAllowPermission(
            ["CAN_MANAGE_ALL_ENTITIES", "PERMISSION_2"],
            "XXX:FOO",
            false
          )
        ).toBe(false);
      });
    });

    describe("Check Granular", () => {
      it("should pass check granular when granular is true", () => {
        expect(
          doesPermissionAllowPermission(
            ["CAN_ACCESS_ENTITY:FOO--update"],
            "CAN_ACCESS_ENTITY:FOO--update",
            true
          )
        ).toBe(true);
      });

      it("should check only granular when granular is true", () => {
        expect(
          doesPermissionAllowPermission(
            ["CAN_ACCESS_ENTITY:FOO--show"],
            "CAN_ACCESS_ENTITY:FOO--update",
            true
          )
        ).toBe(false);
      });

      it("should fail granular check when granular is false and fallback doesn't exist", () => {
        expect(
          doesPermissionAllowPermission(
            ["CAN_ACCESS_ENTITY:FOO--update"],
            "CAN_ACCESS_ENTITY:FOO--update",
            false
          )
        ).toBe(false);
      });

      it("should pass when fallback is present and granular is false", () => {
        expect(
          doesPermissionAllowPermission(
            ["CAN_ACCESS_ENTITY:FOO--show"],
            "CAN_ACCESS_ENTITY:FOO--update",
            false
          )
        ).toBe(true);
      });

      it("should ignore granular check for non entity checks", () => {
        expect(
          doesPermissionAllowPermission(
            ["CAN_ACCESS_FOOD:FOO--update"],
            "CAN_ACCESS_FOOD:FOO--update",
            false
          )
        ).toBe(true);
        expect(
          doesPermissionAllowPermission(
            ["CAN_ACCESS_FOOD:FOO--update"],
            "CAN_ACCESS_FOOD:FOO--update",
            true
          )
        ).toBe(true);
        expect(
          doesPermissionAllowPermission(
            ["CAN_ACCESS_FOOD:FOO--show"],
            "CAN_ACCESS_FOOD:FOO--update",
            false
          )
        ).toBe(false);
        expect(
          doesPermissionAllowPermission(
            ["CAN_ACCESS_FOOD:FOO--show"],
            "CAN_ACCESS_FOOD:FOO--update",
            true
          )
        ).toBe(false);
      });
    });
  });
});
