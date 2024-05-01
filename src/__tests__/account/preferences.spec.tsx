import { render, screen, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import UserPreferences from "pages/account/preferences";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";

setupApiHandlers();

describe("pages/account/preferences", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(USE_ROUTER_PARAMS({}));
  });

  it("should display user preferences", async () => {
    render(
      <ApplicationRoot>
        <UserPreferences />
      </ApplicationRoot>
    );
    await waitFor(() => {
      expect(screen.getByRole("option", { selected: true })).toHaveTextContent(
        "Dark"
      );
    });
  });

  it("should update user preference", async () => {
    render(
      <ApplicationRoot>
        <UserPreferences />
      </ApplicationRoot>
    );
    await userEvent.click(screen.getByRole("option", { name: "Light" }));

    await userEvent.click(
      screen.getByRole("button", { name: "Save Account Preferences" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Account Preferences Saved Successfully"
    );
  });

  it("should display updated preference", async () => {
    render(
      <ApplicationRoot>
        <UserPreferences />
      </ApplicationRoot>
    );
    await waitFor(() => {
      expect(screen.getByRole("option", { selected: true })).toHaveTextContent(
        "Light"
      );
    });
  });
});
