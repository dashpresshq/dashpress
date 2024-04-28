import { format } from "date-fns";
import { IColorableSelection } from "shared/types/ui";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import { msg } from "@lingui/macro";
import { FormFieldTypes } from "shared/validations/types";
import { i18n } from "@lingui/core";
import {
  ReferenceComponent,
  ReferenceDisplayFromTypes,
} from "./ReferenceComponent";
import { OptionTag } from "./OptionTag";

export const viewSpecialDataTypes = ({
  fieldName,
  value,
  entityToOneReferenceFields = {},
  entityFieldSelections = {},
  entityFieldTypes = {},
  options = {
    defaultDateFormat: "do MMM yyyy",
    displayFrom: "table",
  },
}: {
  fieldName: string;
  value: unknown;
  entityToOneReferenceFields?: Record<string, string>;
  entityFieldSelections?: {
    [k: string]: IColorableSelection[];
  };
  entityFieldTypes?: Record<string, FormFieldTypes>;
  options: {
    displayFrom: ReferenceDisplayFromTypes;
    defaultDateFormat: string;
  };
}) => {
  if (value === null || value === undefined) {
    return <span>-</span>;
  }

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

  if (entityFieldTypes[fieldName] === "file") {
    return (
      <SoftButton
        action={value as string}
        systemIcon="Download"
        label={msg`Download`}
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
    if (availableOption) {
      if (availableOption.color) {
        return (
          <OptionTag
            color={availableOption.color}
            label={availableOption.label}
            value={availableOption.value}
          />
        );
      }
      return i18n._(availableOption.label);
    }
  }
  return null;
};
