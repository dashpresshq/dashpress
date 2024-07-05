/* eslint-disable react/jsx-no-useless-fragment */
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { ErrorBoundary } from "../error-boundary";
import { ErrorAlert } from "../alert";

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
