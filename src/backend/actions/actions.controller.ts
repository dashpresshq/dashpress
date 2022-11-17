import { ActionsService, actionsService } from "./actions.service";

export class ActionsController {
  constructor(private _actionsService: ActionsService) {}

  listAllActions() {
    return this._actionsService.listAllActions();
  }

  async listActivedActions() {
    return await this._actionsService.listActivedActions();
  }
}

export const actionsController = new ActionsController(actionsService);

// register
// de-register
// list
// update
