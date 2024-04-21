import { render, screen, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import AccountPassword from "pages/account/password";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

Object.defineProperty(window, "location", {
  value: {
    ...window.location,
    replace: jest.fn(),
  },
  writable: true,
});

setupApiHandlers();

jest.mock("next/router", () => require("next-router-mock"));

describe("pages/account/logout", () => {
  it("should log user out", async () => {
    render(
      <ApplicationRoot>
        <AccountPassword />
      </ApplicationRoot>
    );

    await userEvent.click(
      await screen.findByRole("button", { name: "Log Out" })
    );

    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith("/auth");
    });
  });
});
