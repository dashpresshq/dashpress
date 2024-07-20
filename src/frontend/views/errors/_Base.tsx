import { msg } from "@lingui/macro";
import Head from "next/head";

import { SoftButton } from "@/components/app/button/soft";
import { useAppTheme } from "@/frontend/_layouts/useAppTheme";
import { useAppConfiguration } from "@/frontend/hooks/configuration/configuration.store";
import { NAVIGATION_LINKS } from "@/frontend/lib/routing/links";

interface IProps {
  code: number;
  message: string;
  description: string;
  Icon: React.ReactNode;
}

export function BaseErrorCmp({ code, description, message, Icon }: IProps) {
  const {
    data: { name },
  } = useAppConfiguration("site_settings");

  useAppTheme();

  return (
    <>
      <Head>
        <title>
          {message} - {name}
        </title>
      </Head>
      <div className="flex h-lvh w-lvw flex-col items-center justify-center gap-6 bg-foundation">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-main">{code}</h1>
          <h3 className="text-muted">{message}</h3>
        </div>
        {Icon}
        <p className="text-muted">{description}</p>
        <SoftButton
          action={NAVIGATION_LINKS.DASHBOARD.HOME}
          label={msg`Go Home`}
          size="lg"
          systemIcon="Home"
        />
      </div>
    </>
  );
}
