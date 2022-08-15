export const createViewStateMachine = (
  isLoading: boolean,
  error: unknown
):
  | { type: "loading" }
  | { type: "render" }
  | { type: "error"; message: unknown } => {
  if (isLoading) {
    return { type: "loading" };
  }

  if (error) {
    return { type: "error", message: error };
  }
  return { type: "render" };
};
