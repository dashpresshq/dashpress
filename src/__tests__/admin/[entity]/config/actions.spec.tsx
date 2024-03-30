import React from "react";
import { render, screen, within } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import EntityFormActionsSettings from "pages/admin/[entity]/config/actions";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { getTableRows } from "__tests__/_/utils/getTableRows";
import { closeAllToasts } from "__tests__/_/utils/closeAllToasts";

setupApiHandlers();

describe("pages/admin/[entity]/config/actions", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        entity: "test-entity",
      },
      isReady: true,
    }));
  });

  it("should list entity form actions", async () => {
    render(
      <ApplicationRoot>
        <EntityFormActionsSettings />x
      </ApplicationRoot>
    );

    expect(await screen.findByRole("table")).toBeInTheDocument();

    expect(await getTableRows(screen.getByRole("table")))
      .toMatchInlineSnapshot(`
      [
        "Integration|Trigger|Action|Action",
        "Http|Create|Post",
        "Smtp|Update|Send Mail",
        "Slack|Delete|Send Message",
      ]
    `);
  });

  it("should create new form action successfully", async () => {
    render(
      <ApplicationRoot>
        <EntityFormActionsSettings />
      </ApplicationRoot>
    );

    await userEvent.click(
      await screen.findByRole("button", { name: "Add New Form Action" })
    );

    const dialog = screen.getByRole("dialog");

    await userEvent.type(within(dialog).getByLabelText("Trigger"), "On Create");
    await userEvent.keyboard("{Enter}");

    await userEvent.click(
      within(dialog).getByRole("option", { name: "Slack" })
    );

    expect(
      within(dialog).queryByRole("option", { name: "Non Activated Actions" })
    ).not.toBeInTheDocument();

    await userEvent.type(
      within(dialog).getByLabelText("Action"),
      "Send Message"
    );
    await userEvent.keyboard("{Enter}");

    await userEvent.type(
      await within(dialog).findByLabelText("Slack: Channel"),
      "{{ CONSTANTS.SLACK_CHANNEL }}"
    );

    await userEvent.type(
      within(dialog).getByLabelText("Slack: Message"),
      "Hello how are you"
    );

    await userEvent.click(screen.getByLabelText("Slack: Should Notify"));

    await userEvent.click(
      within(dialog).getByRole("button", { name: "Create Form Action" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Form Action Created Successfully"
    );

    expect(
      screen.queryByRole("button", { name: "Create Form Action" })
    ).not.toBeInTheDocument();

    expect(await getTableRows(screen.getByRole("table")))
      .toMatchInlineSnapshot(`
      [
        "Integration|Trigger|Action|Action",
        "Http|Create|Post",
        "Smtp|Update|Send Mail",
        "Slack|Delete|Send Message",
        "Slack|Create|Send Message",
      ]
    `);

    await closeAllToasts();
  });

  it("should show the correct form values", async () => {
    render(
      <ApplicationRoot>
        <EntityFormActionsSettings />
      </ApplicationRoot>
    );

    expect(await screen.findByRole("table")).toBeInTheDocument();

    const tableRows = await screen.findAllByRole("row");

    await userEvent.click(
      within(tableRows[4]).getByRole("button", {
        name: "Edit Form Action",
      })
    );

    const dialog = screen.getByRole("dialog");
    //
    expect(
      within(dialog).getByTestId("react-select__trigger")
    ).toHaveTextContent("On Create");

    expect(
      within(dialog).getByRole("option", { selected: true })
    ).toHaveTextContent("Slack");

    expect(
      within(dialog).getByTestId("react-select__action")
    ).toHaveTextContent("Send Message - slack");

    expect(await within(dialog).findByLabelText("Slack: Channel")).toHaveValue(
      "{ CONSTANTS.SLACK_CHANNEL }}"
    );
    expect(within(dialog).getByLabelText("Slack: Message")).toHaveValue(
      "Hello how are you"
    );
    expect(within(dialog).getByLabelText("Slack: Should Notify")).toBeChecked();
  });

  it("should update the actions form", async () => {
    render(
      <ApplicationRoot>
        <EntityFormActionsSettings />
      </ApplicationRoot>
    );

    expect(await screen.findByRole("table")).toBeInTheDocument();

    const tableRows = await screen.findAllByRole("row");

    await userEvent.click(
      within(tableRows[4]).getByRole("button", {
        name: "Edit Form Action",
      })
    );

    const dialog = screen.getByRole("dialog");

    await userEvent.type(within(dialog).getByLabelText("Trigger"), "On Delete");
    await userEvent.keyboard("{Enter}");

    await userEvent.click(within(dialog).getByRole("option", { name: "SMTP" }));

    await userEvent.type(within(dialog).getByLabelText("Action"), "Send Mail");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(
      await within(dialog).findByLabelText("SMTP: From"),
      "{{ CONSTANTS.MAIL_FROM }}"
    );

    await userEvent.type(
      within(dialog).getByLabelText("SMTP: To"),
      "to@gmail.com"
    );

    await userEvent.click(
      within(dialog).getByRole("button", { name: "Update Form Action" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Form Action Updated Successfully"
    );

    await closeAllToasts();

    expect(await getTableRows(screen.getByRole("table")))
      .toMatchInlineSnapshot(`
      [
        "Integration|Trigger|Action|Action",
        "Http|Create|Post",
        "Smtp|Update|Send Mail",
        "Slack|Delete|Send Message",
        "Smtp|Delete|Send Mail",
      ]
    `);
  });

  it("should show the correct form values", async () => {
    render(
      <ApplicationRoot>
        <EntityFormActionsSettings />
      </ApplicationRoot>
    );

    expect(await screen.findByRole("table")).toBeInTheDocument();

    const tableRows = await screen.findAllByRole("row");

    await userEvent.click(
      within(tableRows[4]).getByRole("button", {
        name: "Edit Form Action",
      })
    );

    const dialog = screen.getByRole("dialog");
    //
    expect(
      within(dialog).getByTestId("react-select__trigger")
    ).toHaveTextContent("On Delete");

    expect(
      within(dialog).getByRole("option", { selected: true })
    ).toHaveTextContent("SMTP");

    expect(
      within(dialog).getByTestId("react-select__action")
    ).toHaveTextContent("Send Mail - smtp");

    expect(await within(dialog).findByLabelText("SMTP: From")).toHaveValue(
      "{ CONSTANTS.MAIL_FROM }}"
    );
    expect(within(dialog).getByLabelText("SMTP: To")).toHaveValue(
      "to@gmail.com"
    );
  });

  it("should delete form action successfully", async () => {
    render(
      <ApplicationRoot>
        <EntityFormActionsSettings />
      </ApplicationRoot>
    );

    expect(await screen.findByRole("table")).toBeInTheDocument();

    const tableRows = await screen.findAllByRole("row");

    expect(tableRows).toHaveLength(5);

    await userEvent.click(
      within(tableRows[1]).getByRole("button", {
        name: "Delete Form Action",
      })
    );

    const confirmBox = await screen.findByRole("alertdialog", {
      name: "Confirm Delete",
    });

    await userEvent.click(
      await within(confirmBox).findByRole("button", { name: "Confirm" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Form Action Deleted Successfully"
    );

    expect(await screen.findAllByRole("row")).toHaveLength(4);
  });
});
