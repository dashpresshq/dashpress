import { render, screen } from "@testing-library/react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";

import RoleCreate from "@/pages/roles/create";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";

import { getToastMessage } from "../_/utils";

setupApiHandlers();

describe("pages/roles/create", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  it("should create new role", async () => {
    const pushMock = jest.fn();

    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        pushMock,
      })
    );

    render(
      <TestProviders>
        <RoleCreate />
      </TestProviders>
    );

    await userEvent.type(await screen.findByLabelText("Name"), "Some New Role");

    await userEvent.click(screen.getByRole("button", { name: "Create Role" }));

    expect(await getToastMessage()).toBe(
      "Role Created SuccessfullyView Details"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "View Details" }),
      { pointerEventsCheck: PointerEventsCheckLevel.Never }
    );

    expect(pushMock).toHaveBeenCalledWith("/roles/some-new-role");
  });
});
