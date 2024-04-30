import { DASHBOARD_RELATIVE_DAYS } from "../constants";

describe("WidgetHeader constants", () => {
  it("should match snapshot", () => {
    expect(DASHBOARD_RELATIVE_DAYS).toMatchInlineSnapshot(`
      [
        {
          "label": {
            "id": "7su3XN",
            "message": "{value} Day",
            "values": {
              "value": 1,
            },
          },
          "value": "1:d",
        },
        {
          "label": {
            "id": "C7eNse",
            "message": "{value} Days",
            "values": {
              "value": 3,
            },
          },
          "value": "3:d",
        },
        {
          "label": {
            "id": "4i3PjE",
            "message": "{value} Week",
            "values": {
              "value": 1,
            },
          },
          "value": "1:w",
        },
        {
          "label": {
            "id": "Vi8/IM",
            "message": "{value} Weeks",
            "values": {
              "value": 2,
            },
          },
          "value": "2:w",
        },
        {
          "label": {
            "id": "JA7VCv",
            "message": "{value} Month",
            "values": {
              "value": 1,
            },
          },
          "value": "1:m",
        },
        {
          "label": {
            "id": "s4Zd2/",
            "message": "{value} Months",
            "values": {
              "value": 3,
            },
          },
          "value": "3:m",
        },
        {
          "label": {
            "id": "s4Zd2/",
            "message": "{value} Months",
            "values": {
              "value": 6,
            },
          },
          "value": "6:m",
        },
        {
          "label": {
            "id": "9dNOG3",
            "message": "{value} Year",
            "values": {
              "value": 1,
            },
          },
          "value": "1:y",
        },
        {
          "label": {
            "id": "SiJQtV",
            "message": "{value} Years",
            "values": {
              "value": 2,
            },
          },
          "value": "2:y",
        },
        {
          "label": {
            "id": "4kQibI",
            "message": "Start of year",
          },
          "value": "by",
        },
        {
          "label": {
            "id": "Zgw3AZ",
            "message": "{value} Hours",
            "values": {
              "value": 6,
            },
          },
          "value": "6:h",
        },
        {
          "label": {
            "id": "Zgw3AZ",
            "message": "{value} Hours",
            "values": {
              "value": 12,
            },
          },
          "value": "12:h",
        },
      ]
    `);
  });
});
