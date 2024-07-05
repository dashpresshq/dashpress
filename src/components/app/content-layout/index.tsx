import type { ReactElement, ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

type TContentLayout = ((params: IProps) => ReactElement) & {
  Left: (params: IProps) => ReactElement;
  Right: (params: IProps) => ReactElement;
  Center: (params: IProps) => ReactElement;
};

// eslint-disable-next-line react/function-component-definition
export const ContentLayout: TContentLayout = ({ children }: IProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr,8fr]">
      {children}
    </div>
  );
};

ContentLayout.Left = function SectionLeft({ children }: IProps) {
  return <div className="flex flex-col gap-3">{children}</div>;
};

ContentLayout.Right = function SectionRight({ children }: IProps) {
  return (
    <div className="mb-2 flex min-h-[calc(100vh-100px)] flex-col gap-4 overflow-x-hidden">
      {children}
    </div>
  );
};

ContentLayout.Center = function SectionCenter({ children }: IProps) {
  return (
    <div className="mb-3 flex justify-center">
      <div className="flex w-full max-w-[1200px] flex-col gap-3">
        {children}
      </div>
    </div>
  );
};
