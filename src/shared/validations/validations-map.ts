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
import {
  doesntMatchOtherField,
  greaterThanOtherField,
  lessThanOtherField,
  matchOtherField,
} from "./custom-validations";
import { handleValidation } from "./handle-validation";
import { FormFieldTypes, ValidationTypes } from "./types";

export const ENTITY_VALIDATION_CONFIG: Record<
  ValidationTypes,
  {
    input?: Record<string, unknown>;
    isBoundToType?: Array<FormFieldTypes>;
    message: string;
    implementation: (
      value: unknown,
      errorMessage: string,
      constraints: Record<string, unknown>,
      allValues: Record<string, unknown>
    ) => undefined | string;
  }
> = {
  required: {
    // TODO make this work
    message: "{{ name }} is required",
    implementation: (value, errorMessage) =>
      isNotEmpty(value) ? undefined : errorMessage,
  },
  isEmail: {
    isBoundToType: ["email"],
    message: "{{ name }} is an invalid email",
    implementation: handleValidation(isEmail),
  },
  isJson: {
    isBoundToType: ["json"],
    message: "{{ name }} is an invalid json",
    implementation: handleValidation(isJSON),
  },
  isString: {
    isBoundToType: [
      "password",
      "text",
      "textarea",
      "richtext",
      "image",
      "file",
    ],
    message: "{{ name }} is not a text",
    implementation: handleValidation(isString),
  },
  isColor: {
    isBoundToType: ["color"],
    message: "{{ name }} should be a color",
    implementation: handleValidation(isRgbColor),
  },
  isUrl: {
    isBoundToType: ["url"],
    message: "{{ name }} is an invalid URL",
    implementation: handleValidation(isURL),
  },
  isDate: {
    isBoundToType: ["datetime-local"],
    message: "{{ name }} is an invalid Date",
    implementation: handleValidation(isDate),
  },
  isNumber: {
    isBoundToType: ["number"],
    message: "{{ name }} should be a number",
    implementation: handleValidation(isNumber),
  },
  isBoolean: {
    isBoundToType: ["boolean"],
    message: "{{ name }} should be a boolean",
    implementation: handleValidation(isBoolean),
  },

  alphanumeric: {
    message: "{{ name }} should contain only alphabets and numbers",
    implementation: handleValidation(isAlphanumeric),
  },

  isUpperCase: {
    message: "{{ name }} should contain only upper cases",
    implementation: handleValidation(isUppercase),
  },

  postiveNumber: {
    message: "{{ name }} should be positive number",
    implementation: handleValidation(isPositive),
  },
  min: {
    input: {
      value: 3,
    },
    message: "{{ name }} should be greater than {{ value }}",
    implementation: handleValidation(min, "value"),
  },
  max: {
    input: {
      value: 10,
    },
    message: "{{ name }} should be less than {{ value }}",
    implementation: handleValidation(max, "value"),
  },
  maxLength: {
    input: {
      length: 100,
    },
    message: "{{ name }} should be less than {{ length }} characters",
    implementation: handleValidation(maxLength, "length"),
  },
  minLength: {
    input: {
      length: 3,
    },
    message: "{{ name }} should be greater than {{ length }} characters",
    implementation: handleValidation(minLength, "length"),
  },
  isIn: {
    input: {
      options: [],
    },
    message: "{{ name }} is invalid. Allowed values are {{ options }}",
    implementation: handleValidation(isIn, "options"),
  },

  matchOtherField: {
    input: {
      otherField: "",
    },
    message: "{{ name }} should match {{otherField}}",
    implementation: handleValidation(matchOtherField, "otherField"),
  },

  lessThanOtherField: {
    input: {
      otherField: "",
    },
    message: "{{ name }} should be less than {{otherField}}",
    implementation: handleValidation(lessThanOtherField, "otherField"),
  },

  greaterThanOtherField: {
    input: {
      otherField: "",
    },
    message: "{{ name }} should be greater than {{otherField}}",
    implementation: handleValidation(greaterThanOtherField, "otherField"),
  },

  doesntMatchOtherField: {
    input: {
      otherField: "",
    },
    message: "{{ name }} should not match {{otherField}}",
    implementation: handleValidation(doesntMatchOtherField, "otherField"),
  },

  regex: {
    input: {
      pattern: "//",
    },
    message: "{{ name }} is invalid",
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
  errorMessage: `Only lowercase letters, numbers and ${delimiter} are allowed`,
});
