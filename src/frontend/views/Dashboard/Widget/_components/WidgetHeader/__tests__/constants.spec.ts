import { DASHBOARD_RELATIVE_DAYS } from "../constants";

describe("WidgetHeader constants", () => {
  it("should match snapshot", () => {
    expect(DASHBOARD_RELATIVE_DAYS).toMatchInlineSnapshot(`
      [
        {
          "label": "1 Day",
          "value": "1:d",
        },
        {
          "label": "3 Days",
          "value": "3:d",
        },
        {
          "label": "1 Week",
          "value": "1:w",
        },
        {
          "label": "2 Weeks",
          "value": "2:w",
        },
        {
          "label": "1 Month",
          "value": "1:m",
        },
        {
          "label": "3 Months",
          "value": "3:m",
        },
        {
          "label": "6 Months",
          "value": "6:m",
        },
        {
          "label": "1 Year",
          "value": "1:y",
        },
        {
          "label": "2 Years",
          "value": "2:y",
        },
        {
          "label": "Start of year",
          "value": "by",
        },
        {
          "label": "6 Hours",
          "value": "6:h",
        },
        {
          "label": "12 Hours",
          "value": "12:h",
        },
      ]
    `);
  });
});
