import {
  doesntMatchOtherField,
  greaterThanOtherField,
  lessThanOtherField,
  matchOtherField,
} from "../custom-validations";

describe("Custom validations", () => {
  const TEST_CASES = [
    {
      label: "matchOtherField",
      implementation: matchOtherField,
      trueCases: [[4, 4]],
      falseCases: [[5, 4]],
    },
    {
      label: "lessThanOtherField",
      implementation: lessThanOtherField,
      trueCases: [[3, 9]],
      falseCases: [
        [9, 3],
        [3, 3],
      ],
    },
    {
      label: "greaterThanOtherField",
      implementation: greaterThanOtherField,
      trueCases: [[7, 3]],
      falseCases: [
        [3, 7],
        [3, 3],
      ],
    },
    {
      label: "doesntMatchOtherField",
      implementation: doesntMatchOtherField,
      trueCases: [[5, 4]],
      falseCases: [[4, 4]],
    },
  ];

  describe.each(TEST_CASES)(
    "$label",
    ({ falseCases, implementation, trueCases }) => {
      it("should return true when valid", () => {
        trueCases.forEach(([value, otherField]) => {
          expect(implementation(value, "otherField", { otherField })).toBe(
            true
          );
        });
      });

      it("should return false when invalid", () => {
        falseCases.forEach(([value, otherField]) => {
          expect(implementation(value, "otherField", { otherField })).toBe(
            false
          );
        });
      });
    }
  );
});
