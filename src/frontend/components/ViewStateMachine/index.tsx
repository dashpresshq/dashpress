/* eslint-disable react/jsx-no-useless-fragment */
import { ErrorAlert } from "frontend/design-system/components/Alert";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { ErrorBoundary } from "../ErrorBoundary";

type Props = {
  children: ReactNode;
  loader: ReactNode;
  loading: boolean;
  error: unknown;
};

export function ViewStateMachine({ loading, error, children, loader }: Props) {
  const router = useRouter();
  if (loading || !router.isReady) {
    return <>{loader}</>;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
}
