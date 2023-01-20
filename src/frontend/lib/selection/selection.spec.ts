import { renderHook } from "__tests__/lib/renderHook";
import { useStringSelections } from ".";

describe("useStringSelections", () => {
  it("should default to empty array", async () => {
    const { result } = renderHook(() => useStringSelections());
    expect(result.current.allSelections).toEqual([]);
    expect(result.current.currentPageSelection).toEqual([]);
  });
  describe("single page", () => {
    it("should select multiple", async () => {
      const { result, rerender } = renderHook(() => useStringSelections());

      result.current.selectMutiple(["foo", "bar"]);

      rerender();

      expect(result.current.allSelections).toEqual(["foo", "bar"]);
      expect(result.current.currentPageSelection).toEqual(["foo", "bar"]);
    });

    it("should clear all", async () => {
      const { result, rerender } = renderHook(() => useStringSelections());

      result.current.selectMutiple(["foo", "bar"]);

      rerender();

      expect(result.current.allSelections).toHaveLength(2);
      expect(result.current.currentPageSelection).toHaveLength(2);

      result.current.clearAll();

      rerender();

      expect(result.current.allSelections).toHaveLength(0);
      expect(result.current.currentPageSelection).toHaveLength(0);
    });

    it("should select toogle selections", async () => {
      const { result, rerender } = renderHook(() => useStringSelections());

      result.current.toggleSelection("foo");
      rerender();
      result.current.toggleSelection("bar");

      rerender();

      expect(result.current.allSelections).toEqual(["foo", "bar"]);
      expect(result.current.currentPageSelection).toEqual(["foo", "bar"]);

      result.current.toggleSelection("bar");

      rerender();

      expect(result.current.allSelections).toEqual(["foo"]);
      expect(result.current.currentPageSelection).toEqual(["foo"]);
    });
  });

  describe("multiple page", () => {
    it("should select multiple on current page", async () => {
      const { result, rerender } = renderHook(() => useStringSelections());

      result.current.selectMutiple(["foo", "bar"]);
      rerender();

      result.current.setCurrentPage(2);
      rerender();

      result.current.selectMutiple(["foo-2", "bar-2"]);
      rerender();

      expect(result.current.allSelections).toEqual([
        "foo",
        "bar",
        "foo-2",
        "bar-2",
      ]);
      expect(result.current.currentPageSelection).toEqual(["foo-2", "bar-2"]);
    });

    it("should clear all on current page", async () => {
      const { result, rerender } = renderHook(() => useStringSelections());

      result.current.selectMutiple(["foo", "bar"]);
      rerender();

      result.current.setCurrentPage(2);
      rerender();

      result.current.selectMutiple(["foo-2", "bar-2", "baz-3"]);
      rerender();

      expect(result.current.allSelections).toHaveLength(5);
      expect(result.current.currentPageSelection).toHaveLength(3);

      result.current.clearAll();

      rerender();

      expect(result.current.allSelections).toHaveLength(2);
      expect(result.current.currentPageSelection).toHaveLength(0);
    });

    it("should select toogle selections", async () => {
      const { result, rerender } = renderHook(() => useStringSelections());

      result.current.toggleSelection("foo");
      rerender();
      result.current.toggleSelection("bar");

      result.current.setCurrentPage(2);
      rerender();

      result.current.toggleSelection("foo-2");
      rerender();
      result.current.toggleSelection("bar-2");

      rerender();

      expect(result.current.allSelections).toEqual([
        "foo",
        "bar",
        "foo-2",
        "bar-2",
      ]);
      expect(result.current.currentPageSelection).toEqual(["foo-2", "bar-2"]);

      result.current.toggleSelection("bar-2");

      rerender();

      expect(result.current.allSelections).toEqual(["foo", "bar", "foo-2"]);
      expect(result.current.currentPageSelection).toEqual(["foo-2"]);
    });
  });
});
