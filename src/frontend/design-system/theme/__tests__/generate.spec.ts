import { DEFAULT_PRIMARY_COLOR } from "../constants";
import { colorModeToRootColors } from "../generate";
import { LIGHT_MODE } from "../modes";

describe("generateRootColors", () => {
  it("should generate correct root colors", () => {
    expect(colorModeToRootColors(DEFAULT_PRIMARY_COLOR, LIGHT_MODE))
      .toMatchInlineSnapshot(`
      Object {
        "base-color": "#ffffff",
        "border-color": "#e3ebf6",
        "foundation-color": "#f3f6f9",
        "main-text": "#5f6270",
        "muted-text": "#a4abc5",
        "primary-color": "#4b38b3",
        "primary-shade-color": "#4b38b31A",
        "shade-opacity": "1A",
        "soft-color": "#f1f5fa",
        "text-on-primary": "#ffffff",
        "text-on-shade": "#4b38b3",
      }
    `);
  });
});
