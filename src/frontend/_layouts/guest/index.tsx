import { ReactNode } from "react";
import Head from "next/head";
import styled from "styled-components";
import { SHADOW_CSS, CardBody } from "frontend/design-system/components/Card";
import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";
import { useAppTheme } from "../useAppTheme";

interface IProps {
  children: ReactNode;
  title: MessageDescriptor;
  subTitle?: MessageDescriptor;
}

const Root = styled.div`
  ${SHADOW_CSS}
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-width: 0px;
  width: 100%;
  max-width: 500px;
  margin: 16px;
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${USE_ROOT_COLOR("foundation-color")};
  background-image: radial-gradient(
    ${USE_ROOT_COLOR("primary-color")} 0.75px,
    ${USE_ROOT_COLOR("foundation-color")} 0.75px
  );
  background-size: 15px 15px;
`;

const WrapperRow = styled(Stack)`
  height: 100vh;
`;

const Header = styled(CardBody)`
  background-color: ${USE_ROOT_COLOR("primary-color")};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  padding: 0px;
  text-align: center;
  padding: 1rem;
`;

export function AuthLayout({ children, title, subTitle }: IProps) {
  const {
    data: { fullLogo, homeLink, name },
  } = useAppConfiguration("site_settings");
  useAppTheme();
  const { _ } = useLingui();
  return (
    <>
      <Head>
        <title>
          {_(title)} - {name}
        </title>
      </Head>
      <Container>
        <WrapperRow $justify="center" $align="center">
          <Root>
            <Header>
              <a href={homeLink}>
                <Spacer />
                {fullLogo && <img src={fullLogo} height="40" alt="logo" />}
                <Spacer />
                <Typo.MD $color="inverse">{_(title)}</Typo.MD>
                <Spacer size="xs" />
                {subTitle && <Typo.XS $color="inverse">{_(subTitle)}</Typo.XS>}
              </a>
            </Header>

            <CardBody>{children}</CardBody>
          </Root>
        </WrapperRow>
      </Container>
    </>
  );
}
