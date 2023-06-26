import React from "react";
import { SYSTEM_COLORS } from "../../theme";
import { ISystemStatusForDisplay } from "../../types";
import { Badge } from "../Badge/Badge";

interface IProps {
  value: string;
  statusSelections: ISystemStatusForDisplay[];
}

export function BadgeBuilder({ value, statusSelections }: IProps) {
  const builderBagValue = statusSelections.find(
    (statusSelection) => statusSelection.value === value
  );
  if (!builderBagValue) {
    return null;
  }
  return (
    <Badge
      text={builderBagValue.label}
      color={(builderBagValue.color as keyof typeof SYSTEM_COLORS) || "info"}
    />
  );
}
