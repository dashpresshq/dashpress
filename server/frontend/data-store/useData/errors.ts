export class NotFoundError extends Error {
  constructor(message = "Resource Not Found") {
    super(message);
    this.name = "NotFoundError";
  }
}
