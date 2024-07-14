import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UserPreferences from "@/pages/account/preferences";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";

import { selectCombobox, waitForSkeletonsToVanish } from "../_/utils";

setupApiHandlers();

describe("pages/account/preferences", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(USE_ROUTER_PARAMS({}));
  });

  it("should display and update user preferences", async () => {
    render(
      <TestProviders>
        <UserPreferences />
      </TestProviders>
    );

    await waitForSkeletonsToVanish();

    expect(localStorage.getItem("theme")).toBeNull();

    expect(screen.getByRole("combobox", { name: "Theme" })).toHaveTextContent(
      "System"
    );

    await selectCombobox("Theme", "Light");

    await userEvent.click(
      screen.getByRole("button", { name: "Save Account Preferences" })
    );

    expect(screen.getByRole("combobox", { name: "Theme" })).toHaveTextContent(
      "Light"
    );

    expect(localStorage.getItem("theme")).toBe("light");
  });
});
