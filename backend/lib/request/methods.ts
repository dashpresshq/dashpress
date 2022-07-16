export type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export const RequestMethodResponseCode: Record<RequestMethod, number> = {
  DELETE: 204,
  GET: 200,
  PATCH: 200,
  POST: 201,
  PUT: 204,
};
