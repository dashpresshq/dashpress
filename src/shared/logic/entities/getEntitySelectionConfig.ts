import { userFriendlyCase } from "shared/lib/strings";
import uniqBy from "lodash/uniqBy";
import { EntityTypesForSelection, IColorableSelection } from "shared/types/ui";
import { isUseColorsFlagOn, SYSTEM_COLORS } from "./selection.utlis";

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
            label: "Yes",
            color: SYSTEM_COLORS[0],
          },
          {
            value: false,
            label: "No",
            color: SYSTEM_COLORS[1],
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
            label: userFriendlyCase(enumValue),
            color: shouldUseColor
              ? SYSTEM_COLORS[index % SYSTEM_COLORS.length]
              : undefined,
          })),
        ],
        "value"
      );
    }
  }
};
