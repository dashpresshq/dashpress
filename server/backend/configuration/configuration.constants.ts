export const CONFIGURATION_KEYS: Record<
  | "hidden_model_columns"
  | "model_column_names"
  | "model_column_type"
  | "model_plural"
  | "relations_label"
  | "hidden_schemas",
  { requireEntity: boolean, defaultValue?: unknown }
> = {
  hidden_model_columns: { requireEntity: true },
  model_column_names: { requireEntity: true },
  model_column_type: { requireEntity: true },
  model_plural: { requireEntity: true },
  relations_label: { requireEntity: true },
  hidden_schemas: { requireEntity: false, defaultValue: [] },
};

type ConfigurationFormat = "json" | "number" | "string";

// Table Column settings
// Columns to hide
// Columns rename
// Additional columns
// 