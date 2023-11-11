/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SortList } from ".";

jest.mock("react-easy-sort", () => ({
  __esModule: true,
  default: ({
    onSortEnd,
    children,
  }: {
    onSortEnd: (newValue: number, oldValue: number) => void;
    children: ReactNode;
  }) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      onClick={() => {
        onSortEnd(1, 2);
        onSortEnd(-1, 0);
        onSortEnd(2, -1);
      }}
      data-testid="fake-sorting"
    >
      {children}
    </div>
  ),
  SortableItem: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("SortList", () => {
  it("should render labels if present else value", () => {
    render(
      <SortList
        data={{
          data: [
            {
              value: "foo-value",
            },
            {
              value: "bar-value",
              label: "Bar Label",
            },
          ],
          error: null,
          isLoading: false,
          isRefetching: false,
        }}
        onSave={jest.fn()}
      />
    );
    expect(screen.getByText("foo-value")).toBeInTheDocument();
    expect(screen.getByText("Bar Label")).toBeInTheDocument();
    expect(screen.queryByText("bar-value")).not.toBeInTheDocument();
  });

  it("should warn when just one item", () => {
    render(
      <SortList
        data={{
          data: [
            {
              value: "bar-value",
              label: "Bar Label",
            },
          ],
          error: null,
          isLoading: false,
          isRefetching: false,
        }}
        onSave={jest.fn()}
      />
    );
    expect(screen.queryByText("Bar Label")).not.toBeInTheDocument();
    expect(screen.queryByText("bar-value")).not.toBeInTheDocument();
    expect(screen.getByText("Cant sort 1 item")).toBeInTheDocument();
  });

  it("should warn when there are no items", () => {
    render(
      <SortList
        data={{
          data: [],
          error: null,
          isLoading: false,
          isRefetching: false,
        }}
        onSave={jest.fn()}
      />
    );
    expect(screen.getByText("Cant sort 0 items")).toBeInTheDocument();
  });

  it("should render skeleton when loading", () => {
    render(
      <SortList
        data={{
          data: [
            {
              value: "bar-value",
              label: "Bar Label",
            },
            {
              value: "foo-value",
            },
          ],
          error: null,
          isLoading: true,
          isRefetching: false,
        }}
        onSave={jest.fn()}
      />
    );
    expect(screen.getByTestId("list-skeleton")).toBeInTheDocument();
    expect(screen.queryByText("Bar Label")).not.toBeInTheDocument();
  });

  it("should render Error when present", () => {
    render(
      <SortList
        data={{
          data: [
            {
              value: "bar-value",
              label: "Bar Label",
            },
            {
              value: "foo-value",
            },
          ],
          error: "Some nasty error",
          isLoading: false,
          isRefetching: false,
        }}
        onSave={jest.fn()}
      />
    );
    expect(screen.getByText("Some nasty error")).toBeInTheDocument();
    expect(screen.queryByText("Bar Label")).not.toBeInTheDocument();
  });

  it("should render save button twice for large list", () => {
    render(
      <SortList
        data={{
          data: Array.from({ length: 11 }, (_, i) => ({ value: `foo${i}` })),
          error: null,
          isLoading: false,
          isRefetching: false,
        }}
        onSave={jest.fn()}
      />
    );
    expect(
      screen.queryAllByRole("button", { name: "Save Order" })
    ).toHaveLength(2);
  });

  it("should render save button once for small list", () => {
    render(
      <SortList
        data={{
          data: Array.from({ length: 2 }, (_, i) => ({ value: `foo${i}` })),
          error: null,
          isLoading: false,
          isRefetching: false,
        }}
        onSave={jest.fn()}
      />
    );
    expect(
      screen.queryAllByRole("button", { name: "Save Order" })
    ).toHaveLength(1);
  });

  it("should sort items", async () => {
    const onSave = jest.fn();
    render(
      <SortList
        data={{
          data: [
            {
              value: "foo-value",
            },
            {
              value: "bar-value",
            },
            {
              value: "baz-value",
            },
          ],
          error: null,
          isLoading: false,
          isRefetching: false,
        }}
        onSave={onSave}
      />
    );

    fireEvent.click(screen.getByTestId("fake-sorting"));

    fireEvent.click(screen.getByRole("button", { name: "Save Order" }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith([
        "bar-value",
        "foo-value",
        "baz-value",
      ]);
    });
  });
});
