import { fakeMessageDescriptor } from "translations/fake";
import { getEntitySelectionConfig } from "../getEntitySelectionConfig";

describe("getEntitySelectionConfig", () => {
  describe("boolean", () => {
    it("should return correct default options", () => {
      expect(getEntitySelectionConfig("boolean", null, []))
        .toMatchInlineSnapshot(`
        [
          {
            "label": {
              "id": "l75CjT",
              "message": "Yes",
            },
            "spectrum": "green",
            "value": true,
          },
          {
            "label": {
              "id": "1UzENP",
              "message": "No",
            },
            "spectrum": "red",
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
              spectrum: "blue",
            },
            {
              label: fakeMessageDescriptor("Some No"),
              value: "false",
              spectrum: "red",
            },
          ],

          []
        )
      ).toMatchInlineSnapshot(`
        [
          {
            "label": {
              "id": "Some Yes",
              "message": "Some Yes",
            },
            "spectrum": "blue",
            "value": "true",
          },
          {
            "label": {
              "id": "Some No",
              "message": "Some No",
            },
            "spectrum": "red",
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
              spectrum: "blue",
            },
          ],

          []
        )
      ).toMatchInlineSnapshot(`
        [
          {
            "label": {
              "id": "Option 1",
              "message": "Option 1",
            },
            "spectrum": "blue",
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
            "label": {
              "id": "J/hVSQ",
              "message": "{0}",
              "values": {
                "0": "Pending",
              },
            },
            "spectrum": "green",
            "value": "pending",
          },
          {
            "label": {
              "id": "J/hVSQ",
              "message": "{0}",
              "values": {
                "0": "Approved",
              },
            },
            "spectrum": "red",
            "value": "approved",
          },
          {
            "label": {
              "id": "J/hVSQ",
              "message": "{0}",
              "values": {
                "0": "Rejected",
              },
            },
            "spectrum": "blue",
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
              spectrum: "blue",
            },
            {
              label: fakeMessageDescriptor("Custom Status 2"),
              value: "custom-status-2",
              spectrum: "green",
            },
          ],

          null
        )
      ).toMatchInlineSnapshot(`
        [
          {
            "label": {
              "id": "Custom Status 1",
              "message": "Custom Status 1",
            },
            "spectrum": "blue",
            "value": "custom-status-1",
          },
          {
            "label": {
              "id": "Custom Status 2",
              "message": "Custom Status 2",
            },
            "spectrum": "green",
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
              spectrum: "blue",
            },

            {
              label: fakeMessageDescriptor("Custom Status 2"),
              value: "custom-status-2",
              spectrum: "green",
            },
          ],

          ["pending", "approved", "rejected"]
        )
      ).toMatchInlineSnapshot(`
        [
          {
            "label": {
              "id": "Custom Status 1",
              "message": "Custom Status 1",
            },
            "spectrum": "blue",
            "value": "custom-status-1",
          },
          {
            "label": {
              "id": "Custom Status 2",
              "message": "Custom Status 2",
            },
            "spectrum": "green",
            "value": "custom-status-2",
          },
          {
            "label": {
              "id": "J/hVSQ",
              "message": "{0}",
              "values": {
                "0": "Pending",
              },
            },
            "spectrum": "green",
            "value": "pending",
          },
          {
            "label": {
              "id": "J/hVSQ",
              "message": "{0}",
              "values": {
                "0": "Approved",
              },
            },
            "spectrum": "red",
            "value": "approved",
          },
          {
            "label": {
              "id": "J/hVSQ",
              "message": "{0}",
              "values": {
                "0": "Rejected",
              },
            },
            "spectrum": "blue",
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
              spectrum: "blue",
            },

            {
              label: fakeMessageDescriptor("Custom Status 2"),
              value: "approved",
              spectrum: "green",
            },
          ],

          ["pending", "approved", "rejected"]
        )
      ).toMatchInlineSnapshot(`
        [
          {
            "label": {
              "id": "Custom Status 1",
              "message": "Custom Status 1",
            },
            "spectrum": "blue",
            "value": "custom-status-1",
          },
          {
            "label": {
              "id": "Custom Status 2",
              "message": "Custom Status 2",
            },
            "spectrum": "green",
            "value": "approved",
          },
          {
            "label": {
              "id": "J/hVSQ",
              "message": "{0}",
              "values": {
                "0": "Pending",
              },
            },
            "spectrum": "green",
            "value": "pending",
          },
          {
            "label": {
              "id": "J/hVSQ",
              "message": "{0}",
              "values": {
                "0": "Rejected",
              },
            },
            "spectrum": "blue",
            "value": "rejected",
          },
        ]
      `);
    });

    it("should not use spectrums for generated options when preselected dont have spectrums", () => {
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
            "label": {
              "id": "Custom Status 1",
              "message": "Custom Status 1",
            },
            "value": "custom-status-1",
          },
          {
            "label": {
              "id": "Custom Status 2",
              "message": "Custom Status 2",
            },
            "value": "custom-status-2",
          },
          {
            "label": {
              "id": "J/hVSQ",
              "message": "{0}",
              "values": {
                "0": "Pending",
              },
            },
            "spectrum": undefined,
            "value": "pending",
          },
          {
            "label": {
              "id": "J/hVSQ",
              "message": "{0}",
              "values": {
                "0": "Approved",
              },
            },
            "spectrum": undefined,
            "value": "approved",
          },
          {
            "label": {
              "id": "J/hVSQ",
              "message": "{0}",
              "values": {
                "0": "Rejected",
              },
            },
            "spectrum": undefined,
            "value": "rejected",
          },
        ]
      `);
    });
  });
});
