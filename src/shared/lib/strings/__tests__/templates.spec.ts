import { compileTemplateString } from "../templates";

describe("Template service", () => {
  it("should compiles templates successfully", () => {
    expect(
      compileTemplateString("{{ name }} is {{ age }}", {
        name: "John",
        age: 23,
      })
    ).toEqual("John is 23");
    expect(
      compileTemplateString("{ name } is {{ age }}", {
        name: "John",
        age: 23,
      })
    ).toEqual("{ name } is 23");
  });

  it("should returns empty string for undefined template", () => {
    expect(
      compileTemplateString("{ name } is {{ age }}", {
        name: "John",
      })
    ).toEqual("{ name } is ");
  });

  it("should compile objects", () => {
    expect(
      compileTemplateString("{{ person.name }}", {
        person: { name: "John" },
      })
    ).toEqual("John");
  });

  it("should return error message", () => {
    expect(
      compileTemplateString(undefined, {
        person: { name: "John" },
      })
    ).toBe(
      'Invalid template! Template should be a "string" but "undefined" was given as the first argument for mustache#render(template, view, partials)'
    );
  });
});
