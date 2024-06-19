import { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";
import { FilterOperators } from "shared/types/data";

export const FILTER_OPERATOR_CONFIG: Record<
  FilterOperators,
  {
    label: MessageDescriptor;
    numberOfInput: number;
    placeholder?: string;
    disabled?: true;
  }
> = {
  [FilterOperators.EQUAL_TO]: {
    label: msg`Equal`,
    numberOfInput: 1,
  },
  [FilterOperators.NOT_EQUAL]: {
    label: msg`Not Equal`,
    numberOfInput: 1,
  },
  [FilterOperators.GREATER_THAN]: {
    label: msg`Greater Than`,
    numberOfInput: 1,
  },
  [FilterOperators.LESS_THAN]: {
    label: msg`Less Than`,
    numberOfInput: 1,
  },
  [FilterOperators.CONTAINS]: {
    label: msg`Contains`,
    numberOfInput: 1,
  },
  [FilterOperators.IS_NULL]: {
    label: msg`Is Null`,
    numberOfInput: 0,
  },
  [FilterOperators.IS_NOT_NULL]: {
    label: msg`Is Not Null`,
    numberOfInput: 0,
  },
  [FilterOperators.IN]: {
    label: msg`Is In`,
    numberOfInput: 1,
    placeholder: "Comma seperated values",
  },
  [FilterOperators.NOT_IN]: {
    label: msg`Is Not In`,
    numberOfInput: 1,
    placeholder: "Comma seperated values",
  },
  [FilterOperators.BETWEEN]: {
    label: msg`Between`,
    numberOfInput: 2,
    disabled: true,
  },
  [FilterOperators.DATE]: {
    label: msg`Date`,
    numberOfInput: 1,
    disabled: true,
  },
};
