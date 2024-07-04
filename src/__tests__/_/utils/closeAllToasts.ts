import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const closeAllToasts = async () => {
  await userEvent.keyboard("{Escape}");
};

export const expectToast = async (message: string) => {
  expect(
    await within(screen.getByRole("region")).findByRole("status")
  ).toHaveTextContent(message);
};
