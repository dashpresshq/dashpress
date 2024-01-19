import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { IApplicationService } from "backend/types";
import { nanoid } from "nanoid";
import { IFormAction } from "shared/types/actions";

export class FormActionsApiService implements IApplicationService {
  constructor(
    private readonly _formActionsPersistenceService: AbstractConfigDataPersistenceService<IFormAction>
  ) {}

  async bootstrap() {
    await this._formActionsPersistenceService.setup();
  }

  async createFormAction(action: Omit<IFormAction, "id">) {
    const id = nanoid();

    await this._formActionsPersistenceService.createItem(id, {
      ...action,
      id,
    });
  }

  async updateFormAction(id: string, formAction: Omit<IFormAction, "id">) {
    await this._formActionsPersistenceService.upsertItem(id, {
      ...formAction,
      id,
    });
  }

  async deleteFormAction(formActionId: string) {
    await this._formActionsPersistenceService.removeItem(formActionId);
  }

  async getAllFormAction() {
    return await this._formActionsPersistenceService.getAllItems();
  }

  async listEntityFormActions(entity$1: string) {
    return (await this._formActionsPersistenceService.getAllItems()).filter(
      ({ entity }) => entity === entity$1
    );
  }
}

const formActionsPersistenceService =
  createConfigDomainPersistenceService<IFormAction>("form-actions");

export const formActionsApiService = new FormActionsApiService(
  formActionsPersistenceService
);
