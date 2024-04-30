import { objectToQueryParams } from "../queryObjectToQueryString";

describe("queryObjectToQueryString", () => {
  it("should serialize multiple keys object correctly", () => {
    expect(objectToQueryParams({ foo: "foo-value", bar: "bar-value" })).toBe(
      "?foo=foo-value&bar=bar-value"
    );
  });

  it("should serialize single key object correctly", () => {
    expect(objectToQueryParams({ foo: "foo-value" })).toBe("?foo=foo-value");
  });

  it("should not prefix when asked to", () => {
    expect(objectToQueryParams({ foo: "foo-value" }, false)).toBe(
      "foo=foo-value"
    );
  });

  it("should ignore falsy values", () => {
    expect(
      objectToQueryParams({
        foo: "foo-value",
        null: null,
        empty: "",
        notDefined: undefined,
      })
    ).toBe("?foo=foo-value");
  });

  it("should serialize array values correctly", () => {
    expect(
      objectToQueryParams({
        foo: "foo-value",
        bar: ["bar-1", "bar-2", "bar-3"],
      })
    ).toBe("?foo=foo-value&bar=bar-1&bar=bar-2&bar=bar-3");
  });

  it("should handle empty input safely", () => {
    expect(objectToQueryParams({})).toBe("");
    expect(objectToQueryParams()).toBe("");
  });
});
