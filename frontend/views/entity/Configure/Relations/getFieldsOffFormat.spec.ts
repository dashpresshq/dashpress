import { getFieldsOffFormat } from "./utils";

describe("getFieldsOffFormat", () => {
  it("should extract formats correctly", () => {
    expect(getFieldsOffFormat("{{name}}")).toEqual(["name"]);
    expect(getFieldsOffFormat("{{name  }}")).toEqual(["name"]);
    expect(getFieldsOffFormat("   {{    name  }}")).toEqual(["name"]);
    expect(getFieldsOffFormat("   {{    name  }} - foo")).toEqual(["name"]);
    expect(getFieldsOffFormat("   {{    name  }} - {{ age}")).toEqual(["name"]);
    expect(getFieldsOffFormat("   {{    name  }} - {{ age}} ")).toEqual([
      "name",
      "age",
    ]);
    expect(
      getFieldsOffFormat("{{ name  }} - {{ age}} / {{ gender }} ")
    ).toEqual(["name", "age", "gender"]);
  });
});
