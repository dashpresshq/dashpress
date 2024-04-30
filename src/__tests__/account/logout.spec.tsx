import { render, screen, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import AccountPassword from "pages/account/password";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";

Object.defineProperty(window, "location", {
  value: {
    ...window.location,
    replace: jest.fn(),
  },
  writable: true,
});

setupApiHandlers();

const useRouter = jest.spyOn(require("next/router"), "useRouter");

useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

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
