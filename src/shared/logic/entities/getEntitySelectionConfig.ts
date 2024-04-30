import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { EntityTypesForSelection, IColorableSelection } from "shared/types/ui";
import { uniqBy } from "shared/lib/array/uniq-by";
import { msg } from "@lingui/macro";
import { i18nNoop } from "translations/fake";
import { isUseColorsFlagOn, OPTIONS_COLORS } from "./selection.utils";

export const getEntitySelectionConfig = (
  entityType: EntityTypesForSelection,
  preSelectedType: IColorableSelection[],
  enumList$1: string[]
): IColorableSelection[] => {
  switch (entityType) {
    case "boolean":
      return (
        preSelectedType ?? [
          {
            value: true,
            label: msg`Yes`,
            color: OPTIONS_COLORS[0],
          },
          {
            value: false,
            label: msg`No`,
            color: OPTIONS_COLORS[1],
          },
        ]
      );
    case "selection":
      return preSelectedType ?? [];

    case "selection-enum": {
      const preselection = preSelectedType ?? [];

      const shouldUseColor = isUseColorsFlagOn(preselection);
      const enumList = enumList$1 || [];

      return uniqBy(
        [
          ...preselection,
          ...enumList.map((enumValue, index) => ({
            value: enumValue,
            label: i18nNoop(userFriendlyCase(enumValue)),
            color: shouldUseColor
              ? OPTIONS_COLORS[index % OPTIONS_COLORS.length]
              : undefined,
          })),
        ],
        "value"
      );
    }
  }
};
