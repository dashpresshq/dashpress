import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import GeneralDataSettings from "pages/admin/settings/data";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/settings/data", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      isReady: true,
    }));
  });

  describe("Metadata", () => {
    it("should display metadata columns", async () => {
      render(
        <ApplicationRoot>
          <GeneralDataSettings />
        </ApplicationRoot>
      );
      await waitFor(() => {
        expect(screen.getByLabelText("Created At")).toHaveValue("created_at");
      });
      expect(screen.getByLabelText("Updated At")).toHaveValue("updated_at");
    });

    it("should update metadata columns successfully", async () => {
      render(
        <ApplicationRoot>
          <GeneralDataSettings />
        </ApplicationRoot>
      );

      await userEvent.type(screen.getByLabelText("Created At"), "-created");
      await userEvent.type(screen.getByLabelText("Updated At"), "-updated");

      await userEvent.click(
        screen.getByRole("button", { name: "Save Metadata Columns" })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Metadata Columns Saved Successfully"
      );
    });

    it("should display updated date values", async () => {
      render(
        <ApplicationRoot>
          <GeneralDataSettings />
        </ApplicationRoot>
      );
      await waitFor(() => {
        expect(screen.getByLabelText("Created At")).toHaveValue(
          "created_at-created"
        );
      });
      expect(screen.getByLabelText("Updated At")).toHaveValue(
        "updated_at-updated"
      );
    });
  });

  describe("Date", () => {
    it("should display date values", async () => {
      render(
        <ApplicationRoot>
          <GeneralDataSettings />
        </ApplicationRoot>
      );
      await waitFor(() => {
        expect(screen.getByLabelText("Format")).toHaveValue("do MMM yyyy");
      });
    });

    it("should update date successfully", async () => {
      render(
        <ApplicationRoot>
          <GeneralDataSettings />
        </ApplicationRoot>
      );

      await userEvent.clear(screen.getByLabelText("Format"));

      await userEvent.type(screen.getByLabelText("Format"), "yyyy MMM do");

      await userEvent.click(
        screen.getByRole("button", { name: "Close Toast" })
      );

      await userEvent.click(
        screen.getByRole("button", { name: "Save Date Format" })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Date Format Saved Successfully"
      );
    });

    it("should display updated date values", async () => {
      render(
        <ApplicationRoot>
          <GeneralDataSettings />
        </ApplicationRoot>
      );
      await waitFor(() => {
        expect(screen.getByLabelText("Format")).toHaveValue("yyyy MMM do");
      });
    });

    describe("invalid date formats", () => {
      it("should not be updated", async () => {
        render(
          <ApplicationRoot>
            <GeneralDataSettings />
          </ApplicationRoot>
        );

        await userEvent.clear(screen.getByLabelText("Format"));

        await userEvent.type(screen.getByLabelText("Format"), "yyYXXYY");

        await userEvent.click(
          screen.getByRole("button", { name: "Save Date Format" })
        );

        expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
          `Invalid Date Format!. Please go to https://date-fns.org/docs/format to see valid formats`
        );
      });

      it("should show date format", async () => {
        render(
          <ApplicationRoot>
            <GeneralDataSettings />
          </ApplicationRoot>
        );
        await waitFor(() => {
          expect(screen.getByLabelText("Format")).toHaveValue("yyyy MMM do");
        });
      });
    });
  });
});
