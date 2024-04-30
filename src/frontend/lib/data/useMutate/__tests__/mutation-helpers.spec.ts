import { MutationHelpers } from "../mutation-helpers";

describe("MutationHelpers", () => {
  it("append", () => {
    const old = ["a", "b"];
    const formData = "c";
    expect(MutationHelpers.append(old, formData)).toEqual(["a", "b", "c"]);
  });

  it("remove", () => {
    const old = ["a", "b", "c"];
    const formData = "b";
    expect(MutationHelpers.remove(old, formData)).toEqual(["a", "c"]);
  });

  it("deleteByKey", () => {
    const old = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const key = "id";
    const currentDataId = "b";
    expect(MutationHelpers.deleteByKey(key)(old, currentDataId)).toEqual([
      { id: "a" },
      { id: "c" },
    ]);
  });

  it("mergeArray", () => {
    const old = ["a", "b"];
    const formData = ["c", "d"];
    expect(MutationHelpers.mergeArray(old, formData)).toEqual([
      "a",
      "b",
      "c",
      "d",
    ]);
  });

  it("mergeObject", () => {
    const old = { a: "a", b: "old" };
    const formData = { b: "b" };
    expect(MutationHelpers.mergeObject(old, formData)).toEqual({
      a: "a",
      b: "b",
    });
  });

  it("replace", () => {
    const old = "a";
    const formData = "b";
    expect(MutationHelpers.replace(old, formData)).toEqual("b");
  });

  it("update", () => {
    const old = [{ id: "a" }, { id: "b" }];
    const formData = { id: "b", data: "c" };
    expect(MutationHelpers.update(old, formData)).toEqual([
      { id: "a" },
      { id: "b", data: "c" },
    ]);
  });

  it("delete", () => {
    const old = [{ id: "a" }, { id: "b" }];
    const currentDataId = "b";
    expect(MutationHelpers.delete(old, currentDataId)).toEqual([{ id: "a" }]);
  });

  it("sortOrder", () => {
    const old = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const order = ["c", "a", "b"];
    expect(MutationHelpers.sortOrder(old, order)).toEqual([
      { id: "c" },
      { id: "a" },
      { id: "b" },
    ]);
  });

  it("removeMany", () => {
    const old = ["a", "b", "c"];
    const formData = ["b", "c"];
    expect(MutationHelpers.removeMany(old, formData)).toEqual(["a"]);
  });
});
