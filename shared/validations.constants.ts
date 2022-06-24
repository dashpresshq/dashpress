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
