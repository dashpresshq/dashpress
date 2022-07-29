import {
  usersController,
  ICreateUser,
  IUpdateUserByCreator,
} from "backend/users/users.controller";
import { IUser, UserRole } from "backend/users/users.types";
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
          options: Object.values(UserRole),
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

const deleteUserRequestSchema: IRequestValidation<Pick<IUser, "username">> = {
  username: {
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

const patchUserRequestSchema: IRequestValidation<
  Pick<IUser, "username"> & IUpdateUserByCreator
> = {
  username: {
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
          options: Object.values(UserRole),
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
        (validatedRequest.requestBody as IUser).username
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
        (validatedRequest.requestBody as IUser).username,
        validatedRequest.requestBody as IUser
      );
    },
  },
  [
    {
      _type: "isCreator",
    },
  ]
);
