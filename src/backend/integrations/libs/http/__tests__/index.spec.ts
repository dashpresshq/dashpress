import fetchMock from "jest-fetch-mock";

import { HTTP_ACTION_INTEGRATION } from "..";

fetchMock.enableMocks();

describe("HTTP_ACTION_INTEGRATION", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should connect correctly", async () => {
    expect(await HTTP_ACTION_INTEGRATION.connect(null)).toBeUndefined();
  });

  it("should GET correctly", async () => {
    await HTTP_ACTION_INTEGRATION.performsImplementation.GET.do(null, {
      url: "/some-url",
      headers: `{"some-key":"some-value"}`,
    });

    expect(fetch).toHaveBeenCalledWith("/some-url", {
      headers: {
        "some-key": "some-value",
      },
      method: "GET",
    });
  });

  it.each([
    { action: "POST" },
    { action: "PUT" },
    { action: "DELETE" },
    { action: "PATCH" },
  ])("should $action correctly", async ({ action }) => {
    await HTTP_ACTION_INTEGRATION.performsImplementation[action].do(null, {
      url: "/some-url",
      body: `{"some-body-key":"some-body-value"}`,
      headers: `{"some-header-key":"some-header-value"}`,
    });

    expect(fetch).toHaveBeenCalledWith("/some-url", {
      headers: {
        "some-header-key": "some-header-value",
      },
      body: '{"some-body-key":"some-body-value"}',
      method: action,
    });
  });
});
