import { sortByList } from "../utils";

  describe("Sort By List", () => {
    it("should extract table of contents", () => {
      expect(sortByList())
        .toMatchInlineSnapshot();
    });
  });
  