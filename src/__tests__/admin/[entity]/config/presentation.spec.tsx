/* eslint-disable no-useless-escape */

import { render, screen, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";

import EntityPresentationScriptSettings from "pages/admin/[entity]/config/presentation";
import { closeAllToasts } from "__tests__/_/utils/closeAllToasts";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";

setupApiHandlers();

describe("pages/admin/[entity]/config/presentation", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  useRouter.mockImplementation(
    USE_ROUTER_PARAMS({
      query: {
        entity: "entity-1",
      },
    })
  );
  it("should show current section value", async () => {
    render(
      <ApplicationRoot>
        <EntityPresentationScriptSettings />
      </ApplicationRoot>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Script")).toHaveValue("");
    });
  });

  it("should update when provided value correctly", async () => {
    render(
      <ApplicationRoot>
        <EntityPresentationScriptSettings />
      </ApplicationRoot>
    );

    await userEvent.type(
      screen.getByLabelText("Script"),
      "return 'Hannah Frederick'"
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Save Presentation Scripts",
      })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Presentation Scripts Saved Successfully"
    );

    await closeAllToasts();
  });

  it("should display updated value", async () => {
    render(
      <ApplicationRoot>
        <EntityPresentationScriptSettings />
      </ApplicationRoot>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Script")).toHaveValue(
        "return 'Hannah Frederick'"
      );
    });
  });

  it("should not update when invalid JS is provided", async () => {
    render(
      <ApplicationRoot>
        <EntityPresentationScriptSettings />
      </ApplicationRoot>
    );

    await userEvent.type(screen.getByLabelText("Script"), "invalid");

    await userEvent.click(
      screen.getByRole("button", {
        name: "Save Presentation Scripts",
      })
    );
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Expression: •JS-Error: SyntaxError: Unexpected identifier"
    );

    await closeAllToasts();
  });

  it("should display previous section value", async () => {
    render(
      <ApplicationRoot>
        <EntityPresentationScriptSettings />
      </ApplicationRoot>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Script")).toHaveValue(
        "return 'Hannah Frederick'"
      );
    });
  });

  it("should be able to be cleared", async () => {
    render(
      <ApplicationRoot>
        <EntityPresentationScriptSettings />
      </ApplicationRoot>
    );

    await userEvent.clear(screen.getByLabelText("Script"));

    await userEvent.click(
      screen.getByRole("button", {
        name: "Save Presentation Scripts",
      })
    );
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Presentation Scripts Saved Successfully"
    );
  });

  it("should display cleared value correctly", async () => {
    render(
      <ApplicationRoot>
        <EntityPresentationScriptSettings />
      </ApplicationRoot>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Script")).toHaveValue("");
    });
  });
});
