/* eslint-disable react/jsx-no-useless-fragment */
import { ErrorAlert } from "@hadmean/chromista";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  loader: ReactNode;
  loading: boolean;
  error: unknown;
};

export function ViewStateMachine({ loading, error, children, loader }: Props) {
  if (loading) {
    return <>{loader}</>;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }
  return <>{children}</>;
}
