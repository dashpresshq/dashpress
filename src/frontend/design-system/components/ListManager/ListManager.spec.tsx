import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { loadedDataState } from "frontend/lib/data/constants/loadedDataState";
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
  it("should render list items", () => {
    render(
      <ListManager
        {...{ ...defaultProps }}
        render={(item) => <div>{item.name}</div>}
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
        render={(item) => <div>{item.label}</div>}
      />
    );

    expect(screen.getByText("Foo + Label")).toBeInTheDocument();
    expect(screen.getByText("Bar + Label")).toBeInTheDocument();
  });

  it("should not render search input when items are small", () => {
    render(
      <ListManager
        {...{ ...defaultProps }}
        render={(item) => <div>{item.name}</div>}
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
        render={(item) => <div>{item.name}</div>}
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
        render={(item) => <div>{item.label}</div>}
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
        items={loadedDataState([])}
        render={() => <div>foo</div>}
        {...{ ...defaultProps }}
      />
    );

    expect(screen.getByText("No Item Has Been Added Yet")).toBeInTheDocument();
  });
});
