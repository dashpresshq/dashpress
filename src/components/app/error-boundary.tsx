import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { GitHub } from "react-feather";
import { ErrorAlert } from "./alert";

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: null | Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error({ error, errorInfo });
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;
    if (error) {
      return (
        <ErrorAlert
          renderJsx
          action={{
            action: () => {
              window.open(
                "https://github.com/dashpresshq/dashpress/issues/new?labels=bug&template=01_BUG_REPORT.md&title=bug%3A+"
              );
            },
            Icon: GitHub,
            label: "Report Issue",
          }}
          message={
            <span>
              <p>
                <b>An Error Occurred</b>
              </p>
              <p>{error.message}</p>
            </span>
          }
        />
      );
    }

    return children;
  }
}
