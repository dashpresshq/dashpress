import { DATE_FILTER_VALUE } from "@hadmean/protozoa";
import { DataService } from "../data.service";

describe("dateFilterToTime", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2020-03-31T23:00:00.000Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  describe("Static", () => {
    it("should return back valid dates", () => {
      expect(DataService.dateFilterToTime("2022-09-09").toISOString()).toBe(
        "2022-09-09T00:00:00.000Z"
      );
    });
    it("should return correct value for BEGINNING_OF_TIME_VALUE", () => {
      expect(
        DataService.dateFilterToTime(DATE_FILTER_VALUE.BEGINNING_OF_TIME_VALUE)
          .toISOString()
          .substring(0, 7)
      ).toBe("1899-12");
    });
    it("should return correct value for NOW", () => {
      expect(
        DataService.dateFilterToTime(DATE_FILTER_VALUE.NOW).toISOString()
      ).toBe("2020-03-31T23:00:00.000Z");
    });
    it("should return correct value for BEGINNING_OF_YEAR", () => {
      expect(
        DataService.dateFilterToTime(DATE_FILTER_VALUE.BEGINNING_OF_YEAR)
          .toISOString()
          .substring(0, 7)
      ).toBe("2019-12");
    });
  });
  describe("Dynamic", () => {
    it("should return correct value for HOUR", () => {
      expect(
        DataService.dateFilterToTime(
          `3:${DATE_FILTER_VALUE.HOUR}`
        ).toISOString()
      ).toBe("2020-03-31T20:00:00.000Z");
    });
    it("should return correct value for DAY", () => {
      expect(
        DataService.dateFilterToTime(`3:${DATE_FILTER_VALUE.DAY}`).toISOString()
      ).toBe("2020-03-28T23:00:00.000Z");
    });
    it("should return correct value for WEEK", () => {
      expect(
        DataService.dateFilterToTime(
          `3:${DATE_FILTER_VALUE.WEEK}`
        ).toISOString()
      ).toBe("2020-03-10T23:00:00.000Z");
    });
    it("should return correct value for MONTH", () => {
      expect(
        DataService.dateFilterToTime(
          `3:${DATE_FILTER_VALUE.MONTH}`
        ).toISOString()
      ).toBe("2019-12-31T23:00:00.000Z");
    });
    it("should return correct value for QUARTER", () => {
      expect(
        DataService.dateFilterToTime(
          `3:${DATE_FILTER_VALUE.QUARTER}`
        ).toISOString()
      ).toBe("2019-06-30T23:00:00.000Z");
    });
    it("should return correct value for YEAR", () => {
      expect(
        DataService.dateFilterToTime(
          `3:${DATE_FILTER_VALUE.YEAR}`
        ).toISOString()
      ).toBe("2017-03-31T23:00:00.000Z");
    });
  });

  describe("Default", () => {
    it("should return current time for unknown input", () => {
      expect(DataService.dateFilterToTime("ggfoo").toISOString()).toBe(
        "2020-03-31T23:00:00.000Z"
      );
    });
  });
});
