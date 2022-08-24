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
  | "image" // not inplemeneted
  | "datetime-local" // not inplemeneted
  | "color", // not inplemeneted
  {
    tableFilterType: TableFilterType | "not-filterable";
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
    },
    allowedValidations: [
      "required",
      "unique",
      "maxLength",
      "minLength",
      "regex",
    ],
  },
  password: {
    tableFilterType: "not-filterable",
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
    },
    allowedValidations: [
      "alphanumeric",
      "maxLength",
      "minLength",
      "required",
      "regex",
      "unique",
      "matchOtherField",
      "doesntMatchOtherField",
    ],
  },
  textarea: {
    sortable: false,
    tableFilterType: {
      _type: "string",
    },
    allowedValidations: ["maxLength", "minLength", "required"],
  },
  json: {
    // TODO pick this up from DB
    sortable: false,
    tableFilterType: {
      _type: "string",
    },
    allowedValidations: ["maxLength", "minLength", "required"],
  },
  number: {
    tableFilterType: {
      _type: "number",
    },
    sortable: true,
    typeIsNotChangeAble: true,
    allowedValidations: [
      "max",
      "min",
      "postiveNumber",
      "required",
      "unique",
      "greaterThanOtherField",
      "lessThanOtherField",
    ],
  },
  url: {
    sortable: false,
    tableFilterType: {
      _type: "string",
    },
    allowedValidations: [
      "maxLength",
      "minLength",
      "required",
      "unique",
      "regex",
    ],
  },
  richtext: {
    sortable: false,
    tableFilterType: {
      _type: "string",
    },
    allowedValidations: ["required", "maxLength", "minLength"],
  },
  "datetime-local": {
    sortable: true,
    tableFilterType: {
      _type: "date",
    },
    typeIsNotChangeAble: true,
    allowedValidations: ["required"],
  },
  image: {
    sortable: false,
    tableFilterType: "not-filterable",
    allowedValidations: ["maxLength", "minLength", "regex", "required"],
  },
  color: {
    sortable: false,
    tableFilterType: "not-filterable",
    allowedValidations: ["maxLength", "minLength", "required"],
  },

  boolean: {
    sortable: true,
    tableFilterType: {
      _type: "boolean",
      bag: [],
    },
    // Configure Labels + must use color
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
    // Configure Selection + maybe use colors
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
