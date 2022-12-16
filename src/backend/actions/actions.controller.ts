import { BadRequestError } from "backend/lib/errors";
import { usersService, UsersService } from "backend/users/users.service";
import { IActionInstance } from "shared/types/actions";
import { ActionsService, actionsService } from "./actions.service";

export class ActionsController {
  constructor(
    private _actionsService: ActionsService,
    private _usersService: UsersService
  ) {}

  listIntegrations() {
    return this._actionsService.listActionIntegrations();
  }

  listIntegrationImplementations(integrationKey: string) {
    return this._actionsService.listIntegrationImplementations(integrationKey);
  }

  async listActivatedActions() {
    return await this._actionsService.listActivatedActions();
  }

  async activateAction(
    integrationKey: string,
    configuration: Record<string, string>
  ) {
    await this._actionsService.activateAction(integrationKey, configuration);
  }

  async showActionConfig(
    activationId: string,
    user: {
      username: string;
      password: string;
    }
  ) {
    try {
      await this._usersService.checkUserPassword(user);
    } catch (error) {
      throw new BadRequestError("Invalid Password");
    }
    return await this._actionsService.showActionConfig(activationId);
  }

  async updateActionConfig(
    activationId: string,
    configuration: Record<string, string>
  ) {
    await this._actionsService.updateActionConfig(activationId, configuration);
  }

  async deactivateAction(activationId: string) {
    await this._actionsService.deactivateAction(activationId);
  }

  async listEntityActionInstances(entity: string) {
    return await this._actionsService.listEntityActionInstances(entity);
  }

  async listIntegrationActionInstances(integrationKey: string) {
    return await this._actionsService.listIntegrationActions(integrationKey);
  }

  async deleteActionInstance(instanceId: string) {
    await this._actionsService.deleteActionInstance(instanceId);
  }

  async updateActionInstance(instanceId: string, action: IActionInstance) {
    await this._actionsService.updateActionInstance(instanceId, action);
  }

  async instantiateAction(action: Omit<IActionInstance, "instanceId">) {
    await this._actionsService.instantiateAction(action);
  }
}

export const actionsController = new ActionsController(
  actionsService,
  usersService
);
