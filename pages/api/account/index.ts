import {
  usersController,
  IUpdateUserByCreator,
} from "backend/users/users.controller";
import { CREATE_USER_FORM_SCHEMA } from "shared/form-schemas/users/create";
import { IAccountUser, AccountRole } from "shared/types";
import { IRequestValidation } from "shared/validations/makeRequestValidationRunnable";
import { requestHandler } from "../../../backend/lib/request";

const deleteUserRequestSchema: IRequestValidation<
  Pick<IAccountUser, "username">
> = {
  username: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

const patchUserRequestSchema: IRequestValidation<
  Pick<IAccountUser, "name"> & IUpdateUserByCreator
> = {
  name: {
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  role: {
    validations: [
      {
        validationType: "required",
      },
      {
        validationType: "isIn",
        constraint: {
          options: Object.values(AccountRole),
        },
      },
    ],
  },
  systemProfile: {
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export default requestHandler(
  {
    GET: async () => {
      return await usersController.listUsers();
    },

    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: CREATE_USER_FORM_SCHEMA,
        },
      ]);
      return await usersController.createUser(validatedRequest.requestBody);
    },
    DELETE: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: deleteUserRequestSchema,
        },
      ]);
      return await usersController.removeUser(
        (validatedRequest.requestBody as IAccountUser).username
      );
    },
    PATCH: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: patchUserRequestSchema,
        },
      ]);
      return await usersController.updateProfile(
        (validatedRequest.requestBody as IAccountUser).username,
        validatedRequest.requestBody as IAccountUser
      );
    },
  },
  [
    {
      _type: "isCreator",
    },
  ]
);
