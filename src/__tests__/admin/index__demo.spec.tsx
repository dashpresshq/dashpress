import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";

import Dashboard from "pages";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

import userEvent from "@testing-library/user-event";

setupApiHandlers();

jest.mock("next/router", () => require("next-router-mock"));

describe("(Demo Video)", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should not render demo when there is no YOUTUBE_ID", async () => {
    render(
      <AppWrapper>
        <Dashboard />
      </AppWrapper>
    );

    expect(screen.queryByText("Features Walkthrough")).not.toBeInTheDocument();
  });

  it("should show demo when there is YOUTUBE_ID in env", async () => {
    process.env.NEXT_PUBLIC_YOUTUBE_ID = "32YLu8xhfWE";

    render(
      <AppWrapper>
        <Dashboard />
      </AppWrapper>
    );

    expect(screen.getByText("Features Walkthrough")).toBeInTheDocument();
  });

  it("should close demo", async () => {
    process.env.NEXT_PUBLIC_YOUTUBE_ID = "32YLu8xhfWE";

    render(
      <AppWrapper>
        <Dashboard />
      </AppWrapper>
    );

    await userEvent.click(screen.getByRole("button", { name: "Close Intro" }));

    expect(screen.queryByText("Features Walkthrough")).not.toBeInTheDocument();
  });
});
