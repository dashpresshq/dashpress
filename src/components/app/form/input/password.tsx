import { useToggle } from "frontend/hooks/state/useToggleState";
import { msg } from "@lingui/macro";
import { ISharedFormInput } from "./types";
import { FormInput } from "./text";

export function FormPasswordInput(formInput: ISharedFormInput) {
  const { rightActions = [] } = formInput;
  const showPassword = useToggle();
  return (
    <FormInput
      {...formInput}
      type={showPassword.isOn ? undefined : "password"}
      rightActions={[
        ...rightActions,
        showPassword.isOn
          ? {
              systemIcon: "EyeOff" as const,
              action: showPassword.toggle,
              label: msg`Hide Password`,
            }
          : {
              systemIcon: "Eye" as const,
              action: showPassword.toggle,
              label: msg`Show Password`,
            },
      ]}
    />
  );
}
