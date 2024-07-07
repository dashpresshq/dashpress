import { msg } from "@lingui/macro";
import { fakeMessageDescriptor } from "translations/fake";

import { SPECTRUM_COLORS } from "@/components/ui/spectrum";
import { uniqBy } from "@/shared/lib/array/uniq-by";
import { userFriendlyCase } from "@/shared/lib/strings/friendly-case";
import type {
  EntityTypesForSelection,
  IColorableSelection,
} from "@/shared/types/ui";

import { isUseColorsFlagOn } from "./selection.utils";

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
            spectrum: "green",
          },
          {
            value: false,
            label: msg`No`,
            spectrum: "red",
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
            label: fakeMessageDescriptor(userFriendlyCase(enumValue)),
            spectrum: shouldUseColor
              ? SPECTRUM_COLORS[index % SPECTRUM_COLORS.length]
              : undefined,
          })),
        ],
        "value"
      );
    }
  }
};
