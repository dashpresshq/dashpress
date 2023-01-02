import * as React from "react";
import { render, screen } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import { ViewStateMachine } from ".";

describe("<ViewStateMachine />", () => {
  it("should render only loader when loading", async () => {
    render(
      <AppWrapper>
        <ViewStateMachine error={null} loading loader={<p>Loading</p>}>
          <p>Content</p>
        </ViewStateMachine>
      </AppWrapper>
    );

    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("should render only content when not loading", async () => {
    render(
      <AppWrapper>
        <ViewStateMachine error={null} loading={false} loader={<p>Loading</p>}>
          <p>Content</p>
        </ViewStateMachine>
      </AppWrapper>
    );

    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("should render error message when present", async () => {
    render(
      <AppWrapper>
        <ViewStateMachine
          error="Some error message"
          loading={false}
          loader={<p>Loading</p>}
        >
          <p>Content</p>
        </ViewStateMachine>
      </AppWrapper>
    );

    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
    expect(screen.getByText("Some error message")).toBeInTheDocument();
  });
});
