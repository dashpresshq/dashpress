import { sortByList } from "../utils";

describe("Sort By List", () => {
  it("should sort", () => {
    expect(
      sortByList([{ name: "Foo" }, { name: "Boo" }], ["Boo", "Foo"], "name")
    ).toMatchInlineSnapshot();
  });
});
