import { matches } from "class-validator";

import { CAPITAL_AND_UNDERSCORE_REGEX } from "./Form";

describe("CAPITAL_AND_UNDERSCORE_REGEX", () => {
  const cases: { input: string; value: boolean }[] = [
    { input: "foo", value: false },
    { input: "FOO ", value: false },
    { input: "FOO BAR", value: false },
    { input: "foo_BAR", value: false },
    { input: "foo_bar", value: false },
    { input: "FOO_BAR9", value: false },
    { input: "FOO_BAR_9", value: false },
    { input: "FOO_BAR", value: true },
    { input: "FOO", value: true },
  ];

  it.each(cases)("should validate '$input' correctly", ({ input, value }) => {
    expect(matches(input, new RegExp(CAPITAL_AND_UNDERSCORE_REGEX))).toBe(
      value
    );
  });
});
