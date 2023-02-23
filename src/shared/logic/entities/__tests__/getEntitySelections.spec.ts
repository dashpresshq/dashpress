import { IEntityField } from "shared/types/db";
import { guessEntityType } from "../getEntitySelections";

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
