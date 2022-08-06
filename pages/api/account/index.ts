import {
  usersController,
  ICreateUser,
  IUpdateUserByCreator,
} from "backend/users/users.controller";
import { IAccountUser, AccountRole } from "backend/users/users.types";
import { IRequestValidation } from "shared/validations/makeRequestValidationRunnable";
import { requestHandler } from "../../../backend/lib/request";

const createUserRequestSchema: IRequestValidation<ICreateUser> = {
  username: {
    validations: [
      {
        validationType: "required",
      },
      {
        validationType: "alphanumeric",
      },
    ],
  },
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
  password: {
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

const deleteUserRequestSchema: IRequestValidation<
  Pick<IAccountUser, "username">
> = {
  username: {
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
  systemId: {
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
          options: createUserRequestSchema,
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
