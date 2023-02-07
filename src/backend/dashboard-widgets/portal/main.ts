import { IValueLabel } from "@hadmean/chromista/dist/types";
import { userFriendlyCase } from "frontend/lib/strings";
import { nanoid } from "nanoid";
import { IWidgetConfig } from "shared/types/dashboard";
import { ROYGBIV } from "shared/constants/colors";

const DEFAULT_NUMBER_OF_SUMMARY_CARDS = 8;

const colorsList = Object.keys(ROYGBIV);

export const generatePortalDashboardWidgets = async (
  entitiesToShow: IValueLabel[],
  getEntityFirstDateFieldType: (entity: string) => Promise<string>
) => {
  const defaultWidgets: IWidgetConfig[] = await Promise.all(
    entitiesToShow
      .slice(0, DEFAULT_NUMBER_OF_SUMMARY_CARDS)
      .map(async (entity, index) => {
        const dateField = await getEntityFirstDateFieldType(entity.value);

        return {
          id: nanoid(),
          title: userFriendlyCase(`${entity.value}`),
          _type: "summary-card",
          entity: entity.value,
          queryId: "",
          color: colorsList[index % (colorsList.length - 1)],
          dateField,
          icon: `<svg
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              >
              <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="currentColor" d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>`,
        };
      })
  );

  const firstEntity = entitiesToShow[0];
  if (firstEntity) {
    defaultWidgets.push({
      id: nanoid(),
      title: userFriendlyCase(`${firstEntity.value}`),
      _type: "table",
      entity: firstEntity.value,
      queryId: "",
    });
  }

  return defaultWidgets;
};
