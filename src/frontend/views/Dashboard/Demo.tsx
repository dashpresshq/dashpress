import {
  SoftButton,
  Spacer,
  Stack,
  StyledCard,
  Text,
} from "@hadmean/chromista";
import { useSessionStorage } from "react-use";
import styled from "styled-components";

const StyledBox = styled.div`
  padding: 24px;
`;

export function DemoVideo() {
  const [value, setValue] = useSessionStorage("show-demo", "true");

  if (!process.env.NEXT_PUBLIC_DEMO_VIDEO_LINK) {
    return null;
  }
  if (value !== "true") {
    return null;
  }
  return (
    <>
      <StyledCard>
        <StyledBox>
          <Stack justify="space-between">
            <Text size="4">
              Take a sneak peek into Hadmean powerful features
            </Text>
            <Stack width="auto">
              <SoftButton
                action={() => setValue("false")}
                size="xs"
                label="Close Demo"
                icon="close"
              />
            </Stack>
          </Stack>

          <Spacer />
          <div
            style={{
              position: "relative",
              textAlign: "center",
              paddingBottom: "500px",
              height: "0",
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
            <iframe
              src={process.env.NEXT_PUBLIC_DEMO_VIDEO_LINK}
              frameBorder="0"
              allowFullScreen
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "500px",
              }}
            />
          </div>
        </StyledBox>
      </StyledCard>
      <Spacer />
    </>
  );
}
