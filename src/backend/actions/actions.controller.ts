import { ActionsService, actionsService } from "./actions.service";

export class ActionsController {
  constructor(private _actionsService: ActionsService) {}

  listAllActions() {
    return this._actionsService.listAllActions();
  }

  async listActiveActions() {
    return await this._actionsService.listActiveActions();
  }
}

export const actionsController = new ActionsController(actionsService);
