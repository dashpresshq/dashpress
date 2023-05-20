import { getFullAndRelativeCount } from "../getFullAndRelativeCount";

describe("getFullAndRelativeCount", () => {
  it("should return empty when relative count is empty", () => {
    expect(getFullAndRelativeCount(2, undefined)).toEqual(["2", "", "side"]);
    expect(getFullAndRelativeCount(2, null)).toEqual(["2", "", "side"]);
    expect(getFullAndRelativeCount(2)).toEqual(["2", "", "side"]);
  });

  it("should return N/A relative count is 0", () => {
    expect(getFullAndRelativeCount(2, 0)).toEqual(["2", "N/A", "side"]);
    expect(getFullAndRelativeCount(2, "0")).toEqual(["2", "N/A", "side"]);
  });

  it("should return correct percentage and direction for numeric and string values", () => {
    expect(getFullAndRelativeCount(2, 2)).toEqual(["2", "0%", "side"]);
    expect(getFullAndRelativeCount(1, 2)).toEqual(["1", "50%", "down"]);
    expect(getFullAndRelativeCount(2, 1)).toEqual(["2", "100%", "up"]);

    expect(getFullAndRelativeCount("2", "2")).toEqual(["2", "0%", "side"]);
    expect(getFullAndRelativeCount("1", "2")).toEqual(["1", "50%", "down"]);
    expect(getFullAndRelativeCount("2", "1")).toEqual(["2", "100%", "up"]);
  });

  it("should return abbreviated full count", () => {
    expect(getFullAndRelativeCount(2333, 0)).toEqual(["2.33K", "N/A", "side"]);
  });
});
