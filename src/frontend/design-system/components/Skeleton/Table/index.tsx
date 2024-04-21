import styled from "styled-components";
import { Stack } from "frontend/design-system/primitives/Stack";
import { BaseSkeleton } from "../Base";

const columnCount = 5;

const Root = styled.div`
  padding: 8px;
`;

export interface IProps {
  lean?: true;
}

export function TableSkeleton({ lean }: IProps) {
  return (
    <Root>
      {Array.from({ length: lean ? 5 : 10 }, (_, k) => k + 1).map(
        (key, index) => (
          <div key={key}>
            {index > 0 && (
              <BaseSkeleton height="1px" style={{ margin: "4px 0" }} />
            )}
            <Stack>
              {Array.from({ length: columnCount }, (_, k) => k + 1).map(
                (key$1) => (
                  <BaseSkeleton
                    key={key$1}
                    height="24px"
                    style={{ margin: "4px 0", flex: key$1 % 3 ? 2 : 1 }}
                  />
                )
              )}
              {!lean && (
                <Stack style={{ flexBasis: 70, margin: "4px 0" }}>
                  <BaseSkeleton height="24px" width="24px" circle />
                  <BaseSkeleton height="24px" width="24px" circle />
                </Stack>
              )}
            </Stack>
          </div>
        )
      )}
    </Root>
  );
}
