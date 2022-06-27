export const ENTITY_TYPES_SELECTION_BAG: Record<
  | "email"
  | "password"
  | "text"
  | "textarea"
  | "richtext" // not inplemeneted
  | "url"
  | "number"
  | "selection" // not inplemeneted
  | "reference" // not inplemeneted
  | "boolean"
  | "image" // not inplemeneted
  | "datetime-local" // not inplemeneted
  | "color", // not inplemeneted
  {
    typeIsNotChangeAble?: true;
    allowedValidations: Array<SelectableAbleValidations>;
  }
> = {
  email: {
    allowedValidations: [
      "required",
      "unique",
      "maxLength",
      "minLength",
      "regex",
    ],
  },
  password: {
    allowedValidations: [
      "matchOtherField",
      "required",
      "regex",
      "maxLength",
      "minLength",
    ],
  },
  text: {
    allowedValidations: [
      "alphanumeric",
      "maxLength",
      "minLength",
      "required",
      "regex",
      "unique",
      "matchOtherField",
    ],
  },
  textarea: {
    allowedValidations: ["maxLength", "minLength", "required"],
  },
  number: {
    typeIsNotChangeAble: true,
    allowedValidations: ["max", "min", "postiveNumber", "required", "unique"],
  },
  url: {
    allowedValidations: [
      "maxLength",
      "minLength",
      "required",
      "unique",
      "regex",
    ],
  },
  richtext: {
    allowedValidations: ["required", "maxLength", "minLength"],
  },
  "datetime-local": {
    typeIsNotChangeAble: true,
    allowedValidations: ["required"],
  },
  image: {
    allowedValidations: ["maxLength", "minLength", "regex", "required"],
  },
  color: {
    allowedValidations: ["maxLength", "minLength", "required"],
  },

  boolean: {
    // Configure Labels + must use color
    typeIsNotChangeAble: true,
    allowedValidations: ["required"],
  },

  selection: {
    // Configure Selection + maybe use colors
    allowedValidations: ["required"],
  },

  reference: {
    // use color
    typeIsNotChangeAble: true,
    allowedValidations: ["required", "unique"],
  },
};

//   | 'date'
//   | 'file'
//   | 'range'
//   | 'tel'
//   | 'time'

//   | 'month'
//   | 'week'

export type ValidationsBoundToType =
  | "isEmail"
  | "isUrl"
  | "isNumber"
  | "isString"
  | "isDate"
  | "isBoolean"
  | "isColor";

type SelectableAbleValidations =
  | "required"
  | "unique"
  | "min"
  | "max"
  | "maxLength"
  | "minLength"
  | "regex"
  | "alphanumeric"
  | "matchOtherField"
  | "postiveNumber";

// less than other field
// not equal to other field
// requiredIf
//  isDate

export const ENTITY_VALIDATION_CONFIG: Record<
  ValidationsBoundToType | SelectableAbleValidations,
  {
    input?: Record<string, unknown>;
    isBoundToType?: Array<keyof typeof ENTITY_TYPES_SELECTION_BAG>;
    message: string;
  }
> = {
  // Selection, enum like check
  // reference, that the reference exists in the DB
  isEmail: {
    isBoundToType: ["email"],
    message: "Invalid email",
  },
  isString: {
    isBoundToType: ["password", "text", "textarea", "richtext", "image"],
    message: "$name is not a text",
  },
  isColor: {
    isBoundToType: ["color"],
    message: "$name should be a color",
  },
  isUrl: {
    isBoundToType: ["url"],
    message: "Invalid URL",
  },
  isDate: {
    isBoundToType: ["datetime-local"],
    message: "Invalid Date",
  },
  isNumber: {
    isBoundToType: ["number"],
    message: "$name should be a number",
  },
  isBoolean: {
    isBoundToType: ["boolean"],
    message: "$name should be a boolean",
  },
  required: {
    message: "$name is required",
  },
  unique: {
    message: "$name has already been taken",
  },
  alphanumeric: {
    message: "$name should contain only alpabets, numbers and underscore",
  },
  postiveNumber: {
    message: "$name should be positive number",
  },
  matchOtherField: {
    input: {
      otherField: "",
    },
    message: "$name should match {{otherField}}",
  },
  min: {
    input: {
      length: 3,
    },
    message: "$name should be greater than $input",
  },
  max: {
    input: {
      length: 10,
    },
    message: "$name should be less than $input",
  },
  maxLength: {
    input: {
      length: 100,
    },
    message: "$name should be less than $input characters",
  },
  minLength: {
    input: {
      length: 3,
    },
    message: "$name should be greater than $input characters",
  },
  regex: {
    input: {
      pattern: "//",
    },
    message: "$name is invalid",
  },
};
