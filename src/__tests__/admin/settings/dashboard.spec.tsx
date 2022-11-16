import "@testing-library/jest-dom";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";

import ManageDashboard from "pages/admin/settings/dashboard";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

jest.mock("next/router", () => require("next-router-mock"));

jest.mock("nanoid", () => ({
  nanoid: jest.fn().mockReturnValueOnce("new_id_1").mockReturnValueOnce("2"),
}));

describe.skip("pages/admin/settings/dashboard", () => {
  describe("Summary Card", () => {
    it("should create summary card widget", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      await userEvent.click(
        screen.getByRole("button", { name: "New Dashboard Item" })
      );

      // await screen.findByRole("p", { name: "New Dashboard Item" });

      await userEvent.type(screen.getByLabelText("Title"), "New Summary Card");

      await userEvent.type(screen.getByLabelText("Entity"), "Entity 1");
      await userEvent.keyboard("{Enter}");

      await userEvent.type(screen.getByLabelText("Type"), "Summary Card");
      await userEvent.keyboard("{Enter}");

      await userEvent.type(screen.getByLabelText("Color"), "green");
      await userEvent.keyboard("{Enter}");

      await userEvent.type(screen.getByLabelText("SVG"), "<p>Demo SVG</p>");
      await userEvent.keyboard("{Enter}");

      await userEvent.click(screen.getByRole("button", { name: "Save" }));

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Widget Created Successfully"
      );
    });

    it.skip("should show the new summary card widget", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );
      const secondWidget = await screen.findByTestId("widget__new_id_1");

      expect(
        await within(secondWidget).findByText("New Summary Card")
      ).toBeInTheDocument();
      expect(
        await within(secondWidget).findByText("Demo SVG")
      ).toBeInTheDocument();
      expect(await within(secondWidget).findByText("8")).toBeInTheDocument();
    });
  });

  // Should create table widget
  // Should delete card and table
  // Should update card and table
  // Should re-arrange card and table
});
