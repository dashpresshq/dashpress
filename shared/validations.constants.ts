export const ENTITY_TYPES_SELECTION_BAG: Record<
  | "email"
  | "password"
  | "text"
  | "textarea"
  | "richtext"
  | "url"
  | "number"
  | "selection"
  | "reference"
  | "boolean"
  | "image"
  | "datetime-local"
  | "color",
  {
    disabled?: true;
  }
> = {
  email: {},
  password: {},
  text: {},
  textarea: {},
  number: {
    disabled: true,
  },
  url: {},

  richtext: {},
  "datetime-local": {
    disabled: true,
  },
  image: {},
  color: {},

  // Needs context
  boolean: {
    disabled: true,
  }, // useColors, labels
  selection: {}, // usecolors, selections
  reference: {
    disabled: true,
  },
};

//   | 'date'
//   | 'file'
//   | 'range'
//   | 'tel'
//   | 'time'

//   | 'month'
//   | 'week'

const ENTITY_VALIDATION_CONFIG: Record<
  "required" | "unique" | "min" | "max" | "maxLength" | "minLength" | "regex",
  {}
> = {
  required: {},
  required: {},
  required: {},
  required: {},
  required: {},
  required: {},
};

// entity_columns_labels: { requireEntity: true, defaultValue: {
//   label: string,
//   type: string,
//   validations:[
//     {
//       type: "required",
//     },
//     {
//       type: "postiveNumber",
//     },
//     {
//     },
//     {
//       type: "matchOtherField",
//       value: ""
//     },
//     {
//       type: "unique",
//     },
//     {
//       _type: "requiredIf",
//       field: "",
//     },
// alphanumeric: {},
//     {
//     _type: "regex",
//     value: "\\"
//   },
//   {
//     _type: "min",
//     value: number
//   },
//   {
//     _type: "max",
//     value: number
