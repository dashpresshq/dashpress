export const USE_ROUTER_PARAMS =
  ({
    pushMock,
    replaceMock,
    query,
    asPath,
  }: {
    asPath?: string;
    pushMock?: any;
    replaceMock?: any;
    query?: Record<string, string>;
  }) =>
  () => {
    return {
      query,
      asPath: asPath || "/",
      push: pushMock,
      replace: replaceMock,
      isReady: true,
      locale: "en",
    };
  };
