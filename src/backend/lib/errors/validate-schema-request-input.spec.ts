import { fakeMessageDescriptor } from "translations/fake";

import { validateSchemaRequestBody } from "./validate-schema-request-input";

describe("validateSchemaRequestBody", () => {
  it("should pass valid input", () => {
    expect(() =>
      validateSchemaRequestBody(
        {
          name: {
            label: fakeMessageDescriptor("name"),
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
    ).not.toThrow();
  });

  it("should throw error on invalid input", () => {
    expect(() =>
      validateSchemaRequestBody(
        {
          name: {
            label: fakeMessageDescriptor("name"),
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
    ).toThrow("Invalid Request");
  });
});
