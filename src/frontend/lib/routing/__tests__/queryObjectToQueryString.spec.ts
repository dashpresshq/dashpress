import { queryObjectToQueryString } from "../queryObjectToQueryString";

describe("queryObjectToQueryString", () => {
  it("should serialize multiple keys object correctly", () => {
    expect(
      queryObjectToQueryString({ foo: "foo-value", bar: "bar-value" })
    ).toBe("?foo=foo-value&bar=bar-value");
  });

  it("should serialize single key object correctly", () => {
    expect(queryObjectToQueryString({ foo: "foo-value" })).toBe(
      "?foo=foo-value"
    );
  });

  it("should handle empty input safely", () => {
    expect(queryObjectToQueryString()).toBe("");
  });
});
