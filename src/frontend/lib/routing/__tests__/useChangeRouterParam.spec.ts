import { USE_ROUTER_PARAMS } from "__tests__/_/constants";

import { upsertRouterPathQueryWithValue } from "../useChangeRouterParam";

const useRouter = jest.spyOn(require("next/router"), "useRouter");

useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

describe("upsertRouterPathQueryWithValue", () => {
  it("should replace router query string by path", () => {
    expect(
      upsertRouterPathQueryWithValue("/foo/bar?key=changeme", "key", "newvalue")
    ).toBe("/foo/bar?key=newvalue");
  });

  it("should create new query key if key doesn't exist", () => {
    expect(
      upsertRouterPathQueryWithValue("/foo/bar?key=value", "newkey", "newvalue")
    ).toBe("/foo/bar?key=value&newkey=newvalue");
  });

  it("should create query paths if not query string", () => {
    expect(
      upsertRouterPathQueryWithValue("/foo/bar", "newkey", "newvalue")
    ).toBe("/foo/bar?newkey=newvalue");
  });

  it("should keep order of keys", () => {
    expect(
      upsertRouterPathQueryWithValue(
        "/foo/bar?key1=value1&key2=value2&key3=value3",
        "key2",
        "newvalue2"
      )
    ).toBe("/foo/bar?key1=value1&key2=newvalue2&key3=value3");
  });
});
