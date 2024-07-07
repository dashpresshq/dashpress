import { i18n } from "@lingui/core";
import { msg } from "@lingui/macro";
import { format } from "date-fns";
import Image from "next/image";

import { SoftButton } from "@/components/app/button/soft";
import type { IColorableSelection } from "@/shared/types/ui";
import type { FormFieldTypes } from "@/shared/validations/types";

import { OptionTag } from "./OptionTag";
import type { ReferenceDisplayFromTypes } from "./ReferenceComponent";
import { ReferenceComponent } from "./ReferenceComponent";

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
      <Image
        src={value as string}
        alt={fieldName}
        width={options.displayFrom === "table" ? "48" : undefined}
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
      if (availableOption.spectrum) {
        return (
          <OptionTag
            spectrum={availableOption.spectrum}
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
