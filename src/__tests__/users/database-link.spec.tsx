import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UsersLinkToDatabase from "@/pages/users/database-link";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";

import {
  getToastMessage,
  selectCombobox,
  waitForSkeletonsToVanish,
} from "../_/utils";

setupApiHandlers();

describe("pages/users/database-link", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

  it("should save the link form correctly", async () => {
    render(
      <TestProviders>
        <UsersLinkToDatabase />
      </TestProviders>
    );

    await waitForSkeletonsToVanish();

    await selectCombobox("Your Users Table", "entity-2");

    await selectCombobox(
      "Field Corresponding To Dashpress Usernames",
      "entity-2-string-field"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Save Users Link To Database" })
    );

    expect(await getToastMessage()).toBe(
      "Users to Database Link Saved Successfully"
    );
  });

  it("should persist the link form correctly", async () => {
    render(
      <TestProviders>
        <UsersLinkToDatabase />
      </TestProviders>
    );

    expect(
      screen.getByRole("combobox", { name: "Your Users Table" })
    ).toHaveTextContent("entity-2");

    expect(
      screen.getByRole("combobox", {
        name: "Field Corresponding To Dashpress Usernames",
      })
    ).toHaveTextContent("entity-2-string-field");
  });
});
