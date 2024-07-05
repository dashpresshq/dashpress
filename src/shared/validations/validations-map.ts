import {
  isBoolean,
  isString,
  isEmail,
  maxLength,
  minLength,
  isURL,
  isNumber,
  isJSON,
  isPositive,
  matches,
  isAlphanumeric,
  isNotEmpty,
  isDate,
  isRgbColor,
  min,
  max,
  isIn,
  isUppercase,
} from "class-validator";
import { msg } from "@lingui/macro";
import type { MessageDescriptor } from "@lingui/core";
import {
  doesntMatchOtherField,
  greaterThanOtherField,
  lessThanOtherField,
  matchOtherField,
} from "./custom-validations";
import { handleValidation } from "./handle-validation";
import type { FormFieldTypes, ValidationTypes } from "./types";

type ImplementationFn = (
  value: unknown,
  errorMessage: MessageDescriptor,
  constraints: Record<string, unknown>,
  allValues: Record<string, unknown>
) => undefined | MessageDescriptor;

export const ENTITY_VALIDATION_CONFIG: Record<
  ValidationTypes,
  {
    label: MessageDescriptor;
    input?: Record<string, unknown>;
    isBoundToType?: Array<FormFieldTypes>;
    message: MessageDescriptor;
    implementation: ImplementationFn;
  }
> = {
  required: {
    label: msg`Required`,
    message: msg`[[ name ]] is required`,
    implementation: (value, errorMessage) =>
      isNotEmpty(value) ? undefined : errorMessage,
  },
  isEmail: {
    label: msg`Email`,
    isBoundToType: ["email"],
    message: msg`[[ name ]] is an invalid email`,
    implementation: handleValidation(isEmail),
  },
  isJson: {
    label: msg`JSON`,
    isBoundToType: ["json"],
    message: msg`[[ name ]] is an invalid json`,
    implementation: handleValidation(isJSON),
  },
  isString: {
    label: msg`String`,
    isBoundToType: [
      "password",
      "text",
      "textarea",
      "richtext",
      "image",
      "file",
    ],
    message: msg`[[ name ]] is not a text`,
    implementation: handleValidation(isString),
  },
  isColor: {
    label: msg`Color`,
    isBoundToType: ["color"],
    message: msg`[[ name ]] should be a color`,
    implementation: handleValidation(isRgbColor),
  },
  isUrl: {
    label: msg`URL`,
    isBoundToType: ["url"],
    message: msg`[[ name ]] is an invalid URL`,
    implementation: handleValidation(isURL),
  },
  isDate: {
    label: msg`Date`,
    isBoundToType: ["datetime-local"],
    message: msg`[[ name ]] is an invalid date`,
    implementation: handleValidation(isDate),
  },
  isNumber: {
    label: msg`Number`,
    isBoundToType: ["number"],
    message: msg`[[ name ]] should be a number`,
    implementation: handleValidation(isNumber),
  },
  isBoolean: {
    label: msg`Boolean`,
    isBoundToType: ["boolean"],
    message: msg`[[ name ]] should be a boolean`,
    implementation: handleValidation(isBoolean),
  },

  alphanumeric: {
    label: msg`Alphanumeric`,
    message: msg`[[ name ]] should contain only alphabets and numbers`,
    implementation: handleValidation(isAlphanumeric),
  },

  isUpperCase: {
    label: msg`Uppercase`,
    message: msg`[[ name ]] should contain only upper cases`,
    implementation: handleValidation(isUppercase),
  },

  postiveNumber: {
    label: msg`Positive Number`,
    message: msg`[[ name ]] should be positive number`,
    implementation: handleValidation(isPositive),
  },
  min: {
    label: msg`Min`,
    input: {
      value: 3,
    },
    message: msg`[[ name ]] should be greater than [[ value ]]`,
    implementation: handleValidation(min, "value"),
  },
  max: {
    label: msg`Max`,
    input: {
      value: 10,
    },
    message: msg`[[ name ]] should be less than [[ value ]]`,
    implementation: handleValidation(max, "value"),
  },
  maxLength: {
    label: msg`Max Length`,
    input: {
      length: 100,
    },
    message: msg`[[ name ]] should be less than [[ length ]] characters`,
    implementation: handleValidation(maxLength, "length"),
  },
  minLength: {
    label: msg`Min Length`,
    input: {
      length: 3,
    },
    message: msg`[[ name ]] should be greater than [[ length ]] characters`,
    implementation: handleValidation(minLength, "length"),
  },
  isIn: {
    label: msg`Is In`,
    input: {
      options: [],
    },
    message: msg`Allowed values are [[ options ]]`,
    implementation: handleValidation(isIn, "options"),
  },

  matchOtherField: {
    label: msg`Equal To Other Field`,
    input: {
      otherField: "",
    },
    message: msg`[[ name ]] should match [[ otherField ]]`,
    implementation: handleValidation(matchOtherField, "otherField"),
  },

  lessThanOtherField: {
    label: msg`Less Than Other Field`,
    input: {
      otherField: "",
    },
    message: msg`[[ name ]] should be less than [[ otherField ]]`,
    implementation: handleValidation(lessThanOtherField, "otherField"),
  },

  greaterThanOtherField: {
    label: msg`Greater Than Other Field`,
    input: {
      otherField: "",
    },
    message: msg`[[ name ]] should be greater than [[ otherField ]]`,
    implementation: handleValidation(greaterThanOtherField, "otherField"),
  },

  doesntMatchOtherField: {
    label: msg`Not Equal To Other Field`,
    input: {
      otherField: "",
    },
    message: msg`[[ name ]] should not match [[ otherField ]]`,
    implementation: handleValidation(doesntMatchOtherField, "otherField"),
  },

  regex: {
    label: msg`Regex`,
    input: {
      pattern: "//",
    },
    message: msg`[[ name ]] is invalid`,
    implementation: handleValidation(matches, "pattern"),
  },
};

const LOWERCASE_NUMBERS_HYPEN_AND_UNDERSCORE_REGEX = (delimeter: "-" | "_") =>
  `^[a-z0-9${delimeter}]+$`;

export const SLUG_VALIDATION = (delimiter: "hyphens" | "underscores") => ({
  validationType: "regex" as const,
  constraint: {
    pattern: LOWERCASE_NUMBERS_HYPEN_AND_UNDERSCORE_REGEX(
      delimiter === "hyphens" ? "-" : "_"
    ),
  },
  errorMessage: msg`Only lowercase letters, numbers and ${delimiter} are allowed`,
});
