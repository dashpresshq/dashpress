import {
  entitiesService,
  EntitiesService,
} from "backend/entities/entities.service";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { IApplicationService } from "backend/types";
import { IWidgetConfig } from "shared/types/dashboard";
import {
  listOrderService,
  ListOrderService,
} from "backend/list-order/list-order.service";
import { rolesService, RolesService } from "backend/roles/roles.service";
import { generatePortalDashboardWidgets } from "./portal";

export class DashboardWidgetsService implements IApplicationService {
  constructor(
    private readonly _dashboardWidgetsPersistenceService: AbstractConfigDataPersistenceService<IWidgetConfig>,
    private readonly _entitiesService: EntitiesService,
    private readonly _listOrderService: ListOrderService,
    private readonly _rolesService: RolesService
  ) {}

  async bootstrap() {
    await this._dashboardWidgetsPersistenceService.setup();
  }

  private async generateDefaultDashboardWidgets(dashboardId: string) {
    const entitiesToShow = await this._entitiesService.getActiveEntities();

    const defaultWidgets = await generatePortalDashboardWidgets(
      entitiesToShow,
      (entity) => this._entitiesService.getEntityFirstFieldType(entity, "date")
    );

    for (const widget of defaultWidgets) {
      await this._dashboardWidgetsPersistenceService.upsertItem(
        widget.id,
        widget
      );
    }

    const widgetList = defaultWidgets.map(({ id }) => id);

    await this._listOrderService.upsertOrder(dashboardId, widgetList);

    return this._listOrderService.sortByOrder(widgetList, defaultWidgets);
  }

  private async listDashboardWidgetsToShow(dashboardId: string) {
    const widgetList = await this._listOrderService.getItemOrder(dashboardId);
    if (!widgetList || widgetList.length === 0) {
      return await this.generateDefaultDashboardWidgets(dashboardId);
    }

    const widgets =
      (await this._dashboardWidgetsPersistenceService.getAllItemsIn(
        widgetList
      )) as IWidgetConfig[];

    return this._listOrderService.sortByOrder(widgetList, widgets);
  }

  async listDashboardWidgets(
    dashboardId: string,
    userRole: string
  ): Promise<IWidgetConfig[]> {
    return await this._rolesService.filterPermittedEntities(
      userRole,
      await this.listDashboardWidgetsToShow(dashboardId),
      "entity"
    );
  }

  async createWidget(widget: IWidgetConfig, dashboardId: string) {
    await this._dashboardWidgetsPersistenceService.upsertItem(
      widget.id,
      widget
    );

    await this._listOrderService.appendToList(dashboardId, widget.id);
  }

  async updateWidgetList(dashboardId: string, widgetList: string[]) {
    await this._listOrderService.upsertOrder(dashboardId, widgetList);
  }

  async updateWidget(widgetId: string, widget: IWidgetConfig) {
    await this._dashboardWidgetsPersistenceService.upsertItem(widgetId, widget);
  }

  // TODO when disabling entities then remove the correspoding entity here
  async removeWidget(widgetId: string, dashboardId: string) {
    await this._dashboardWidgetsPersistenceService.removeItem(widgetId);

    await this._listOrderService.removeFromList(dashboardId, widgetId);
  }
}

const dashboardWidgetsPersistenceService =
  createConfigDomainPersistenceService<IWidgetConfig>("dashboard-widgets");

export const dashboardWidgetsService = new DashboardWidgetsService(
  dashboardWidgetsPersistenceService,
  entitiesService,
  listOrderService,
  rolesService
);
