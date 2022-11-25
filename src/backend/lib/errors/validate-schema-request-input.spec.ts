import { validateSchemaRequestBody } from "./validate-schema-request-input";

describe("validateSchemaRequestBody", () => {
  it("should pass valid input", () => {
    expect(() =>
      validateSchemaRequestBody(
        {
          name: {
            type: "text",
            validations: [
              {
                validationType: "required",
              },
            ],
          },
        },
        {
          name: "Foo",
        }
      )
    ).not.toThrowError();
  });

  it("should pass valid input", () => {
    expect(() =>
      validateSchemaRequestBody(
        {
          name: {
            type: "text",
            validations: [
              {
                validationType: "required",
              },
            ],
          },
        },
        {}
      )
    ).toThrowError("Invalid Request");
  });
});
