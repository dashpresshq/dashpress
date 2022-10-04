import { TemplateService } from ".";

describe("Template service", () => {
  it("should compiles templates successfully", async () => {
    expect(
      TemplateService.compile("{{ name }} is {{ age }}", {
        name: "John",
        age: 23,
      })
    ).toEqual("John is 23");
    expect(
      TemplateService.compile("{ name } is {{ age }}", {
        name: "John",
        age: 23,
      })
    ).toEqual("{ name } is 23");
  });

  it("should returns empty string for undefined template", async () => {
    expect(
      TemplateService.compile("{ name } is {{ age }}", {
        name: "John",
      })
    ).toEqual("{ name } is ");
  });

  it("should compile objects", async () => {
    expect(
      TemplateService.compile("{{ person.name }}", {
        person: { name: "John" },
      })
    ).toEqual("John");
  });

  it("should return error message", async () => {
    expect(
      TemplateService.compile(undefined, {
        person: { name: "John" },
      })
    ).toBe(
      'Invalid template! Template should be a "string" but "undefined" was given as the first argument for mustache#render(template, view, partials)'
    );
  });
});
