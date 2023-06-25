import { abbreviateNumber } from "..";

describe("abbreviateNumber", () => {
  it("should abreviate correctly", () => {
    expect(abbreviateNumber(1)).toBe("1");
    expect(abbreviateNumber(11)).toBe("11");
    expect(abbreviateNumber(111)).toBe("111");
    expect(abbreviateNumber(1111)).toBe("1.11K");
    expect(abbreviateNumber(11111)).toBe("11.1K");
    expect(abbreviateNumber(111111)).toBe("111K");
    expect(abbreviateNumber(1111111)).toBe("1.11M");
    expect(abbreviateNumber(11111111)).toBe("11.1M");
    expect(abbreviateNumber(111111111)).toBe("111M");
    expect(abbreviateNumber(1111111111)).toBe("1.11B");
    expect(abbreviateNumber(11111111111)).toBe("11.1B");
    expect(abbreviateNumber(111111111111)).toBe("111B");
    expect(abbreviateNumber(1111111111111)).toBe("1.11T");
    expect(abbreviateNumber(11111111111111)).toBe("11.1T");
    expect(abbreviateNumber(111111111111111)).toBe("111T");
  });
  it("should abreviate numbers with last zero correctly", () => {
    expect(abbreviateNumber(1)).toBe("1");
    expect(abbreviateNumber(10)).toBe("10");
    expect(abbreviateNumber(100)).toBe("100");
    expect(abbreviateNumber(1000)).toBe("1K");
    expect(abbreviateNumber(10000)).toBe("10K");
    expect(abbreviateNumber(100000)).toBe("100K");
    expect(abbreviateNumber(1000000)).toBe("1M");
    expect(abbreviateNumber(10000000)).toBe("10M");
    expect(abbreviateNumber(100000000)).toBe("100M");
    expect(abbreviateNumber(1000000000)).toBe("1B");
    expect(abbreviateNumber(10000000000)).toBe("10B");
    expect(abbreviateNumber(100000000000)).toBe("100B");
    expect(abbreviateNumber(1000000000000)).toBe("1T");
    expect(abbreviateNumber(10000000000000)).toBe("10T");
    expect(abbreviateNumber(100000000000000)).toBe("100T");
  });
});
