import type { IEntityField } from "shared/types/db";
import { fakeMessageDescriptor } from "translations/fake";
import { guessEntityType, getEntitySelections } from "../getEntitySelections";

describe("guessEntityType", () => {
  it("should guess `reference` types", () => {
    expect(guessEntityType("string", true)).toBe("reference");
  });

  it("should map custom fields", () => {
    expect(guessEntityType("enum")).toBe("selection-enum");
  });

  it("should default to `text` when type is unknown", () => {
    expect(guessEntityType("an unknown type" as IEntityField["type"])).toBe(
      "text"
    );
  });
});

describe("getEntitySelections", () => {
  it("should return the entity selections for the selectable types with override selections", () => {
    expect(
      getEntitySelections(
        [
          {
            name: "status",
            type: "enum",
            enumeration: ["approved", "in-progress", "rejected"],
          },

          {
            name: "isVerified",
            type: "boolean",
          },

          {
            name: "customSelect",
            type: "string",
          },

          {
            name: "plain-text",
            type: "string",
          },
        ],

        {
          status: [
            {
              label: fakeMessageDescriptor("Approved (Custom)"),
              value: "approved",
            },

            {
              label: fakeMessageDescriptor("In Progress (Custom)"),
              value: "in-progress",
            },
          ],

          isVerified: [
            {
              label: fakeMessageDescriptor("Yes (Custom)"),
              value: true,
            },

            {
              label: fakeMessageDescriptor("No (Custom)"),
              value: true,
            },
          ],

          customSelect: [
            {
              spectrum: "green",
              label: fakeMessageDescriptor("Custom Select Option 1"),
              value: "custom-select-option-1",
            },

            {
              spectrum: "red",
              label: fakeMessageDescriptor("Custom Select Option 2"),
              value: "custom-select-option-2",
            },
          ],
        },

        {
          status: "selection-enum",
          isVerified: "boolean",
          "plain-text": "text",
          customSelect: "selection",
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "customSelect": [
          {
            "label": {
              "id": "Custom Select Option 1",
              "message": "Custom Select Option 1",
            },
            "spectrum": "green",
            "value": "custom-select-option-1",
          },
          {
            "label": {
              "id": "Custom Select Option 2",
              "message": "Custom Select Option 2",
            },
            "spectrum": "red",
            "value": "custom-select-option-2",
          },
        ],
        "isVerified": [
          {
            "label": {
              "id": "Yes (Custom)",
              "message": "Yes (Custom)",
            },
            "value": true,
          },
          {
            "label": {
              "id": "No (Custom)",
              "message": "No (Custom)",
            },
            "value": true,
          },
        ],
        "status": [
          {
            "label": {
              "id": "Approved (Custom)",
              "message": "Approved (Custom)",
            },
            "value": "approved",
          },
          {
            "label": {
              "id": "In Progress (Custom)",
              "message": "In Progress (Custom)",
            },
            "value": "in-progress",
          },
          {
            "label": {
              "id": "Rejected",
              "message": "Rejected",
            },
            "spectrum": undefined,
            "value": "rejected",
          },
        ],
      }
    `);
  });

  it("should return the entity selections for the selectable types with no override selections", () => {
    expect(
      getEntitySelections(
        [
          {
            name: "status",
            type: "enum",
            enumeration: ["approved", "in-progress", "rejected"],
          },

          {
            name: "isVerified",
            type: "boolean",
          },

          {
            name: "customSelect",
            type: "string",
          },

          {
            name: "plain-text",
            type: "string",
          },
        ],

        undefined,
        {
          status: "selection-enum",
          isVerified: "boolean",
          "plain-text": "text",
          customSelect: "selection",
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "customSelect": [],
        "isVerified": [
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
        ],
        "status": [
          {
            "label": {
              "id": "Approved",
              "message": "Approved",
            },
            "spectrum": "green",
            "value": "approved",
          },
          {
            "label": {
              "id": "In Progress",
              "message": "In Progress",
            },
            "spectrum": "red",
            "value": "in-progress",
          },
          {
            "label": {
              "id": "Rejected",
              "message": "Rejected",
            },
            "spectrum": "blue",
            "value": "rejected",
          },
        ],
      }
    `);
  });
});
