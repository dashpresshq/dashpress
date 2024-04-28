import { IEntityField } from "shared/types/db";
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
              color: "#111",
              label: fakeMessageDescriptor("Custom Select Option 1"),
              value: "custom-select-option-1",
            },

            {
              color: "#222",
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
            "color": "#111",
            "label": "Custom Select Option 1",
            "value": "custom-select-option-1",
          },
          {
            "color": "#222",
            "label": "Custom Select Option 2",
            "value": "custom-select-option-2",
          },
        ],
        "isVerified": [
          {
            "label": "Yes (Custom)",
            "value": true,
          },
          {
            "label": "No (Custom)",
            "value": true,
          },
        ],
        "status": [
          {
            "label": "Approved (Custom)",
            "value": "approved",
          },
          {
            "label": "In Progress (Custom)",
            "value": "in-progress",
          },
          {
            "color": undefined,
            "label": "Rejected",
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
            "color": "#2ECC40",
            "label": "Yes",
            "value": true,
          },
          {
            "color": "#FF165D",
            "label": "No",
            "value": false,
          },
        ],
        "status": [
          {
            "color": "#2ECC40",
            "label": "Approved",
            "value": "approved",
          },
          {
            "color": "#FF165D",
            "label": "In Progress",
            "value": "in-progress",
          },
          {
            "color": "#0074D9",
            "label": "Rejected",
            "value": "rejected",
          },
        ],
      }
    `);
  });
});
