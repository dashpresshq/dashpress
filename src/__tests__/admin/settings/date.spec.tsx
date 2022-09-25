import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";
import DateFormatSettings from "pages/admin/settings/date";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/settings/date", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
    }));
  });

  it("should display date values", async () => {
    render(
      <AppWrapper>
        <DateFormatSettings />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Format")).toHaveValue("do MMM yyyy");
    });
  });

  it("should update date successfully", async () => {
    render(
      <AppWrapper>
        <DateFormatSettings />
      </AppWrapper>
    );

    userEvent.type(screen.getByLabelText("Format"), "yyyy MMM do");

    await userEvent.click(
      screen.getByRole("button", { name: "Update Date Format" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "App Settings Saved Successfully"
    );
  });

  it("should display updated date values", async () => {
    render(
      <AppWrapper>
        <DateFormatSettings />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Format")).toHaveValue("yyyy MMM do");
    });
  });
});
