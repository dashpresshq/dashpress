import {
  SoftButton,
  Spacer,
  Stack,
  StyledCard,
  Typo,
} from "@hadmean/chromista";
import { useSessionStorage } from "react-use";
import styled from "styled-components";

const StyledBox = styled.div`
  padding: 24px;
`;

export function DemoVideo() {
  const [value, setValue] = useSessionStorage("show-demo", "true");

  if (!process.env.NEXT_PUBLIC_YOUTUBE_ID) {
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
            <Typo.MD>Features Walkthrough</Typo.MD>
            <Stack width="auto">
              <SoftButton
                action={() => setValue("false")}
                size="xs"
                label="Close Intro"
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
              overflow: "hidden",
              height: "0",
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${process.env.NEXT_PUBLIC_YOUTUBE_ID}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Hadmean Features"
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </StyledBox>
      </StyledCard>
      <Spacer />
    </>
  );
}
