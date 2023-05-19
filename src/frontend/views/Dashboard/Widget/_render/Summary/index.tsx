import { ISummaryWidgetConfig } from "shared/types/dashboard";
import { ROYGBIV } from "shared/constants/colors";
import { systemIconToSVG } from "shared/constants/Icons";
import { SummaryWidget as SummaryWidgetPresentation } from "@hadmean/chromista";
import { SummaryCardWidgetSchema } from "./types";
import { getFullAndRelativeCount } from "./getFullAndRelativeCount";

interface IProps {
  config: ISummaryWidgetConfig;
  data: unknown;
}

export function SummaryWidget({ config, data }: IProps) {
  const summaryData = SummaryCardWidgetSchema.parse(data);

  const { color, icon } = config;

  const [fullCount$1, relativeCount$1, direction] = getFullAndRelativeCount(
    summaryData[0].count || 0,
    summaryData[1]?.count
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
