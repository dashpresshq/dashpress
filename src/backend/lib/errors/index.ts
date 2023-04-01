/* eslint max-classes-per-file: ["error", 5] */
import { NextApiRequest } from "next";

export class CustomError extends Error {
  code: number;

  errorCode?: string;

  validations?: Record<string, unknown>;

  name: string;

  constructor(
    code: number,
    name: string,
    message = "An Error Occurred",
    errorCode: string = undefined
  ) {
    super(message);
    this.code = code;
    this.name = name;
    this.errorCode = errorCode;
  }
}

export class NotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(404, "NotFoundError", message);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = "Access to resource is denied", errorCode = "") {
    super(401, "ForbiddenError", message, errorCode);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string, validations?: Record<string, unknown>) {
    super(400, "BadRequestError", message);
    this.validations = validations;
  }
}

export function progammingError(errorMessage: string, throwWhen: boolean) {
  if (throwWhen) {
    throw new Error(errorMessage);
  }
}

export const handleResponseError = (req: NextApiRequest, error: any) => {
  const baseErrorOptions = {
    path: req.url,
    method: req.method,
  };
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  if (error instanceof CustomError) {
    return {
      message: error.message,
      statusCode: error.code,
      name: error.name,
      errorCode: error.errorCode,
      validations: error?.validations,
      ...baseErrorOptions,
    };
  }
  return {
    message: error.message,
    statusCode: 500,
    ...baseErrorOptions,
  };
};
