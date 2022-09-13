import { DashboardService, dashboardService } from "./dashboard.service";
import { IDashboardConfig } from "./dashboard.types";

export class DashboardController {
  constructor(private _dashboardService: DashboardService) {}

  async listDashboardItems(dashboardId: string) {
    return await this._dashboardService.listDashboardItems(dashboardId);
  }

  async createDashboardItem(config: IDashboardConfig, dashboardId: string) {
    await this._dashboardService.createDashboardItem(config, dashboardId);
  }

  async updateDashboardList(
    dashboardItemId: string,
    dasboardItemsList: string[]
  ) {
    await this._dashboardService.updateDashboardList(
      dashboardItemId,
      dasboardItemsList
    );
  }

  async updateDashboardItem(dashboardItemId: string, config: IDashboardConfig) {
    await this._dashboardService.updateDashboardItem(dashboardItemId, config);
  }

  async removeDashboardItem(dashboardItemId: string, dashboardId: string) {
    await this._dashboardService.removeDashboardItem(
      dashboardItemId,
      dashboardId
    );
  }
}

export const dashboardController = new DashboardController(dashboardService);
