import {
  entitiesApiService,
  EntitiesApiService,
} from "backend/entities/entities.service";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { IApplicationService } from "backend/types";
import {
  HOME_DASHBOARD_KEY,
  IWidgetConfig,
  WIDGET_SCRIPT_RELATIVE_TIME_MARKER,
} from "shared/types/dashboard";
import {
  listOrderApiService,
  ListOrderApiService,
  sortByListOrder,
} from "backend/list-order/list-order.service";
import { rolesApiService, RolesApiService } from "backend/roles/roles.service";
import { IValueLabel } from "@hadmean/chromista/dist/types";
import { userFriendlyCase } from "shared/lib/strings";
import { nanoid } from "nanoid";
import { ROYGBIV } from "shared/constants/colors";
import { SystemIconsList } from "shared/constants/Icons";
import { BadRequestError } from "backend/lib/errors";
import {
  rDBMSDataApiService,
  RDBMSDataApiService,
} from "backend/data/data-access/RDBMS";
import { GranularEntityPermissions, IAccountProfile } from "shared/types/user";
import { relativeDateNotationToActualDate } from "backend/data/data-access/time.constants";
import {
  mutateGeneratedDashboardWidgets,
  PORTAL_DASHBOARD_PERMISSION,
} from "./portal";

const runAsyncJavascriptString = async (
  javascriptString: string,
  context: Record<string, unknown>
) => {
  const AsyncFunction = async function X() {}.constructor;
  try {
    return await AsyncFunction("$", javascriptString)(context);
  } catch (error) {
    return {
      message: error.message,
      error,
      context,
      expression: javascriptString,
    };
  }
};

export class DashboardWidgetsApiService implements IApplicationService {
  constructor(
    private readonly _dashboardWidgetsPersistenceService: AbstractConfigDataPersistenceService<IWidgetConfig>,
    private readonly _entitiesApiService: EntitiesApiService,
    private readonly _listOrderApiService: ListOrderApiService,
    private readonly _rolesApiService: RolesApiService,
    private readonly _rDBMSApiDataService: RDBMSDataApiService
  ) {}

  async bootstrap() {
    await this._dashboardWidgetsPersistenceService.setup();
  }

  private getDataAccessInstance() {
    return this._rDBMSApiDataService;
  }

  async runScript(
    script$1: string,
    currentUser: IAccountProfile,
    relativeDate?: string
  ) {
    if (!script$1) {
      return "{}";
    }

    const script = script$1.replaceAll(
      `$.${WIDGET_SCRIPT_RELATIVE_TIME_MARKER}`,
      relativeDateNotationToActualDate(relativeDate).toISOString()
    );

    return (
      (await runAsyncJavascriptString(script, {
        currentUser,
        query: async (sql: string) =>
          await this.getDataAccessInstance().runQuery(sql),
      })) || "{}"
    );
  }

  async runWidgetScript(
    widgetId: string,
    currentUser: IAccountProfile,
    relativeDate: string
  ) {
    const widget = await this._dashboardWidgetsPersistenceService.getItemOrFail(
      widgetId
    );
    return await this.runScript(widget.script, currentUser, relativeDate);
  }

  private async generateDefaultDashboardWidgets(dashboardId: string) {
    const entitiesToShow = await this._entitiesApiService.getActiveEntities();

    const defaultWidgets = await mutateGeneratedDashboardWidgets(
      await this.generateDashboardWidgets(entitiesToShow),
      entitiesToShow
    );

    for (const widget of defaultWidgets) {
      await this._dashboardWidgetsPersistenceService.createItem(
        widget.id,
        widget
      );
    }

    const widgetList = defaultWidgets.map(({ id }) => id);

    await this._listOrderApiService.upsertOrder(dashboardId, widgetList);

    return defaultWidgets;
  }

  private generateDashboardWidgets = async (entitiesToShow: IValueLabel[]) => {
    const colorsList = Object.keys(ROYGBIV);

    const DEFAULT_NUMBER_OF_SUMMARY_CARDS = 8;

    const defaultWidgets: IWidgetConfig[] = await Promise.all(
      entitiesToShow
        .slice(0, DEFAULT_NUMBER_OF_SUMMARY_CARDS)
        .map(async (entity, index) => {
          const dateField =
            await this._entitiesApiService.getEntityFirstFieldType(
              entity.value,
              "date"
            );
          return {
            id: nanoid(),
            title: userFriendlyCase(`${entity.value}`),
            _type: "summary-card",
            entity: entity.value,
            color: colorsList[index % (colorsList.length - 1)],
            icon: SystemIconsList[index % (SystemIconsList.length - 1)],
            script: dateField
              ? `const actual = await $.query(\`SELECT count(*) FROM "${entity.value}"\`);
const relative = await $.query(\`SELECT count(*) FROM "${entity.value}" WHERE "${dateField}" < '$.${WIDGET_SCRIPT_RELATIVE_TIME_MARKER}'\`);

return [...actual, ...relative];
            `
              : `return await $.query('SELECT count(*) FROM "${entity.value}"')`,
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
        script: `return await $.query('SELECT * FROM "${firstEntity.value}" LIMIT 5')`,
      });
    }

    return defaultWidgets;
  };

  private async listDashboardWidgetsToShow(dashboardId: string) {
    const widgetList = await this._listOrderApiService.getItemOrder(
      dashboardId
    );
    if (widgetList.length === 0) {
      return await this.generateDefaultDashboardWidgets(dashboardId);
    }

    const widgets =
      (await this._dashboardWidgetsPersistenceService.getAllItemsIn(
        widgetList
      )) as IWidgetConfig[];

    return sortByListOrder(widgetList, widgets);
  }

  async listDashboardWidgets(
    dashboardId: string,
    userRole: string
  ): Promise<IWidgetConfig[]> {
    if (
      dashboardId !== HOME_DASHBOARD_KEY &&
      !(await this._rolesApiService.canRoleDoThis(
        userRole,
        PORTAL_DASHBOARD_PERMISSION(dashboardId, GranularEntityPermissions.Show)
      ))
    ) {
      throw new BadRequestError(
        "You can't view this dashboard or it doesn't exist"
      );
    }

    return await this.listDashboardWidgetsToShow(dashboardId);
  }

  async createWidget(widget: IWidgetConfig, dashboardId: string) {
    await this._dashboardWidgetsPersistenceService.createItem(
      widget.id,
      widget
    );

    await this._listOrderApiService.appendToList(dashboardId, widget.id);
  }

  async updateWidgetList(dashboardId: string, widgetList: string[]) {
    await this._listOrderApiService.upsertOrder(dashboardId, widgetList);
  }

  async updateWidget(widgetId: string, widget: IWidgetConfig) {
    await this._dashboardWidgetsPersistenceService.updateItem(widgetId, widget);
  }

  async removeWidget(widgetId: string, dashboardId: string) {
    await this._dashboardWidgetsPersistenceService.removeItem(widgetId);

    await this._listOrderApiService.removeFromList(dashboardId, widgetId);
  }
}

const dashboardWidgetsPersistenceService =
  createConfigDomainPersistenceService<IWidgetConfig>("dashboard-widgets");

export const dashboardWidgetsApiService = new DashboardWidgetsApiService(
  dashboardWidgetsPersistenceService,
  entitiesApiService,
  listOrderApiService,
  rolesApiService,
  rDBMSDataApiService
);
