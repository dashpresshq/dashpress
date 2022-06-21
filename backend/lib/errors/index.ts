import { NextApiResponse } from "next";

export class CustomError extends Error {
  code: number;
  name: string;
  constructor(code: number, name: string, message = "Action not allowed") {
    super(message);
    this.code = code;
    this.name = name;
  }
}

export class NotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(404, "BadRequestError", message);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = "Action not allowed") {
    super(401, "BadRequestError", message);
  }
}

export class BadRequestError extends CustomError {
  constructor(message = "Invalid Request") {
    super(400, "BadRequestError", message);
  }
}

export const handleResponseError = (res: NextApiResponse, error: any) => {
  if (error instanceof CustomError) {
    return res
      .status(error.code)
      .json({ message: error.message, name: error.name });
  }
  return res.status(500).json({ message: error.message });
};
