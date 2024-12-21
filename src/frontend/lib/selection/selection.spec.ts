import { renderHook } from "@/tests/lib/renderHook";

import { useStringSelections } from ".";

describe("useStringSelections", () => {
  it("should default to empty array", () => {
    const { result } = renderHook(() => useStringSelections(""));
    expect(result.current.allSelections).toEqual([]);
  });

  describe("single page", () => {
    it("should select multiple", () => {
      const { result, rerender } = renderHook(() => useStringSelections(""));

      result.current.selectMutiple(["foo", "bar"]);

      rerender();

      expect(result.current.allSelections).toEqual(["foo", "bar"]);

      result.current.selectMutiple(["baz", "quz"]);

      rerender();

      expect(result.current.allSelections).toEqual([
        "foo",
        "bar",
        "baz",
        "quz",
      ]);
    });

    it("should set multiple", () => {
      const { result, rerender } = renderHook(() => useStringSelections(""));

      result.current.setMultiple(["foo", "bar"]);

      rerender();

      expect(result.current.allSelections).toEqual(["foo", "bar"]);

      result.current.setMultiple(["baz", "quz", "foo"]);

      rerender();

      expect(result.current.allSelections).toEqual(["baz", "quz", "foo"]);
    });

    it("should deSelectMutiple multiple", () => {
      const { result, rerender } = renderHook(() => useStringSelections(""));

      result.current.selectMutiple(["foo", "bar", "baz", "quz"]);

      rerender();

      expect(result.current.allSelections).toHaveLength(4);

      result.current.deSelectMutiple(["foo", "bar", "baz"]);

      rerender();

      expect(result.current.allSelections).toEqual(["quz"]);

      result.current.deSelectMutiple(["quz"]);

      rerender();

      expect(result.current.allSelections).toEqual([]);
    });

    it("should select toogle selections", () => {
      const { result, rerender } = renderHook(() => useStringSelections(""));

      result.current.toggleSelection("foo");
      rerender();
      result.current.toggleSelection("bar");

      rerender();

      expect(result.current.allSelections).toEqual(["foo", "bar"]);

      result.current.toggleSelection("bar");

      rerender();

      expect(result.current.allSelections).toEqual(["foo"]);
    });

    it("should return correct values for isSelected", () => {
      const { result, rerender } = renderHook(() => useStringSelections(""));

      result.current.selectMutiple(["foo", "bar"]);
      rerender();
      result.current.toggleSelection("bar");

      rerender();

      expect(result.current.isSelected("foo")).toEqual(true);
      expect(result.current.isSelected("baz")).toEqual(false);
    });

    it("should clear all", () => {
      const { result, rerender } = renderHook(() => useStringSelections(""));

      result.current.selectMutiple(["foo", "bar"]);
      rerender();
      result.current.clearAll();

      rerender();

      expect(result.current.allSelections).toEqual([]);
    });
  });
});
