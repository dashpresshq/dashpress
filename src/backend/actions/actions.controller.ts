import { IActionInstance } from "shared/types/actions";
import { ActionsApiService, actionsApiService } from "./actions.service";

export class ActionsApiController {
  constructor(private _actionsApiService: ActionsApiService) {}

  listIntegrations() {
    return this._actionsApiService.listActionIntegrations();
  }

  listIntegrationImplementations(integrationKey: string) {
    return this._actionsApiService.listIntegrationImplementations(
      integrationKey
    );
  }

  async listActivatedActions() {
    return await this._actionsApiService.listActivatedActions();
  }

  async activateAction(
    integrationKey: string,
    configuration: Record<string, string>
  ) {
    await this._actionsApiService.activateAction(integrationKey, configuration);
  }

  async showActionConfig(activationId: string) {
    return await this._actionsApiService.showActionConfig(activationId);
  }

  async updateActionConfig(
    activationId: string,
    configuration: Record<string, string>
  ) {
    await this._actionsApiService.updateActionConfig(
      activationId,
      configuration
    );
  }

  async deactivateAction(activationId: string) {
    await this._actionsApiService.deactivateAction(activationId);
  }

  async listEntityActionInstances(entity: string) {
    return await this._actionsApiService.listEntityActionInstances(entity);
  }

  async listIntegrationActionInstances(integrationKey: string) {
    return await this._actionsApiService.listIntegrationActions(integrationKey);
  }

  async deleteActionInstance(instanceId: string) {
    await this._actionsApiService.deleteActionInstance(instanceId);
  }

  async updateActionInstance(instanceId: string, action: IActionInstance) {
    await this._actionsApiService.updateActionInstance(instanceId, action);
  }

  async instantiateAction(action: Omit<IActionInstance, "instanceId">) {
    await this._actionsApiService.instantiateAction(action);
  }
}

export const actionsApiController = new ActionsApiController(actionsApiService);
