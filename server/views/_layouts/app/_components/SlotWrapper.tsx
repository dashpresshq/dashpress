/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

type SlotWrapperProps = {
  borderColor?: string;
  children: React.ReactNode;
  className?: string;
  hasExtraPadding?: boolean;
  minHeight?: string | number;
  noHorizontalScrollbar?: boolean;
};

const slotWrapperStyles = css({
  boxSizing: 'border-box',
  height: '100%',
  padding: 8,
  backgroundColor: token('color.background.neutral.subtle', 'white'),
  outlineOffset: -4,
  overflowY: 'auto',
});

const extraPaddingStyles = css({
  minWidth: 50,
  padding: '8px 28px',
});

export const SlotWrapper = ({
  borderColor,
  children,
  className,
  hasExtraPadding,
  minHeight,
  noHorizontalScrollbar,
}: SlotWrapperProps) => (
  <div
    className={className}
    css={[slotWrapperStyles, hasExtraPadding && extraPaddingStyles]}
    style={{
      minHeight,
      outline: borderColor ? `2px dashed ${borderColor}` : 'none',
      overflowX: noHorizontalScrollbar ? 'hidden' : 'auto',
    }}
  >
    {children}
  </div>
);
