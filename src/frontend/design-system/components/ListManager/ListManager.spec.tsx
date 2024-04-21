import { fireEvent, render, screen } from "@testing-library/react";
import { loadedDataState } from "frontend/lib/data/constants/loadedDataState";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { ListManager } from ".";

const defaultProps = {
  listLengthGuess: 5,
  labelField: "name",
  items: loadedDataState([
    {
      name: "Foo",
    },
    {
      name: "Bar",
    },
  ]),
} as const;

describe("ListManager", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

  it("should render list items", () => {
    render(
      <ListManager
        {...{ ...defaultProps }}
        render={(item) => ({ label: item.name })}
      />
    );

    expect(screen.getByText("Foo")).toBeInTheDocument();
    expect(screen.getByText("Bar")).toBeInTheDocument();
  });

  it("should render computed labels", () => {
    render(
      <ListManager
        {...{ ...defaultProps }}
        getLabel={(name) => `${name} + Label`}
        render={(item) => ({ label: item.label })}
      />
    );

    expect(screen.getByText("Foo + Label")).toBeInTheDocument();
    expect(screen.getByText("Bar + Label")).toBeInTheDocument();
  });

  it("should not render search input when items are small", () => {
    render(
      <ListManager
        {...{ ...defaultProps }}
        render={(item) => ({ label: item.name })}
      />
    );

    expect(screen.queryByPlaceholderText("Search")).not.toBeInTheDocument();
  });

  it("should render search input when items are large", () => {
    render(
      <ListManager
        {...{ ...defaultProps }}
        items={loadedDataState(
          Array.from({ length: 11 }, (_, i) => ({ name: `foo${i}` }))
        )}
        render={(item) => ({ label: item.name })}
      />
    );

    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("should search items by label and name when search input is keyed", () => {
    render(
      <ListManager
        {...{ ...defaultProps }}
        items={loadedDataState(
          Array.from({ length: 11 }, (_, i) => ({ name: `foo${i}` }))
        )}
        getLabel={(name) => `1-${name}`}
        render={(item) => ({ label: item.label })}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "foo1" },
    });

    expect(screen.queryByText("1-foo0")).not.toBeInTheDocument();
    expect(screen.getByText("1-foo1")).toBeInTheDocument();
    expect(screen.queryByText("No Search Results")).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "something to not exist" },
    });

    expect(screen.queryByText("1-foo0")).not.toBeInTheDocument();
    expect(screen.queryByText("1-foo1")).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "1-foo0" },
    });

    expect(screen.getByText("1-foo0")).toBeInTheDocument();
    expect(screen.queryByText("1-foo1")).not.toBeInTheDocument();

    expect(screen.queryByText("No Search Results")).not.toBeInTheDocument();
  });

  it("should render Empty view when empty", () => {
    render(
      <ListManager
        {...{ ...defaultProps }}
        items={loadedDataState([])}
        empty={{
          text: "No Item Has Been Added Yet",
        }}
        render={(item) => ({ label: item.label })}
      />
    );

    expect(screen.getByText("No Item Has Been Added Yet")).toBeInTheDocument();
  });
});

/*

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

*/
