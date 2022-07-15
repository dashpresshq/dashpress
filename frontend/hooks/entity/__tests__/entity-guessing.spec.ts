import { IEntityField } from "shared/types";
import {
  getFieldTypeBoundedValidations,
  guessEntityType,
  guessEntityValidations,
} from "../guess";

describe("getFieldTypeBoundedValidations", () => {
  it("guess validations by type for single item array", () => {
    expect(getFieldTypeBoundedValidations("boolean")).toMatchInlineSnapshot(`
      Array [
        Object {
          "errorMessage": "{{ name }} should be a boolean",
          "fromType": true,
          "validationType": "isBoolean",
        },
      ]
    `);
  });

  it("guess validations by type for multiple items array", () => {
    expect(getFieldTypeBoundedValidations("text")).toMatchInlineSnapshot(`
      Array [
        Object {
          "errorMessage": "{{ name }} is not a text",
          "fromType": true,
          "validationType": "isString",
        },
      ]
    `);

    expect(getFieldTypeBoundedValidations("richtext")).toMatchInlineSnapshot(`
      Array [
        Object {
          "errorMessage": "{{ name }} is not a text",
          "fromType": true,
          "validationType": "isString",
        },
      ]
    `);
  });
});

describe("guessEntityValidations", () => {
  it("should guess `unique` validation when is ID only", () => {
    expect(
      guessEntityValidations({
        isId: true,
      })
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "errorMessage": "{{ name }} already exists",
          "fromSchema": true,
          "validationType": "unique",
        },
      ]
    `);
  });

  it("should guess `isRequired` validation when is required", () => {
    expect(
      guessEntityValidations({
        isRequired: true,
      })
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "errorMessage": "{{ name }} is required",
          "fromSchema": true,
          "validationType": "required",
        },
      ]
    `);
  });

  it("should guess `maxLength` validation when there is length on the column", () => {
    expect(
      guessEntityValidations({
        length: 50,
      })
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "constraint": Object {
            "length": 50,
          },
          "errorMessage": "{{ name }} is required",
          "fromSchema": true,
          "validationType": "maxLength",
        },
      ]
    `);
  });

  it("should combine all gotten validation ", () => {
    expect(
      guessEntityValidations({
        isId: true,
        isRequired: true,
        length: 40,
      })
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "errorMessage": "{{ name }} already exists",
          "fromSchema": true,
          "validationType": "unique",
        },
        Object {
          "errorMessage": "{{ name }} is required",
          "fromSchema": true,
          "validationType": "required",
        },
        Object {
          "constraint": Object {
            "length": 40,
          },
          "errorMessage": "{{ name }} is required",
          "fromSchema": true,
          "validationType": "maxLength",
        },
      ]
    `);
  });
});

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
