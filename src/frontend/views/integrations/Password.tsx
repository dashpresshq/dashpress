import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { SchemaForm } from "@/components/app/form/schema";
import { usePasswordStore } from "./password.store";

export function PasswordMessage() {
  return (
    <p className="italic text-sm">
      All the values provided from this form will encrypted using `aes-256-gcm`
      before been saved.
    </p>
  );
}

export function PasswordToReveal({ isLoading }: { isLoading: boolean }) {
  const { _ } = useLingui();
  const passwordStore = usePasswordStore();

  return (
    <div className="px-3">
      <p className="italic text-sm mb-3">
        {_(
          msg`For security reasons, Please input your account password to reveal credentials`
        )}
      </p>

      <SchemaForm
        fields={{
          password: {
            label: msg`Password`,
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
        systemIcon="Unlock"
        buttonText={() =>
          isLoading ? msg`Revealing Credentials` : msg`Reveal Credentials`
        }
      />
    </div>
  );
}
