import { ISummaryWidgetConfig } from "shared/types/dashboard";
import { ROYGBIV } from "shared/constants/colors";
import { systemIconToSVG } from "shared/constants/Icons";
import { SummaryWidget as SummaryWidgetPresentation } from "frontend/design-system/components/Widgets/Summary";
import { SummaryCardWidgetSchema } from "./types";
import {
  getFullAndRelativeCount,
  splitSummaryCardWidgetDataToRelativeCount,
} from "./getFullAndRelativeCount";

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
      color={ROYGBIV[color]}
      title={config.title}
      icon={fullIcon}
      fullCount={fullCount$1}
      relativeCount={relativeCount$1}
      direction={direction}
    />
  );
}
