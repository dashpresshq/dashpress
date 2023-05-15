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
    if (process.env.NEXT_PUBLIC_IS_DEMO) {
      return;
    }

    return await this._dashboardWidgetsApiService.runScript(
      script,
      currentUser
    );
  }

  async createWidget(widget: IWidgetConfig, dashboardId: string) {
    if (process.env.NEXT_PUBLIC_IS_DEMO) {
      throw new Error("Cannot create widget in demo mode");
    }

    await this._dashboardWidgetsApiService.createWidget(widget, dashboardId);
  }

  async updateWidget(widgetId: string, widget: IWidgetConfig) {
    if (process.env.NEXT_PUBLIC_IS_DEMO) {
      throw new Error("Cannot update widget in demo mode");
    }

    await this._dashboardWidgetsApiService.updateWidget(widgetId, widget);
  }

  async removeWidget(widgetId: string, dashboardId: string) {
    if (process.env.NEXT_PUBLIC_IS_DEMO) {
      throw new Error("Cannot remove widget in demo mode");
    }

    await this._dashboardWidgetsApiService.removeWidget(widgetId, dashboardId);
  }

  async updateWidgetList(dashboardId: string, widgetList: string[]) {
    await this._dashboardWidgetsApiService.updateWidgetList(
      dashboardId,
      widgetList
    );
  }
}

export const dashboardWidgetsApiController = new DashboardWidgetsApiController(
  dashboardWidgetsApiService
);
