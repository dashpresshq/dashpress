import type { AbstractConfigDataPersistenceService } from "backend/lib/config-persistence";
import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import { nanoid } from "nanoid";
import type { IFormAction } from "shared/types/actions";

export class FormActionsApiService {
  constructor(
    private readonly _formActionsPersistenceService: AbstractConfigDataPersistenceService<IFormAction>
  ) {}

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
