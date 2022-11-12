import { format } from "date-fns";
import { IColorableSelection } from "shared/types/ui";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import {
  ReferenceComponent,
  ReferenceDisplayFromTypes,
} from "./ReferenceComponent";
import { OptionTag } from "./OptionTag";

export const viewSpecialDataTypes = (
  fieldName: string,
  value: unknown,
  entityToOneReferenceFields: Record<string, string>,
  entityFieldSelections: {
    [k: string]: IColorableSelection[];
  },
  entityFieldTypes: Record<string, keyof typeof FIELD_TYPES_CONFIG_MAP>,
  options: {
    displayFrom: ReferenceDisplayFromTypes;
    defaultDateFormat: string;
  }
) => {
  if (
    entityFieldTypes[fieldName] === "datetime-local" &&
    !Number.isNaN(Date.parse(value as string))
  ) {
    return (
      <span>
        {format(new Date(value as string), options.defaultDateFormat) as string}
      </span>
    );
  }

  if (entityFieldTypes[fieldName] === "image") {
    return (
      <img
        src={value as string}
        alt={fieldName}
        width={options.displayFrom === "table" ? "48px" : undefined}
      />
    );
  }

  if (entityToOneReferenceFields?.[fieldName]) {
    return (
      <ReferenceComponent
        entity={entityToOneReferenceFields?.[fieldName]}
        id={value as string}
        displayFrom={options.displayFrom}
      />
    );
  }

  if (entityFieldSelections[fieldName]) {
    const availableOption = entityFieldSelections[fieldName].find(
      (option) => option.value === value
    );
    if (!availableOption?.color) {
      return null;
    }
    if (availableOption) {
      return (
        <OptionTag
          color={availableOption.color}
          label={availableOption.label}
          value={availableOption.value}
        />
      );
    }
  }
  return null;
};
