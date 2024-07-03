import { waitFor, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const closeAllToasts = async () => {
  const toast = await screen.findByRole("button", {
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

export const expectToast = async (message: string) => {
  expect(
    await within(screen.getByRole("region")).findByRole("status")
  ).toHaveTextContent(message);
};
