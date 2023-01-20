import { act } from "@testing-library/react";
import mockRouter from "next-router-mock";
import singletonRouter from "next/router";
import { renderHook } from "__tests__/lib/renderHook";
import {
  upsertRouterPathQueryWithValue,
  useChangeRouterParam,
} from "../useChangeRouterParam";

jest.mock("next/router", () => require("next-router-mock"));

describe("useChangeRouterParam", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/initial");
  });
  it("should pushes new url when called", () => {
    const { result } = renderHook(() => useChangeRouterParam("foo"));
    expect(singletonRouter.asPath).toBe("/initial");
    act(() => {
      result.current("bar");
    });
    expect(singletonRouter.asPath).toBe("/initial?foo=bar");
  });
});

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
