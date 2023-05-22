import { IWidgetConfig } from "shared/types/dashboard";
import { IAccountProfile } from "shared/types/user";
import { BadRequestError } from "backend/lib/errors";
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

  async runWidgetScript(
    widgetId: string,
    currentUser: IAccountProfile,
    relativeDate: string
  ) {
    return await this._dashboardWidgetsApiService.runWidgetScript(
      widgetId,
      currentUser,
      relativeDate
    );
  }

  async runScript(
    script: string,
    currentUser: IAccountProfile,
    relativeDate: string
  ) {
    if (process.env.NEXT_PUBLIC_IS_DEMO) {
      throw new BadRequestError("Cannot run script in demo mode");
    }

    return await this._dashboardWidgetsApiService.runScript(
      script,
      currentUser,
      relativeDate
    );
  }

  async createWidget(widget: IWidgetConfig, dashboardId: string) {
    if (process.env.NEXT_PUBLIC_IS_DEMO) {
      throw new BadRequestError("Cannot create widget in demo mode");
    }

    await this._dashboardWidgetsApiService.createWidget(widget, dashboardId);
  }

  async updateWidget(widgetId: string, widget: IWidgetConfig) {
    if (process.env.NEXT_PUBLIC_IS_DEMO) {
      throw new BadRequestError("Cannot update widget in demo mode");
    }

    await this._dashboardWidgetsApiService.updateWidget(widgetId, widget);
  }

  async removeWidget(widgetId: string, dashboardId: string) {
    if (process.env.NEXT_PUBLIC_IS_DEMO) {
      throw new BadRequestError("Cannot remove widget in demo mode");
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
