import { IWidgetConfig } from "shared/types/dashboard";
import {
  DashboardWidgetsService,
  dashboardWidgetsService,
} from "./dashboard-widgets.service";

export class DashboardWidgetsController {
  constructor(private _dashboardWidgetsService: DashboardWidgetsService) {}

  async listDashboardWidgets(dashboardId: string) {
    return await this._dashboardWidgetsService.listDashboardWidgets(
      dashboardId
    );
  }

  async createWidget(widget: IWidgetConfig, dashboardId: string) {
    await this._dashboardWidgetsService.createWidget(widget, dashboardId);
  }

  async updateWidgetList(dashboardId: string, widgetList: string[]) {
    await this._dashboardWidgetsService.updateWidgetList(
      dashboardId,
      widgetList
    );
  }

  async updateWidget(widgetId: string, widget: IWidgetConfig) {
    await this._dashboardWidgetsService.updateWidget(widgetId, widget);
  }

  async removeWidget(widgetId: string, dashboardId: string) {
    await this._dashboardWidgetsService.removeWidget(widgetId, dashboardId);
  }
}

export const dashboardWidgetsController = new DashboardWidgetsController(
  dashboardWidgetsService
);
