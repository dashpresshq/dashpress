import { pluralize } from "..";

describe("pluralize", () => {
  it("should work correctly with singular forms", () => {
    expect(pluralize({ count: 1, singular: "boy" })).toBe("boy");
    expect(pluralize({ count: 2, singular: "boy" })).toBe("boys");
    expect(pluralize({ count: 0, singular: "boy" })).toBe("boys");
  });

  it("should work correctly with plural forms", () => {
    expect(
      pluralize({
        count: 1,
        singular: "complexity",
        plural: "complexities",
      })
    ).toBe("complexity");
    expect(
      pluralize({
        count: 2,
        singular: "complexity",
        plural: "complexities",
      })
    ).toBe("complexities");
    expect(
      pluralize({
        count: 0,
        singular: "complexity",
        plural: "complexities",
      })
    ).toBe("complexities");
  });

  it("should work correctly inclusive marker", () => {
    expect(
      pluralize({
        count: 1,
        singular: "complexity",
        plural: "complexities",
        inclusive: true,
      })
    ).toBe("1 complexity");
    expect(
      pluralize({
        count: 2,
        singular: "complexity",
        plural: "complexities",
        inclusive: true,
      })
    ).toBe("2 complexities");
    expect(
      pluralize({
        count: 0,
        singular: "complexity",
        plural: "complexities",
        inclusive: true,
      })
    ).toBe("0 complexities");
  });
});
