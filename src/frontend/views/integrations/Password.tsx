import { SchemaForm } from "frontend/components/SchemaForm";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { Typo } from "frontend/design-system/primitives/Typo";
import { usePasswordStore } from "./password.store";

export function PasswordMessage() {
  return (
    <Typo.SM textStyle="italic">
      All the values provided from this form will encrypted using `aes-256-gcm`
      before been saved.
    </Typo.SM>
  );
}

export function PasswordToReveal({
  label,
  isLoading,
}: {
  label: string;
  isLoading: boolean;
}) {
  const passwordStore = usePasswordStore();

  return (
    <>
      <Typo.SM textStyle="italic">
        For security reasons, Please input your account password to be able to
        manage {label}
      </Typo.SM>
      <Spacer />
      <SchemaForm
        fields={{
          password: {
            type: "password",
            validations: [
              {
                validationType: "required",
              },
            ],
          },
        }}
        onSubmit={async ({ password }: { password: string }) => {
          passwordStore.setPassword(password);
        }}
        icon="eye"
        buttonText={() =>
          isLoading ? `Revealing ${label}` : `Reveal ${label}`
        }
      />
    </>
  );
}
