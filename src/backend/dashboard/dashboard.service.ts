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
import { IDashboardConfig } from "./dashboard.types";

const HOME_KEY = "__home__";

export class DashboardService implements IApplicationService {
  constructor(
    private readonly _dashboardPersistenceService: AbstractConfigDataPersistenceService<
      IDashboardConfig | string[]
    >,
    private readonly _entitiesService: EntitiesService
  ) {}

  async bootstrap() {
    await this._dashboardPersistenceService.setup();
  }

  private async getDashboardItems(dashboardId: string): Promise<string[]> {
    return (await this._dashboardPersistenceService.getItem(
      dashboardId
    )) as string[];
  }

  private buildDashboardItems(
    list: string[],
    configs: IDashboardConfig[]
  ): IDashboardConfig[] {
    const dashboardItemsMap = Object.fromEntries(
      configs.map((item) => [item.id, item])
    );

    return list.map((item) => dashboardItemsMap[item]);
  }

  private async generateDefaultDashboardItems() {
    const entities = await this._entitiesService.getAllEntities();

    const defaultDashboardItems: IDashboardConfig[] = entities.map((entity) => {
      return {
        id: nanoid(),
        title: userFriendlyCase(`Foo ${entity.value}`),
        config: {
          _type: "summary-card",
          model: entity.value,
          statusIndicator: {
            field: "createdAt",
            period: "month",
          },
        },
      };
    });

    await Promise.all(
      defaultDashboardItems.map((config) =>
        this._dashboardPersistenceService.upsertItem(config.id, config)
      )
    );

    const dashboardList = defaultDashboardItems.map(({ id }) => id);

    await this._dashboardPersistenceService.upsertItem(HOME_KEY, dashboardList);

    return this.buildDashboardItems(dashboardList, defaultDashboardItems);
  }

  async listDashboardItems(dashboardId: string): Promise<IDashboardConfig[]> {
    const itemsList = await this.getDashboardItems(dashboardId);
    if (!itemsList) {
      if (dashboardId !== HOME_KEY) {
        return [];
      }
      return await this.generateDefaultDashboardItems();
    }

    const dashboardItems =
      (await this._dashboardPersistenceService.getAllItemsIn(
        itemsList
      )) as IDashboardConfig[];

    return this.buildDashboardItems(itemsList, dashboardItems);
  }

  async createDashboardItem(config: IDashboardConfig, dashboardId: string) {
    await this._dashboardPersistenceService.upsertItem(config.id, config);

    const itemsList = await this.getDashboardItems(dashboardId);

    await this._dashboardPersistenceService.upsertItem(dashboardId, [
      ...itemsList,
      config.id,
    ]);
  }

  async updateDashboardList(dashboardId: string, dasboardItemsList: string[]) {
    await this._dashboardPersistenceService.upsertItem(
      dashboardId,
      dasboardItemsList
    );
  }

  async updateDashboardItem(dashboardItemId: string, config: IDashboardConfig) {
    await this._dashboardPersistenceService.upsertItem(dashboardItemId, config);
  }

  // TODO when disabling entities then remove the correspoding entity here
  async removeDashboardItem(dashboardItemId: string, dashboardId: string) {
    await this._dashboardPersistenceService.removeItem(dashboardItemId);

    const itemsList = await this.getDashboardItems(dashboardId);

    const newItemsList = itemsList.filter(
      (itemId) => itemId !== dashboardItemId
    );

    await this._dashboardPersistenceService.upsertItem(
      dashboardId,
      newItemsList
    );
  }
}

const dashboardPersistenceService = createConfigDomainPersistenceService<
  IDashboardConfig | string[]
>("dashboard");

export const dashboardService = new DashboardService(
  dashboardPersistenceService,
  entitiesService
);
