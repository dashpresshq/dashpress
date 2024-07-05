import { noop } from "shared/lib/noop";

import type { WidgetFormField } from "../../types";

interface IProps {
  formFields: WidgetFormField[];
}

export function PortalFormFields({ formFields }: IProps) {
  noop(formFields);
  return null;
}
