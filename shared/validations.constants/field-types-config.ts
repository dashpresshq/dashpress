import { TableFilterType } from "@gothicgeeks/design-system/dist/components/Table/filters/types";
import noop from "lodash/noop";
import { SelectableAbleValidations } from "./types";

// less than other field
// not equal to other field
// requiredIf

export const FIELD_TYPES_CONFIG_MAP: Record<
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
    ],
  },
  textarea: {
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
    allowedValidations: ["max", "min", "postiveNumber", "required", "unique"],
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
      _type: "number", // TODO _type: "date"
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
      _type: "status",
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
    allowedValidations: ["required", "maxLength"],
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
    allowedValidations: ["required"],
    configureSelection: true,
  },

  reference: {
    // use color
    tableFilterType: {
      _type: "list",
      bag: {
        onChange: () => noop("foo"),
        selections: [],
      },
    },
    sortable: true,
    typeIsNotChangeAble: true,
    allowedValidations: ["required", "unique"],
    configureSelection: true,
  },
};

//   | 'date'
//   | 'file'
//   | 'range'
//   | 'tel'
//   | 'time'

//   | 'month'
//   | 'week'
