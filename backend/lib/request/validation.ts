import { validateConfigKeyFromRequest } from "backend/configuration/configuration.validations";
import {
  validateEntityFromRequest,
  validateEntityIdFromRequest,
} from "backend/entities/entities.validations";
import { method } from "lodash";
import { NextApiRequest } from "next";
import qs from "qs";
import { ForbiddenError } from "../errors";
import { RequestMethod } from "./methods";

export type ValidationKeys = {
  _type:
    | "is_authenticated"
    | "is_developer"
    | "entity"
    | "config_key"
    | "pagination_filter"
    | "can_crud"
    | "request_body"
    | "entity_id"
    | "query_filters"
    | "config_body";
  method?: RequestMethod[];
};

export const ValidationImpl: Record<
  ValidationKeys["_type"],
  (req: NextApiRequest) => Promise<unknown>
> = {
  is_authenticated: async (req) => {
    return true;
  },
  query_filters: async (req) => {
    const filters = (qs.parse(
      Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
    )?.filters || []) as unknown as QueryFilter[];

    await this._entitiesService.validateEntityFields(
      entity,
      filters.map(({ id }) => id)
    );
    return filters;
  },
  is_developer: async (req) => {
    return true;
  },
  entity_id: async (req) => {
    return validateEntityIdFromRequest(req.query);
  },
  entity: async (req) => {
    const entity = validateEntityFromRequest(req.query); // TODO && canCrud;

    const disabledEntities = await _configurationService.show<string[]>(
      "disabled_entities"
    );
    if (disabledEntities.includes(entity)) {
      throw new ForbiddenError("Entity is disabled");
    }
  },
  can_crud: async (req) => {
    if (method === "DELETE") {
      action = "delete";
    }
    if (method === "POST") {
      action = "create";
    }
    if (method === "PATCH") {
      action = "update";
    }
    if (method === "GET") {
      action = "details";
    }
    const doCanAction = async () => {
      return (
        await _configurationService.show<IEntityCrudSettings>(
          "entity_crud_settings",
          entity
        )
      )[action];
    };

    const [canAction] = await Promise.all([doCanAction()]);

    if (!canAction) {
      throw new ForbiddenError();
    }
  },
  pagination_filter: async (req) => {
    const take = Number(req.query.take) || 10;
    const page = Number(req.query.page) || 1;
    const orderBy =
      (req.query.orderBy as string)?.toLowerCase() === "desc" ? "desc" : "asc";

      _entitiesService.validateEntityField(entity, req.query.sortBy),

    return {
      take,
      page,
      orderBy,
      sortBy,
    };
  },
  config_key: async (req) => {
    return validateConfigKeyFromRequest(req.query);
  },
  config_body: async (req) => {
    return req.body.data;
  },
  request_body: async (req) => {
    await this._entitiesService.validateEntityFields(entity, Object.keys(data));
    return req.body.data;
  },
};
