import "@testing-library/jest-dom";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";

import ManageVariables from "pages/actions/variables";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";

setupApiHandlers();

describe("pages/actions/constants", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");
  beforeAll(() => {
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        key: "foo",
      },
    }));
  });

  describe("list", () => {
    it("should list constants", async () => {
      render(
        <AppWrapper>
          <ManageVariables />
        </AppWrapper>
      );

      expect(
        await screen.findByRole("row", {
          name: "Key Sort By Key Filter By Search Value Sort By Value Action",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("row", {
          name: "{{ CONSTANT.BASE_URL }} http://base.com",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("row", {
          name: "{{ CONSTANT.FOO_CONSTANT_KEY }} foo constant value",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("row", {
          name: "{{ CONSTANT.BAR_CONSTANT_KEY }} bar constant value",
        })
      ).toBeInTheDocument();
    });
  });

  describe("create", () => {
    it("should create new constant", async () => {
      render(
        <AppWrapper>
          <ManageVariables />
        </AppWrapper>
      );
      await userEvent.click(
        await screen.findByRole("button", { name: "Add New Constant" })
      );

      expect(
        within(screen.getByRole("dialog")).getByText("Create Constant")
      ).toBeInTheDocument();

      await userEvent.type(screen.getByLabelText("Key"), "NEW_KEY");
      await userEvent.type(screen.getByLabelText("Value"), "new value");

      await userEvent.click(screen.getByRole("button", { name: "Save" }));

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Constant Saved Successfully"
      );
    });

    it("should show created constant", async () => {
      render(
        <AppWrapper>
          <ManageVariables />
        </AppWrapper>
      );

      expect(
        screen.getByRole("row", {
          name: "{{ CONSTANT.NEW_KEY }} new value",
        })
      ).toBeInTheDocument();
    });
  });

  describe("update", () => {
    it("should update constant", async () => {
      render(
        <AppWrapper>
          <ManageVariables />
        </AppWrapper>
      );

      const tableRows = await screen.findAllByRole("row");

      expect(tableRows).toHaveLength(5);

      await userEvent.click(
        within(tableRows[1]).getByRole("button", {
          name: "Edit",
        })
      );

      expect(
        within(screen.getByRole("dialog")).getByText("Update Constant")
      ).toBeInTheDocument();

      expect(screen.getByLabelText("Key")).toBeDisabled();

      await userEvent.type(screen.getByLabelText("Value"), "/updated");

      await userEvent.click(screen.getByRole("button", { name: "Save" }));

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "Constant Saved Successfully"
      );
    });

    it("should show updated constant", async () => {
      render(
        <AppWrapper>
          <ManageVariables />
        </AppWrapper>
      );

      expect(
        screen.getByRole("row", {
          name: "{{ CONSTANT.BASE_URL }} http://base.com/updated",
        })
      ).toBeInTheDocument();
    });
  });

  describe("delete", () => {
    it("should delete constants", async () => {
      render(
        <AppWrapper>
          <ManageVariables />
        </AppWrapper>
      );

      const tableRows = await screen.findAllByRole("row");

      expect(tableRows).toHaveLength(5);

      await userEvent.click(
        within(tableRows[2]).getByRole("button", {
          name: "Delete Button",
        })
      );

      const confirmBox = await screen.findByRole("alertdialog", {
        name: "Confirm Delete",
      });

      await userEvent.click(
        await within(confirmBox).findByRole("button", { name: "Confirm" })
      );

      expect(await screen.findAllByRole("row")).toHaveLength(4);

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "Constant Deleted Successfully"
      );
    });
  });
});
