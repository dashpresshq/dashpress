import { getFullAndRelativeCount } from "../getFullAndRelativeCount";

describe("getFullAndRelativeCount", () => {
  it("should return `counting` for all any loading state", () => {
    expect(getFullAndRelativeCount("loading", "loading", true)).toEqual([
      "counting",
      "counting",
      "side",
    ]);
    expect(getFullAndRelativeCount(1, "loading", true)).toEqual([
      "counting",
      "counting",
      "side",
    ]);
    expect(getFullAndRelativeCount("loading", 1, true)).toEqual([
      "counting",
      "counting",
      "side",
    ]);
  });

  it("should return fullCount only when there no dateField", () => {
    expect(getFullAndRelativeCount(2, 4, false)).toEqual(["2", "", "side"]);
    expect(getFullAndRelativeCount(2, 0, false)).toEqual(["2", "", "side"]);
  });

  it("should return N/A relative count is 0", () => {
    expect(getFullAndRelativeCount(2, 0, true)).toEqual(["2", "N/A", "side"]);
  });

  it("should return correct percentage and direction", () => {
    expect(getFullAndRelativeCount(2, 2, true)).toEqual(["2", "0%", "side"]);
    expect(getFullAndRelativeCount(1, 2, true)).toEqual(["1", "50%", "down"]);
    expect(getFullAndRelativeCount(2, 1, true)).toEqual(["2", "100%", "up"]);
  });

  it("should return abbreviated full count", () => {
    expect(getFullAndRelativeCount(2333, 0, false)).toEqual([
      "2.33K",
      "",
      "side",
    ]);
  });
});
