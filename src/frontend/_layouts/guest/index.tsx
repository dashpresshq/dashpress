import { ReactNode } from "react";
import Head from "next/head";
import styled from "styled-components";
import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";
import { useAppTheme } from "../useAppTheme";
import { CardContent, CardHeader } from "@/components/ui/card";

interface IProps {
  children: ReactNode;
  title: MessageDescriptor;
  subTitle?: MessageDescriptor;
}

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
        <div className="flex justify-center items-center h-dvh">
          <div className="w-full max-w-lg m-4">
            <CardHeader className="flex gap-2 flex-col items-center bg-primary">
              {fullLogo && (
                <a href={homeLink}>
                  <img src={fullLogo} className="w-40" alt="logo" />
                </a>
              )}
              <p className="text-white">{_(title)}</p>
              {subTitle && <p className="text-white text-xs">{_(subTitle)}</p>}
            </CardHeader>

            <CardContent>{children}</CardContent>
          </div>
        </div>
      </Container>
    </>
  );
}
