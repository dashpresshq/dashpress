import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import {
  closeAllToasts,
  getToastMessage,
} from "__tests__/_/utils/closeAllToasts";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GeneralDataSettings from "pages/admin/settings/data";

setupApiHandlers();

describe("pages/admin/settings/data", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");

    useRouter.mockImplementation(USE_ROUTER_PARAMS({}));
  });

  describe("Metadata", () => {
    it("should display metadata columns", async () => {
      render(
        <TestProviders>
          <GeneralDataSettings />
        </TestProviders>
      );
      await waitFor(() => {
        expect(screen.getByLabelText("Created At")).toHaveValue("created_at");
      });
      expect(screen.getByLabelText("Updated At")).toHaveValue("updated_at");
    });

    it("should update metadata columns successfully", async () => {
      render(
        <TestProviders>
          <GeneralDataSettings />
        </TestProviders>
      );

      await userEvent.type(screen.getByLabelText("Created At"), "-created");
      await userEvent.type(screen.getByLabelText("Updated At"), "-updated");

      await userEvent.click(
        screen.getByRole("button", { name: "Save Metadata Columns" })
      );

      expect(await getToastMessage()).toBe(
        "Metadata Columns Saved Successfully"
      );

      await closeAllToasts();
    });

    it("should display updated date values", async () => {
      render(
        <TestProviders>
          <GeneralDataSettings />
        </TestProviders>
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
        <TestProviders>
          <GeneralDataSettings />
        </TestProviders>
      );
      await waitFor(() => {
        expect(screen.getByLabelText("Format")).toHaveValue("do MMM yyyy");
      });
    });

    it("should update date successfully", async () => {
      render(
        <TestProviders>
          <GeneralDataSettings />
        </TestProviders>
      );

      await userEvent.clear(screen.getByLabelText("Format"));

      await userEvent.type(screen.getByLabelText("Format"), "yyyy MMM do");

      await userEvent.click(
        screen.getByRole("button", { name: "Save Date Format" })
      );

      expect(await getToastMessage()).toBe("Date Format Saved Successfully");
    });

    it("should display updated date values", async () => {
      render(
        <TestProviders>
          <GeneralDataSettings />
        </TestProviders>
      );
      await waitFor(() => {
        expect(screen.getByLabelText("Format")).toHaveValue("yyyy MMM do");
      });
    });

    describe("invalid date formats", () => {
      it("should not be updated", async () => {
        render(
          <TestProviders>
            <GeneralDataSettings />
          </TestProviders>
        );

        await userEvent.clear(screen.getByLabelText("Format"));

        await userEvent.type(screen.getByLabelText("Format"), "yyYXXYY");

        await userEvent.click(
          screen.getByRole("button", { name: "Save Date Format" })
        );

        expect(await getToastMessage()).toBe(
          `Invalid Date FormatPlease go to https://date-fns.org/docs/format to see valid formats`
        );
      });

      it("should show date format", async () => {
        render(
          <TestProviders>
            <GeneralDataSettings />
          </TestProviders>
        );
        await waitFor(() => {
          expect(screen.getByLabelText("Format")).toHaveValue("yyyy MMM do");
        });
      });
    });
  });
});
