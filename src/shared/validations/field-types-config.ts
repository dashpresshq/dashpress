import { TableFilterType } from "@hadmean/chromista/dist/components/Table/filters/types";
import { SelectableAbleValidations } from "./types";

export const FIELD_TYPES_CONFIG_MAP: Record<
  | "email"
  | "password"
  | "text"
  | "textarea"
  | "richtext"
  | "url"
  | "number"
  | "json"
  | "selection"
  | "reference"
  | "boolean"
  | "selection-enum"
  | "file"
  | "image"
  | "datetime-local"
  | "color",
  {
    tableFilterType?: TableFilterType;
    sortable: boolean;
    typeIsNotChangeAble?: true;
    configureSelection?: true;
    allowedValidations: Array<SelectableAbleValidations>;
  }
> = {
  email: {
    sortable: true,
    tableFilterType: {
      _type: "string",
      bag: undefined,
    },
    allowedValidations: [
      "required",
      // "unique",
      "maxLength",
      "minLength",
      "regex",
    ],
  },
  password: {
    sortable: false,
    allowedValidations: [
      "matchOtherField",
      "required",
      "regex",
      "maxLength",
      "minLength",
    ],
  },
  text: {
    sortable: true,
    tableFilterType: {
      _type: "string",
      bag: undefined,
    },
    allowedValidations: [
      "alphanumeric",
      "maxLength",
      "minLength",
      "required",
      "regex",
      // "unique",
      "matchOtherField",
      "doesntMatchOtherField",
    ],
  },
  textarea: {
    sortable: false,
    tableFilterType: {
      _type: "string",
      bag: undefined,
    },
    allowedValidations: ["maxLength", "minLength", "required"],
  },
  json: {
    sortable: false,
    tableFilterType: {
      _type: "string",
      bag: undefined,
    },
    allowedValidations: ["maxLength", "minLength", "required"],
  },
  number: {
    tableFilterType: {
      _type: "number",
      bag: undefined,
    },
    sortable: true,
    typeIsNotChangeAble: true,
    allowedValidations: [
      "max",
      "min",
      "postiveNumber",
      "required",
      // "unique",
      "greaterThanOtherField",
      "lessThanOtherField",
    ],
  },
  url: {
    sortable: false,
    tableFilterType: {
      _type: "string",
      bag: undefined,
    },
    allowedValidations: [
      "maxLength",
      "minLength",
      "required",
      // "unique",
      "regex",
    ],
  },
  richtext: {
    sortable: false,
    tableFilterType: {
      _type: "string",
      bag: undefined,
    },
    allowedValidations: ["required", "maxLength", "minLength"],
  },
  "datetime-local": {
    sortable: true,
    tableFilterType: {
      _type: "date",
      bag: undefined,
    },
    typeIsNotChangeAble: true,
    allowedValidations: ["required"],
  },
  image: {
    sortable: false,
    allowedValidations: ["required"],
  },
  file: {
    allowedValidations: ["required"],
    sortable: false,
  },
  color: {
    sortable: false,
    allowedValidations: ["maxLength", "minLength", "required"],
  },

  boolean: {
    sortable: true,
    tableFilterType: {
      _type: "boolean",
      bag: [],
    },
    typeIsNotChangeAble: true,
    allowedValidations: ["required"],
    configureSelection: true,
  },

  selection: {
    tableFilterType: {
      _type: "status",
      bag: [],
    },
    sortable: true,
    allowedValidations: ["required", "maxLength", "doesntMatchOtherField"],
    configureSelection: true,
  },

  "selection-enum": {
    sortable: true,
    tableFilterType: {
      _type: "status",
      bag: [],
    },
    typeIsNotChangeAble: true,
    // Configure Selection + maybe use colors
    allowedValidations: ["required", "doesntMatchOtherField"],
    configureSelection: true,
  },

  reference: {
    // use color
    tableFilterType: {
      _type: "list",
      bag: "noop",
    },
    sortable: true,
    typeIsNotChangeAble: true,
    allowedValidations: [
      "required",
      // "unique"
    ],
  },
};

//   | 'range'
//   | 'time'
//   | 'month'
//   | 'week'
