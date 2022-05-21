/** @jsxImportSource @emotion/react */

import type { ReactNode } from 'react';

import { css } from '@emotion/react';

type SlotLabelProps = {
  children: ReactNode;
  isSmall?: boolean;
};

const slotLabelStyles = css({
  textAlign: 'center',
});

export const SlotLabel = ({ children, isSmall = false }: SlotLabelProps) => {
  const Component = isSmall ? 'h4' : 'h3';
  return <Component css={slotLabelStyles}>{children}</Component>;
};