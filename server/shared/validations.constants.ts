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
  {}
> = {
  email: {},
  password: {},
  text: {},
  textarea: {},

  richtext: {},
  url: {},
  number: {},
  'datetime-local': {},
  image: {},
  color: {},

// Needs context
  boolean: {}, // useColors, labels
  selection: {}, // usecolors, selections
  reference: {},
};


//   | 'date'
//   | 'file'
//   | 'range'
//   | 'tel'
//   | 'time'

//   | 'month'
//   | 'week'