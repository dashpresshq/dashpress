import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountProfile from "pages/account/profile";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";

setupApiHandlers();

const useRouter = jest.spyOn(require("next/router"), "useRouter");

useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

describe("pages/account/profile", () => {
  it("should display profile details", async () => {
    render(
      <TestProviders>
        <AccountProfile />
      </TestProviders>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toHaveValue("Root User");
    });
  });

  it("should update profile successfully", async () => {
    render(
      <TestProviders>
        <AccountProfile />
      </TestProviders>
    );

    await userEvent.clear(screen.getByLabelText("Name"));

    await userEvent.type(screen.getByLabelText("Name"), "Updated Name");

    await userEvent.click(
      screen.getByRole("button", { name: "Save Account Profile" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Account Profile Saved Successfully"
    );
  });

  it("should display updated profile details", async () => {
    render(
      <TestProviders>
        <AccountProfile />
      </TestProviders>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toHaveValue("Updated Name");
    });
  });
});
