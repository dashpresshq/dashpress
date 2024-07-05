import { isBoolean, maxLength } from "class-validator";
import { fakeMessageDescriptor } from "translations/fake";

import { ENTITY_VALIDATION_CONFIG } from "../validations";
import { handleValidation } from "../validations/handle-validation";

const errorMessage = fakeMessageDescriptor("Error Message");

describe("Handle Validation", () => {
  it("should return error message when validation expectation are not met", () => {
    expect(handleValidation(isBoolean)("false", errorMessage, {}, {})).toBe(
      errorMessage
    );
  });

  it("should return undefined when validations expectation are met", () => {
    expect(
      handleValidation(isBoolean)(false, errorMessage, {}, {})
    ).toBeUndefined();
  });

  it("should not run validations when values are falsy", () => {
    expect(
      handleValidation(isBoolean)("", errorMessage, {}, {})
    ).toBeUndefined();
    expect(
      handleValidation(isBoolean)(undefined, errorMessage, {}, {})
    ).toBeUndefined();
  });

  it("should run validation for those that require parameters", () => {
    expect(
      handleValidation(maxLength, "length")(
        "should error out",
        errorMessage,
        { length: 5 },
        {}
      )
    ).toBe(errorMessage);
    expect(
      handleValidation(maxLength, "length")(
        "less5",
        errorMessage,
        { length: 5 },
        {}
      )
    ).toBeUndefined();
  });
});

describe("Validation Checks", () => {
  it("should check required correctly", () => {
    expect(
      ENTITY_VALIDATION_CONFIG.required.implementation("", errorMessage, {}, {})
    ).toBe(errorMessage);

    expect(
      ENTITY_VALIDATION_CONFIG.required.implementation(
        "dddd",
        errorMessage,
        {},
        {}
      )
    ).toBeUndefined();
  });
});
