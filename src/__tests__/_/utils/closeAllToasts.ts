import { waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const closeAllToasts = async () => {
  const toast = screen.getByRole("button", {
    name: "Close Toast",
  });

  await userEvent.click(toast);

  await waitFor(
    () => {
      expect(toast).not.toBeInTheDocument();
    },
    { timeout: 20000 }
  );
};
