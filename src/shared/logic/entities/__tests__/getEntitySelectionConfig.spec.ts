import { fakeMessageDescriptor } from "translations/fake";
import { getEntitySelectionConfig } from "../getEntitySelectionConfig";

describe("getEntitySelectionConfig", () => {
  describe("boolean", () => {
    it("should return correct default options", () => {
      expect(getEntitySelectionConfig("boolean", null, []))
        .toMatchInlineSnapshot(`
        [
          {
            "color": "#2ECC40",
            "label": "Yes",
            "value": true,
          },
          {
            "color": "#FF165D",
            "label": "No",
            "value": false,
          },
        ]
      `);
    });

    it("should return correct presselected options when present", () => {
      expect(
        getEntitySelectionConfig(
          "boolean",
          [
            {
              label: fakeMessageDescriptor("Some Yes"),
              value: "true",
              color: "#foo",
            },
            {
              label: fakeMessageDescriptor("Some No"),
              value: "false",
              color: "#fff",
            },
          ],
          []
        )
      ).toMatchInlineSnapshot(`
              [
                {
                  "color": "#foo",
                  "label": "Some Yes",
                  "value": "true",
                },
                {
                  "color": "#fff",
                  "label": "Some No",
                  "value": "false",
                },
              ]
          `);
    });
  });

  describe("selection", () => {
    it("should return empty options when there is no preselections", () => {
      expect(
        getEntitySelectionConfig("selection", null, [])
      ).toMatchInlineSnapshot(`[]`);
    });

    it("should return preselection when present", () => {
      expect(
        getEntitySelectionConfig(
          "selection",
          [
            {
              label: fakeMessageDescriptor("Option 1"),
              value: "true",
              color: "#foo",
            },
          ],
          []
        )
      ).toMatchInlineSnapshot(`
        [
          {
            "color": "#foo",
            "label": "Option 1",
            "value": "true",
          },
        ]
      `);
    });
  });

  describe("selection-enum", () => {
    it("should generate selections from options", () => {
      expect(
        getEntitySelectionConfig("selection-enum", null, [
          "pending",
          "approved",
          "rejected",
        ])
      ).toMatchInlineSnapshot(`
        [
          {
            "color": "#2ECC40",
            "label": "Pending",
            "value": "pending",
          },
          {
            "color": "#FF165D",
            "label": "Approved",
            "value": "approved",
          },
          {
            "color": "#0074D9",
            "label": "Rejected",
            "value": "rejected",
          },
        ]
      `);
    });

    it("should return preselections correctly when there are no options", () => {
      expect(
        getEntitySelectionConfig(
          "selection-enum",
          [
            {
              label: fakeMessageDescriptor("Custom Status 1"),
              value: "custom-status-1",
              color: "#foo",
            },
            {
              label: fakeMessageDescriptor("Custom Status 2"),
              value: "custom-status-2",
              color: "#ffo",
            },
          ],
          null
        )
      ).toMatchInlineSnapshot(`
          [
            {
              "color": "#foo",
              "label": "Custom Status 1",
              "value": "custom-status-1",
            },
            {
              "color": "#ffo",
              "label": "Custom Status 2",
              "value": "custom-status-2",
            },
          ]
        `);
    });

    it("should merge preselected options with generated selections from options", () => {
      expect(
        getEntitySelectionConfig(
          "selection-enum",
          [
            {
              label: fakeMessageDescriptor("Custom Status 1"),
              value: "custom-status-1",
              color: "#foo",
            },

            {
              label: fakeMessageDescriptor("Custom Status 2"),
              value: "custom-status-2",
              color: "#ffo",
            },
          ],

          ["pending", "approved", "rejected"]
        )
      ).toMatchInlineSnapshot(`
        [
          {
            "color": "#foo",
            "label": "Custom Status 1",
            "value": "custom-status-1",
          },
          {
            "color": "#ffo",
            "label": "Custom Status 2",
            "value": "custom-status-2",
          },
          {
            "color": "#2ECC40",
            "label": "Pending",
            "value": "pending",
          },
          {
            "color": "#FF165D",
            "label": "Approved",
            "value": "approved",
          },
          {
            "color": "#0074D9",
            "label": "Rejected",
            "value": "rejected",
          },
        ]
      `);
    });

    it("should have uniq values from merges", () => {
      expect(
        getEntitySelectionConfig(
          "selection-enum",
          [
            {
              label: fakeMessageDescriptor("Custom Status 1"),
              value: "custom-status-1",
              color: "#foo",
            },

            {
              label: fakeMessageDescriptor("Custom Status 2"),
              value: "approved",
              color: "#ffo",
            },
          ],

          ["pending", "approved", "rejected"]
        )
      ).toMatchInlineSnapshot(`
        [
          {
            "color": "#foo",
            "label": "Custom Status 1",
            "value": "custom-status-1",
          },
          {
            "color": "#ffo",
            "label": "Custom Status 2",
            "value": "approved",
          },
          {
            "color": "#2ECC40",
            "label": "Pending",
            "value": "pending",
          },
          {
            "color": "#0074D9",
            "label": "Rejected",
            "value": "rejected",
          },
        ]
      `);
    });

    it("should not use colors for generated options when preselected dont have colors", () => {
      expect(
        getEntitySelectionConfig(
          "selection-enum",
          [
            {
              label: fakeMessageDescriptor("Custom Status 1"),
              value: "custom-status-1",
            },

            {
              label: fakeMessageDescriptor("Custom Status 2"),
              value: "custom-status-2",
            },
          ],

          ["pending", "approved", "rejected"]
        )
      ).toMatchInlineSnapshot(`
        [
          {
            "label": "Custom Status 1",
            "value": "custom-status-1",
          },
          {
            "label": "Custom Status 2",
            "value": "custom-status-2",
          },
          {
            "color": undefined,
            "label": "Pending",
            "value": "pending",
          },
          {
            "color": undefined,
            "label": "Approved",
            "value": "approved",
          },
          {
            "color": undefined,
            "label": "Rejected",
            "value": "rejected",
          },
        ]
      `);
    });
  });
});
