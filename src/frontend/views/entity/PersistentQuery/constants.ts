import { FilterOperators } from "shared/types/data";

export const FILTER_OPERATOR_CONFIG: Record<
  FilterOperators,
  {
    label: string;
    numberOfInput: number;
    placeholder?: string;
    disabled?: true;
  }
> = {
  [FilterOperators.EQUAL_TO]: {
    label: "Equal",
    numberOfInput: 1,
  },
  [FilterOperators.NOT_EQUAL]: {
    label: "Not Equal",
    numberOfInput: 1,
  },
  [FilterOperators.GREATER_THAN]: {
    label: "Greater Than",
    numberOfInput: 1,
  },
  [FilterOperators.LESS_THAN]: {
    label: "Less Than",
    numberOfInput: 1,
  },
  [FilterOperators.CONTAINS]: {
    label: "Contains",
    numberOfInput: 1,
  },
  [FilterOperators.IS_NULL]: {
    label: "Is Null",
    numberOfInput: 0,
  },
  [FilterOperators.IS_NOT_NULL]: {
    label: "Is Not Null",
    numberOfInput: 0,
  },
  [FilterOperators.IN]: {
    label: "Is In",
    numberOfInput: 1,
    placeholder: "Comma seperated values",
  },
  [FilterOperators.NOT_IN]: {
    label: "Is Not In",
    numberOfInput: 1,
    placeholder: "Comma seperated values",
  },
  //
  [FilterOperators.BETWEEN]: {
    label: "N/A",
    numberOfInput: 2,
    disabled: true,
  },
  [FilterOperators.DATE]: {
    label: "N/A",
    numberOfInput: 1,
    disabled: true,
  },
};
