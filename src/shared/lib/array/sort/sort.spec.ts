import { sortListByOrder } from ".";

describe("sortListByOrder", () => {
  it("should return the same list if the order is empty", () => {
    const list = [{ id: "1" }, { id: "2" }, { id: "3" }];
    const order = [];
    expect(sortListByOrder(order, list, "id")).toEqual(list);
  });

  it("should return only items in the list even if present in the order", () => {
    const list = [{ id: "1" }, { id: "3" }];
    const order = ["3", "2", "1"];
    expect(sortListByOrder(order, list, "id")).toEqual([
      { id: "3" },
      { id: "1" },
    ]);
  });

  it("should order the list based on the order", () => {
    const list = [{ id: "1" }, { id: "2" }, { id: "3" }];
    const order = ["3", "2", "1"];
    expect(sortListByOrder(order, list, "id")).toEqual([
      { id: "3" },
      { id: "2" },
      { id: "1" },
    ]);
  });

  it("should append the remaining items at the end of the list", () => {
    const list = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
    const order = ["3", "2", "1"];
    expect(sortListByOrder(order, list, "id")).toEqual([
      { id: "3" },
      { id: "2" },
      { id: "1" },
      { id: "4" },
    ]);
  });
});
