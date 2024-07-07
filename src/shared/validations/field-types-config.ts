import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";

import type { TableFilterType } from "@/shared/types/data";

import type { FormFieldTypes, SelectableAbleValidations } from "./types";

export const FIELD_TYPES_CONFIG_MAP: Record<
  FormFieldTypes,
  {
    tableFilterType?: TableFilterType;
    sortable: boolean;
    label: MessageDescriptor;
    typeIsNotChangeAble?: true;
    configureSelection?: true;
    allowedValidations: Array<SelectableAbleValidations>;
  }
> = {
  email: {
    sortable: true,
    label: msg`Email`,
    tableFilterType: {
      _type: "string",
      bag: undefined,
    },
    allowedValidations: ["required", "maxLength", "minLength", "regex"],
  },
  password: {
    label: msg`Password`,
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
    label: msg`Text`,
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
    label: msg`Textarea`,
    sortable: false,
    tableFilterType: {
      _type: "string",
      bag: undefined,
    },
    allowedValidations: ["maxLength", "minLength", "required"],
  },
  json: {
    label: msg`JSON`,
    sortable: false,
    tableFilterType: {
      _type: "string",
      bag: undefined,
    },
    allowedValidations: ["maxLength", "minLength", "required"],
  },
  number: {
    label: msg`Number`,
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
    label: msg`URL`,
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
    label: msg`Rich Text`,
    sortable: false,
    tableFilterType: {
      _type: "string",
      bag: undefined,
    },
    allowedValidations: ["required", "maxLength", "minLength"],
  },
  "datetime-local": {
    label: msg`Date`,
    sortable: true,
    tableFilterType: {
      _type: "date",
      bag: undefined,
    },
    typeIsNotChangeAble: true,
    allowedValidations: ["required"],
  },
  image: {
    label: msg`Image`,
    sortable: false,
    allowedValidations: ["required"],
  },
  file: {
    label: msg`File`,
    allowedValidations: ["required"],
    sortable: false,
  },
  color: {
    label: msg`Color`,
    sortable: false,
    allowedValidations: ["maxLength", "minLength", "required"],
  },

  boolean: {
    label: msg`Boolean`,
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
    label: msg`Selection`,
    tableFilterType: {
      _type: "status",
      bag: [],
    },
    sortable: true,
    allowedValidations: ["required", "maxLength", "doesntMatchOtherField"],
    configureSelection: true,
  },

  "selection-enum": {
    label: msg`Selection List`,
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
    label: msg`Reference`,
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
