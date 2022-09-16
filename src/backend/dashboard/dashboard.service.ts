import {
  entitiesService,
  EntitiesService,
} from "backend/entities/entities.service";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { IApplicationService } from "backend/types";
import { nanoid } from "nanoid";
import { userFriendlyCase } from "frontend/lib/strings";
import { IWidgetConfig, HOME_DASHBOARD_KEY } from "shared/types";
import { NAVIGATION_LINKS } from "frontend/lib/routing";

export class DashboardService implements IApplicationService {
  constructor(
    private readonly _dashboardPersistenceService: AbstractConfigDataPersistenceService<
      IWidgetConfig | string[]
    >,
    private readonly _entitiesService: EntitiesService
  ) {}

  async bootstrap() {
    await this._dashboardPersistenceService.setup();
  }

  private async getDashboardWidgets(dashboardId: string): Promise<string[]> {
    return (await this._dashboardPersistenceService.getItem(
      dashboardId
    )) as string[];
  }

  private orderDashboardWidgets(
    widetsOrder: string[],
    widgets: IWidgetConfig[]
  ): IWidgetConfig[] {
    const dashboardItemsMap = Object.fromEntries(
      widgets.map((item) => [item.id, item])
    );

    return widetsOrder.map((item) => dashboardItemsMap[item]);
  }

  private async generateDefaultDashboardWidgets() {
    const entities = await this._entitiesService.getAllEntities();

    const defaultWidgets: IWidgetConfig[] = entities.map((entity) => {
      return {
        id: nanoid(),
        title: userFriendlyCase(`${entity.value}`),
        link: {
          title: "View Data",
          link: NAVIGATION_LINKS.ENTITY.TABLE(entity.value),
        },
        config: {
          _type: "summary-card",
          entity: entity.value,
          filter: [],
          statusIndicator: {
            field: "createdAt",
            period: "month",
          },
        },
      };
    });

    await this._dashboardPersistenceService.resetState("id", defaultWidgets);

    const widgetList = defaultWidgets.map(({ id }) => id);

    await this._dashboardPersistenceService.upsertItem(
      HOME_DASHBOARD_KEY,
      widgetList
    );

    return this.orderDashboardWidgets(widgetList, defaultWidgets);
  }

  async listDashboardWidgets(dashboardId: string): Promise<IWidgetConfig[]> {
    const widgetList = await this.getDashboardWidgets(dashboardId);

    if (!widgetList) {
      if (dashboardId !== HOME_DASHBOARD_KEY) {
        return [];
      }
      return await this.generateDefaultDashboardWidgets();
    }

    const widgets = (await this._dashboardPersistenceService.getAllItemsIn(
      widgetList
    )) as IWidgetConfig[];

    return this.orderDashboardWidgets(widgetList, widgets);
  }

  async createWidget(widget: IWidgetConfig, dashboardId: string) {
    await this._dashboardPersistenceService.upsertItem(widget.id, widget);

    const widgetList = await this.getDashboardWidgets(dashboardId);

    await this._dashboardPersistenceService.upsertItem(dashboardId, [
      ...widgetList,
      widget.id,
    ]);
  }

  async updateWidgetList(dashboardId: string, widgetList: string[]) {
    await this._dashboardPersistenceService.upsertItem(dashboardId, widgetList);
  }

  async updateWidget(widgetId: string, widget: IWidgetConfig) {
    await this._dashboardPersistenceService.upsertItem(widgetId, widget);
  }

  // TODO when disabling entities then remove the correspoding entity here
  async removeWidget(widgetId: string, dashboardId: string) {
    await this._dashboardPersistenceService.removeItem(widgetId);

    const widgetList = await this.getDashboardWidgets(dashboardId);

    const newWidgetList = widgetList.filter(
      (widgetId$1) => widgetId$1 !== widgetId
    );

    await this._dashboardPersistenceService.upsertItem(
      dashboardId,
      newWidgetList
    );
  }
}

const dashboardPersistenceService = createConfigDomainPersistenceService<
  IWidgetConfig | string[]
>("dashboard");

export const dashboardService = new DashboardService(
  dashboardPersistenceService,
  entitiesService
);
