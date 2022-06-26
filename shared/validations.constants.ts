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
    allowedValidations: [
      "max",
      "min",
      "postiveNumber",
      "negativeNumber",
      "required",
      "unique",
    ],
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

  // useColors, labels
  boolean: {
    typeIsNotChangeAble: true,
    allowedValidations: ["required"],
  },

  // usecolors, selections
  selection: {
    allowedValidations: ["required"],
  },

  // use colors
  reference: {
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

type ValidationsBoundToType =
  | "isEmail"
  | "isUrl"
  | "isNumber"
  | "isString"
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
  | "negativeNumber"
  | "postiveNumber";

// less than other field
// not equal to other field
// requiredIf
//  isDate

const ENTITY_VALIDATION_CONFIG: Record<
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
  },
  isUrl: {
    isBoundToType: ["url"],
    message: "Invalid URL",
  },
  isNumber: {
    isBoundToType: ["number"],
  },
  isBoolean: {
    isBoundToType: ["boolean"],
  },
  required: {},
  unique: {},
  alphanumeric: {},
  postiveNumber: {},
  negativeNumber: {},
  matchOtherField: {
    input: {
      otherField: "",
    },
  },
  min: {
    input: {
      length: 3,
    },
  },
  max: {
    input: {
      length: 10,
    },
  },
  maxLength: {
    input: {
      length: 100,
    },
  },
  minLength: {
    input: {
      length: 3,
    },
  },
  regex: {
    input: {
      pattern: "",
    },
  },
};
