import { IEntityField } from "backend/entities/types";
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
  it("should guess `unique` validation when is unique only", () => {
    expect(guessEntityValidations(true, undefined, false))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "errorMessage": "{{ name }} already exists",
          "fromSchema": true,
          "validationType": "unique",
        },
      ]
    `);
  });
  it("should guess `unique` validation when is ID only", () => {
    expect(guessEntityValidations(false, true, false)).toMatchInlineSnapshot(`
      Array [
        Object {
          "errorMessage": "{{ name }} already exists",
          "fromSchema": true,
          "validationType": "unique",
        },
      ]
    `);
  });
  it("should guess `unique` validation when is ID or unique", () => {
    expect(guessEntityValidations(true, true, false)).toMatchInlineSnapshot(`
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
    expect(guessEntityValidations(false, undefined, true))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "errorMessage": "{{ name }} is required",
          "fromSchema": true,
          "validationType": "required",
        },
      ]
    `);
  });
  it("should combine all gotten validation ", () => {
    expect(guessEntityValidations(true, true, true)).toMatchInlineSnapshot(`
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
      ]
    `);
  });
});

describe("guessEntityType", () => {
  it("should guess `reference` types", () => {
    expect(guessEntityType("name", "scalar", "Boolean", { name: "Foo" })).toBe(
      "reference"
    );
  });
  it("should guess `selection` types", () => {
    expect(guessEntityType("name", "enum", "Boolean", {})).toBe(
      "selection-enum"
    );
  });
  it("should map custom fields", () => {
    expect(guessEntityType("name", "scalar", "Int", {})).toBe("number");
  });
  it("should default to `text` when type is unknown", () => {
    expect(
      guessEntityType(
        "name",
        "scalar",
        "an unknown type" as IEntityField["type"],
        {}
      )
    ).toBe("text");
  });
});
