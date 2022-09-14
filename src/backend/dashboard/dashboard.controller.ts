import { DashboardService, dashboardService } from "./dashboard.service";
import { IWidgetConfig } from "./dashboard.types";

export class DashboardController {
  constructor(private _dashboardService: DashboardService) {}

  async listDashboardWidgets(dashboardId: string) {
    return await this._dashboardService.listDashboardWidgets(dashboardId);
  }

  async createWidget(widget: IWidgetConfig, dashboardId: string) {
    await this._dashboardService.createWidget(widget, dashboardId);
  }

  async updateWidgetList(dashboardId: string, widgetList: string[]) {
    await this._dashboardService.updateWidgetList(dashboardId, widgetList);
  }

  async updateWidget(widgetId: string, widget: IWidgetConfig) {
    await this._dashboardService.updateWidget(widgetId, widget);
  }

  async removeWidget(widgetId: string, dashboardId: string) {
    await this._dashboardService.removeWidget(widgetId, dashboardId);
  }
}

export const dashboardController = new DashboardController(dashboardService);
