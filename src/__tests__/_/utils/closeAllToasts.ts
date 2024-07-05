import { screen, within } from "@testing-library/react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";

export const closeAllToasts = async () => {
  await userEvent.keyboard("{Escape}");
};

export const expectToast = async (message: string) => {
  expect(
    await within(screen.getByRole("region")).findByRole("status")
  ).toHaveTextContent(message);
};

export const getToastMessage = async () => {
  return (await within(screen.getByRole("region")).findByRole("status"))
    .textContent;
};

export const confirmDelete = async () => {
  const confirmBox = await screen.findByRole("alertdialog", {
    name: "Confirm Delete",
  });

  await userEvent.click(
    await within(confirmBox).findByRole("button", { name: "Continue" }),
    { pointerEventsCheck: PointerEventsCheckLevel.Never }
  );
};
