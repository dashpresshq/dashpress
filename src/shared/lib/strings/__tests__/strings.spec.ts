import { arrayToComaSeparatedString, pluralize } from "..";

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

describe("arrayToComaSeparatedString", () => {
  it("should return single string for the list of one string", () => {
    expect(arrayToComaSeparatedString(["Document"])).toBe("Document");
  });

  it("should return two words, separated with `and` for the list of two strings", () => {
    expect(arrayToComaSeparatedString(["Document", "Document"])).toBe(
      "Document and Document"
    );
  });

  it("should return words, separated with `,` and the last word separated with `and`", () => {
    expect(
      arrayToComaSeparatedString(["Document", "Document", "Document"])
    ).toBe("Document, Document and Document");

    expect(
      arrayToComaSeparatedString([
        "Document",
        "Document",
        "Document",
        "Document",
      ])
    ).toBe("Document, Document, Document and Document");
  });
});
