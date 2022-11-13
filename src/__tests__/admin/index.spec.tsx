import "@testing-library/jest-dom";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";

import Dashboard from "pages/admin";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

jest.mock("next/router", () => require("next-router-mock"));

describe("pages/admin", () => {
  it("should render dashboard widgets correctly", async () => {
    render(
      <AppWrapper>
        <Dashboard />
      </AppWrapper>
    );

    const layoutContent = screen.getByTestId("app-layout__content");

    expect(
      await within(layoutContent).findByText("Table Widget 1")
    ).toBeInTheDocument();

    expect(
      await within(layoutContent).findByText("Sumary Widget 1")
    ).toBeInTheDocument();
  });
});
