import {
  getFieldTypeBoundedValidations,
  guessEntityValidations,
} from "../guess";

describe("getFieldTypeBoundedValidations", () => {
  it("should guess validations by type for single item array", () => {
    expect(getFieldTypeBoundedValidations("boolean")).toMatchInlineSnapshot(`
      [
        {
          "errorMessage": "{{ name }} should be a boolean",
          "fromType": true,
          "validationType": "isBoolean",
        },
      ]
    `);
  });

  it("should guess validations by type for multiple items array", () => {
    expect(getFieldTypeBoundedValidations("text")).toMatchInlineSnapshot(`
      [
        {
          "errorMessage": "{{ name }} is not a text",
          "fromType": true,
          "validationType": "isString",
        },
      ]
    `);

    expect(getFieldTypeBoundedValidations("richtext")).toMatchInlineSnapshot(`
      [
        {
          "errorMessage": "{{ name }} is not a text",
          "fromType": true,
          "validationType": "isString",
        },
      ]
    `);
  });
});

describe("guessEntityValidations", () => {
  it("should guess `isRequired` validation when is required", () => {
    expect(
      guessEntityValidations({
        isRequired: true,
      })
    ).toMatchInlineSnapshot(`
      [
        {
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
      [
        {
          "constraint": {
            "length": 50,
          },
          "errorMessage": "{{ name }} should be less than {{ length }} characters",
          "fromSchema": true,
          "validationType": "maxLength",
        },
      ]
    `);
  });

  it("should combine all gotten validation ", () => {
    expect(
      guessEntityValidations({
        isRequired: true,
        length: 40,
      })
    ).toMatchInlineSnapshot(`
      [
        {
          "errorMessage": "{{ name }} is required",
          "fromSchema": true,
          "validationType": "required",
        },
        {
          "constraint": {
            "length": 40,
          },
          "errorMessage": "{{ name }} should be less than {{ length }} characters",
          "fromSchema": true,
          "validationType": "maxLength",
        },
      ]
    `);
  });
});
