import * as React from "react";
import { render, screen } from "@testing-library/react";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";
import { ViewStateMachine } from ".";

describe("<ViewStateMachine />", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

  it("should render only loader when loading", async () => {
    render(
      <TestProviders>
        <ViewStateMachine error={null} loading loader={<p>Loading</p>}>
          <p>Content</p>
        </ViewStateMachine>
      </TestProviders>
    );

    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("should render only content when not loading", async () => {
    render(
      <TestProviders>
        <ViewStateMachine error={null} loading={false} loader={<p>Loading</p>}>
          <p>Content</p>
        </ViewStateMachine>
      </TestProviders>
    );

    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("should render error message when present", async () => {
    render(
      <TestProviders>
        <ViewStateMachine
          error="Some error message"
          loading={false}
          loader={<p>Loading</p>}
        >
          <p>Content</p>
        </ViewStateMachine>
      </TestProviders>
    );

    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
    expect(screen.getByText("Some error message")).toBeInTheDocument();
  });
});
