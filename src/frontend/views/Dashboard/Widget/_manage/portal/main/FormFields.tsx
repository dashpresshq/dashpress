import noop from "lodash/noop";
import { WidgetFormField } from "../../types";

interface IProps {
  formFields: WidgetFormField[];
}

export function PortalFormFields({ formFields }: IProps) {
  noop(formFields);
  return null;
}
