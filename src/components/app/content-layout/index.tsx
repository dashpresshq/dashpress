import { ReactElement, ReactNode } from "react";

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
    <div className="grid gap-4 grid-cols-1 md:grid-cols-[2fr,8fr]">
      {children}
    </div>
  );
};

ContentLayout.Left = function SectionLeft({ children }: IProps) {
  return <div className="flex flex-col gap-3">{children}</div>;
};

ContentLayout.Right = function SectionRight({ children }: IProps) {
  return (
    <div className="overflow-x-hidden min-h-[calc(100vh-100px)] mb-2 flex flex-col gap-3">
      {children}
    </div>
  );
};

ContentLayout.Center = function SectionCenter({ children }: IProps) {
  return (
    <div className="flex justify-center mb-3">
      <div className="max-w-[1200px] w-full flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
};
