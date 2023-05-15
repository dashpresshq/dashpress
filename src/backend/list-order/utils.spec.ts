import { sortByListOrder } from "./utils";

describe("sortByListOrder", () => {
  it("should return the same list if the order is empty", () => {
    const list = [{ id: "1" }, { id: "2" }, { id: "3" }];
    const order = [];
    expect(sortByListOrder(order, list)).toEqual(list);
  });

  it("should order the list based on the order", () => {
    const list = [{ id: "1" }, { id: "2" }, { id: "3" }];
    const order = ["3", "2", "1"];
    expect(sortByListOrder(order, list)).toEqual([
      { id: "3" },
      { id: "2" },
      { id: "1" },
    ]);
  });

  it("should append the remaining items at the end of the list", () => {
    const list = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
    const order = ["3", "2", "1"];
    expect(sortByListOrder(order, list)).toEqual([
      { id: "3" },
      { id: "2" },
      { id: "1" },
      { id: "4" },
    ]);
  });
});
