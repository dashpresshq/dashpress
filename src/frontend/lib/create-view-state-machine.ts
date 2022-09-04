type ViewState =
  | { type: "loading" }
  | { type: "render" }
  | { type: "error"; message: unknown };

export const createViewStateMachine = (
  isLoading: boolean,
  error: unknown
): ViewState => {
  if (isLoading) {
    return { type: "loading" };
  }

  if (error) {
    return { type: "error", message: error };
  }
  return { type: "render" };
};
