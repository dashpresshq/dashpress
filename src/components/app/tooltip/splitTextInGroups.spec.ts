import { splitTextInGroups } from ".";

describe("splitTextInGroups", () => {
  it("should split text in break groups correctly", () => {
    expect(splitTextInGroups("hello world")).toBe("hello world");
    expect(
      splitTextInGroups(
        "one two three four five six seven eight nine ten 1 2 3 4 5 6 7 8 9 10 lorem ipsum hello world dolor amet lorem ipsum "
      )
    ).toBe(
      "one two three four five six seven eight nine ten <br />1 2 3 4 5 6 7 8 9 10 <br />lorem ipsum hello world dolor amet lorem ipsum"
    );
  });
});
