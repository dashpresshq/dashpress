import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";
import EntityDictionSettings from "pages/admin/[entity]/config/diction";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/[entity]/config/diction", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        entity: "entity-1",
      },
    }));
  });

  it("should display diction values", async () => {
    render(
      <AppWrapper>
        <EntityDictionSettings />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Plural")).toHaveValue("Plural entity-1");
    });
    expect(screen.getByLabelText("Singular")).toHaveValue("Singular entity-1");
  });

  it("should update diction successfully", async () => {
    render(
      <AppWrapper>
        <EntityDictionSettings />
      </AppWrapper>
    );

    await userEvent.type(screen.getByLabelText("Plural"), "Update Plural");
    await userEvent.type(screen.getByLabelText("Singular"), "Update Singular");

    await userEvent.click(
      screen.getByRole("button", { name: "Update Diction" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "App Settings Saved Successfully"
    );
  });
});
