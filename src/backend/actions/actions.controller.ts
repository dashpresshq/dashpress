import { IActionsToTrigger } from "shared/types/actions";
import { ActionsService, actionsService } from "./actions.service";

export class ActionsController {
  constructor(private _actionsService: ActionsService) {}

  listAllActions() {
    return this._actionsService.listAllActions();
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

  async updateActionConfig(
    activationId: string,
    configuration: Record<string, string>
  ) {
    await this._actionsService.updateActionConfig(activationId, configuration);
  }

  async deactivateAction(activationId: string) {
    await this._actionsService.deactivateAction(activationId);
  }

  //

  async listEntityActions(entity: string) {
    await this._actionsService.listEntityActions(entity);
  }

  async deRegisterAction(triggerId: string) {
    await this._actionsService.deRegisterAction(triggerId);
  }

  async updateTriggerAction(triggerId: string, action: IActionsToTrigger) {
    await this._actionsService.updateTriggerAction(triggerId, action);
  }

  async registerAction(
    entity: string,
    action: Omit<IActionsToTrigger, "triggerId">
  ) {
    await this._actionsService.registerAction(entity, action);
  }
}

export const actionsController = new ActionsController(actionsService);
