import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";
import EntitiesSettings from "pages/admin/settings/entities";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/settings/entities", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {},
    }));
  });

  it("should display all entities with correct state", async () => {
    render(
      <AppWrapper>
        <EntitiesSettings />
      </AppWrapper>
    );

    const allCheckBoxes = await screen.findAllByRole("checkbox");

    expect(allCheckBoxes).toHaveLength(5);

    expect(allCheckBoxes[0]).toBeChecked();
    expect(allCheckBoxes[1]).toBeChecked();
    expect(allCheckBoxes[2]).toBeChecked();
    await waitFor(() => {
      expect(allCheckBoxes[3]).not.toBeChecked();
    });
    expect(allCheckBoxes[4]).not.toBeChecked();
  });

  it("should toogle entities state successfully", async () => {
    render(
      <AppWrapper>
        <EntitiesSettings />
      </AppWrapper>
    );

    const allCheckBoxes = await screen.findAllByRole("checkbox");

    userEvent.click(allCheckBoxes[0]);
    userEvent.click(allCheckBoxes[0]);

    userEvent.click(allCheckBoxes[1]);

    userEvent.click(allCheckBoxes[3]);

    await userEvent.click(
      screen.getAllByRole("button", { name: "Save Changes" })[0]
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "App Settings Saved Successfully"
    );
  });

  it("should display updated entities state", async () => {
    render(
      <AppWrapper>
        <EntitiesSettings />
      </AppWrapper>
    );

    const allCheckBoxes = await screen.findAllByRole("checkbox");

    expect(allCheckBoxes[0]).toBeChecked();
    await waitFor(() => {
      expect(allCheckBoxes[1]).not.toBeChecked();
    });
    expect(allCheckBoxes[2]).toBeChecked();
    expect(allCheckBoxes[3]).toBeChecked();
    expect(allCheckBoxes[4]).not.toBeChecked();
  });
});
