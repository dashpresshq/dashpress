import { ISummaryWidgetConfig } from "shared/types/dashboard";
import { ROYGBIV } from "shared/constants/colors";
import { systemIconToSVG } from "shared/constants/Icons";
// import { getFullAndRelativeCount } from "./getFullAndRelativeCount";
import { SummaryWidget as SummaryWidgetPresentation } from "@hadmean/chromista";
import { SummaryCardWidgetSchema } from "./types";

interface IProps {
  config: ISummaryWidgetConfig;
  data: unknown;
}

export function SummaryWidget({ config, data }: IProps) {
  const summaryData = SummaryCardWidgetSchema.parse(data);

  const { color, icon } = config;

  // TODO
  // const currentRelativeDay = useDashboardRelativeDayStore(
  //   (store) => store.currentRelativeDay
  // );

  //   entityViews.isLoading || !dateField
  //     ? "loading"
  //     : [
  //         ...filters,
  //         {
  //           id: dateField,
  //           value: {
  //             operator: FilterOperators.DATE,
  //             value: DATE_FILTER_VALUE.BEGINNING_OF_TIME_VALUE,
  //             value2: currentRelativeDay,
  //           },
  //         },
  //       ]
  // );

  // const [fullCount$1, relativeCount$1, direction] = getFullAndRelativeCount(
  //   count.isLoading ? "loading" : count?.data?.count || 0,
  //   relativeCount.isLoading ? "loading" : relativeCount?.data?.count || 0,
  //   !!dateField
  // );

  const fullIcon = systemIconToSVG(icon);

  return (
    <SummaryWidgetPresentation
      color={ROYGBIV[color]}
      title={config.title}
      icon={fullIcon}
      fullCount={`${summaryData[0].count}`}
      relativeCount=""
      direction="side"
      // fullCount={fullCount$1}
      // relativeCount={relativeCount$1}
      // direction={direction}
    />
  );
}
