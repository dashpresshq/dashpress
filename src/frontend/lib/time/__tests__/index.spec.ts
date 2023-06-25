import { formatTime } from "..";

describe("formatTime", () => {
  it("should format time", () => {
    expect(formatTime(new Date("2022-03-05"))).toEqual("March 5th, 2022");
    // expect(
    //   formatTime(new Date("2022-03-05T08:05:52+00:00"), "L")
    // ).toBe(`5th Mar 2022, 7:05 AM`);
    expect(formatTime(new Date("2022-03-05"), "G")).toEqual("5th Mar 2022");
  });
});
