export const CONFIGURATION_KEYS: Record<
  | "hidden_entity_table_columns" //
  | "hidden_entity_create_columns" //
  | "hidden_entity_update_columns" //
  | "hidden_entity_details_columns" //
  | "entity_diction" //
  | "entity_columns_types" // 
  | "entity_crud_settings" //
  | "relations_list_fields"
  | "entity_columns_labels"
  | "entity_validations"
  | "entities_to_hide_from_menu",
  { requireEntity: boolean; defaultValue: unknown }
> = {
  hidden_entity_table_columns: { requireEntity: true, defaultValue: [] },
  hidden_entity_create_columns: { requireEntity: true, defaultValue: [] },
  hidden_entity_update_columns: { requireEntity: true, defaultValue: [] },
  hidden_entity_details_columns: { requireEntity: true, defaultValue: [] },
  entity_columns_labels: { requireEntity: true, defaultValue: {} },
  entity_columns_types: { requireEntity: true, defaultValue: {} },
  entity_diction: {
    requireEntity: true,
    defaultValue: { singular: "", plural: "" },
  },
  entity_crud_settings: {
    requireEntity: true,
    defaultValue: {
      create: true,
      details: true,
      table: true,
      update: true,
      delete: true,
    },
  },
  entity_validations: {
    requireEntity: true,
    defaultValue: {}, // {key: []}
  },
  relations_list_fields: { requireEntity: true, defaultValue: [] },

  entities_to_hide_from_menu: { requireEntity: false, defaultValue: [] },
};

// Plugin System

/*

// Clone

   Override label,
   // defaultValue

  // id column

Table Settings => 
  add columns,
  default sorting, 

// Filter Tables and / or 

Creator mode
User mode
*/

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
  //   }
  // ]
  // } }, // {key: label}