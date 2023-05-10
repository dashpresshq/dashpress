import { IWidgetConfig } from "shared/types/dashboard";
import { IAccountProfile } from "shared/types/user";
import {
  DashboardWidgetsApiService,
  dashboardWidgetsApiService,
} from "./dashboard-widgets.service";

export class DashboardWidgetsApiController {
  constructor(
    private _dashboardWidgetsApiService: DashboardWidgetsApiService
  ) {}

  async listDashboardWidgets(dashboardId: string, userRole: string) {
    return await this._dashboardWidgetsApiService.listDashboardWidgets(
      dashboardId,
      userRole
    );
  }

  async runWidgetScript(widgetId: string, currentUser: IAccountProfile) {
    return await this._dashboardWidgetsApiService.runWidgetScript(
      widgetId,
      currentUser
    );
  }

  async runScript(script: string, currentUser: IAccountProfile) {
    return await this._dashboardWidgetsApiService.runScript(
      script,
      currentUser
    );
  }

  async createWidget(widget: IWidgetConfig, dashboardId: string) {
    await this._dashboardWidgetsApiService.createWidget(widget, dashboardId);
  }

  async updateWidgetList(dashboardId: string, widgetList: string[]) {
    await this._dashboardWidgetsApiService.updateWidgetList(
      dashboardId,
      widgetList
    );
  }

  async updateWidget(widgetId: string, widget: IWidgetConfig) {
    await this._dashboardWidgetsApiService.updateWidget(widgetId, widget);
  }

  async removeWidget(widgetId: string, dashboardId: string) {
    await this._dashboardWidgetsApiService.removeWidget(widgetId, dashboardId);
  }
}

export const dashboardWidgetsApiController = new DashboardWidgetsApiController(
  dashboardWidgetsApiService
);
