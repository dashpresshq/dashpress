/* eslint-disable react/no-array-index-key */
import { BaseSkeleton } from "frontend/design-system/components/Skeleton/Base";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { Stack } from "frontend/design-system/primitives/Stack";
import { useThemeColorShade } from "frontend/design-system/theme/useTheme";
import { Fragment } from "react";

export function NavigationSkeleton() {
  const getThemeColorShade = useThemeColorShade();

  const SCHEMA = [
    "header",
    "item",
    "item",
    "header",
    "item",
    "item",
    "item",
    "item",
    "item",
    "header",
    "item",
    "item",
    "item",
  ];

  return (
    <Stack
      $direction="column"
      $spacing={16}
      style={{ padding: 24, marginTop: 48 }}
    >
      {SCHEMA.map((type, index) => {
        if (type === "header") {
          return (
            <Fragment key={index}>
              <Spacer size="sm" />
              <BaseSkeleton
                height="25px"
                style={{
                  background: getThemeColorShade("primary-color", 35),
                  maxWidth: "120px",
                }}
              />
            </Fragment>
          );
        }
        return (
          <BaseSkeleton
            key={index}
            height="25px"
            style={{
              background: getThemeColorShade("primary-color", 35),
            }}
          />
        );
      })}
    </Stack>
  );
}
