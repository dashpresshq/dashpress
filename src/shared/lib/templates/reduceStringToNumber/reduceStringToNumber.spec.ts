import { reduceStringToNumber } from ".";

describe("reduceStringToNumber", () => {
  it("should return determinitic values", () => {
    expect(reduceStringToNumber("foo")).toBe(reduceStringToNumber("foo"));
    expect(reduceStringToNumber("foo")).not.toBe(reduceStringToNumber("bar"));
  });
  it("should return determinitic values regardless of case", () => {
    expect(reduceStringToNumber("foo")).toBe(reduceStringToNumber("FOO"));
    expect(reduceStringToNumber("foo")).toBe(reduceStringToNumber("fOO"));
  });
  it("should return determinitic values regardless of order", () => {
    expect(reduceStringToNumber("ofo")).toBe(reduceStringToNumber("foo"));
    expect(reduceStringToNumber("oof")).toBe(reduceStringToNumber("foo"));
  });
  it("should return determinitic regardless of special characters", () => {
    expect(reduceStringToNumber("foo**")).toBe(reduceStringToNumber("foo"));
    expect(reduceStringToNumber("*fo*o")).toBe(reduceStringToNumber("foo"));
    expect(reduceStringToNumber(" fo o")).toBe(reduceStringToNumber("foo"));
  });
  it("should return value", () => {
    expect(reduceStringToNumber("foo")).toBe(33);
    expect(reduceStringToNumber("foo**")).toBe(33);
    expect(reduceStringToNumber("I am you")).toBe(78);
    expect(reduceStringToNumber("some very very very long charecters")).toBe(
      380
    );
    expect(reduceStringToNumber("a")).toBe(0);
    expect(reduceStringToNumber("z")).toBe(25);
  });
});
