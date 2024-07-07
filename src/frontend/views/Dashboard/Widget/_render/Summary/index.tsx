import { systemIconToSVG } from "@/shared/constants/Icons";
import type { ISummaryWidgetConfig } from "@/shared/types/dashboard";

import {
  getFullAndRelativeCount,
  splitSummaryCardWidgetDataToRelativeCount,
} from "./getFullAndRelativeCount";
import { SummaryWidgetPresentation } from "./Presentation";
import { SummaryCardWidgetSchema } from "./types";

interface IProps {
  config: ISummaryWidgetConfig;
  data: unknown;
}

// TODO: Card Widgets: targets (for contributors)
// card percentage inverse

export function SummaryWidget({ config, data }: IProps) {
  const summaryData = SummaryCardWidgetSchema.parse(data);

  const { color, icon } = config;

  const relativeData = splitSummaryCardWidgetDataToRelativeCount(summaryData);

  const [fullCount$1, relativeCount$1, direction] = getFullAndRelativeCount(
    relativeData[0],
    relativeData[1]
  );

  const fullIcon = systemIconToSVG(icon);

  return (
    <SummaryWidgetPresentation
      color={color}
      title={config.title}
      icon={fullIcon}
      fullCount={fullCount$1}
      relativeCount={relativeCount$1}
      direction={direction}
    />
  );
}
