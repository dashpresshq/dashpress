import { render } from "@testing-library/react";
import React, { MutableRefObject } from "react";

export function renderHook(
  renderCallback: (input?: () => void) => void,
  options: {
    initialProps?: () => void;
    wrapper?: React.JSXElementConstructor<{ children: React.ReactElement }>;
  } = {}
) {
  const { initialProps, wrapper } = options;
  const result = React.createRef<null>() as MutableRefObject<any>;

  function TestComponent({
    renderCallbackProps,
  }: {
    renderCallbackProps?: () => void;
  }) {
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const pendingResult = renderCallback(renderCallbackProps);

    React.useEffect(() => {
      result.current = pendingResult;
    });

    return null;
  }

  const { rerender: baseRerender } = render(
    <TestComponent renderCallbackProps={initialProps} />,
    { wrapper }
  );

  function rerender(rerenderCallbackProps?: () => void) {
    return baseRerender(
      <TestComponent renderCallbackProps={rerenderCallbackProps} />
    );
  }

  return { result, rerender };
}
