import { sortByList } from "../utils";

describe("Sort By List", () => {
  it("should sort list by provided key", () => {
    const list = [{ name: "Foo" }, { name: "Boo" }];
    sortByList(list, ["Boo", "Foo"], "name");

    expect(list).toMatchInlineSnapshot(`
      [
        {
          "name": "Boo",
        },
        {
          "name": "Foo",
        },
      ]
    `);
  });

  it("should send the items not in the sortlist to the end", () => {
    const list = [
      { name: "Be Last" },
      { name: "Foo" },
      { name: "Boo" },
      { name: "Be Last Last" },
    ];
    sortByList(list, ["Boo", "Foo"], "name");

    expect(list).toMatchInlineSnapshot(`
      [
        {
          "name": "Boo",
        },
        {
          "name": "Foo",
        },
        {
          "name": "Be Last",
        },
        {
          "name": "Be Last Last",
        },
      ]
    `);
  });

  it("should ignore items not in list but in the sort list", () => {
    const list = [{ name: "Foo" }, { name: "Boo" }];
    sortByList(list, ["Boo", "Foo", "no damage be done"], "name");

    expect(list).toMatchInlineSnapshot(`
      [
        {
          "name": "Boo",
        },
        {
          "name": "Foo",
        },
      ]
    `);
  });

  it("should sort large list", () => {
    const list = [
      { name: "B" },
      { name: "A" },
      { name: "F" },
      { name: "C" },
      { name: "E" },
      { name: "G" },
      { name: "D" },
    ];
    sortByList(list, ["A", "B", "C", "D", "E", "F", "G"], "name");

    expect(list).toMatchInlineSnapshot(`
      [
        {
          "name": "A",
        },
        {
          "name": "B",
        },
        {
          "name": "C",
        },
        {
          "name": "D",
        },
        {
          "name": "E",
        },
        {
          "name": "F",
        },
        {
          "name": "G",
        },
      ]
    `);
  });

  it("should not break on empty input", () => {
    const list = [];
    sortByList(list, ["Boo", "Foo"], "name");

    expect(list).toHaveLength(0);
  });

  it("should leave input untouched on empty sort list", () => {
    const list = [{ name: "Foo" }, { name: "Boo" }];
    sortByList(list, [], "name");

    expect(list).toMatchInlineSnapshot(`
      [
        {
          "name": "Foo",
        },
        {
          "name": "Boo",
        },
      ]
    `);
  });
});
