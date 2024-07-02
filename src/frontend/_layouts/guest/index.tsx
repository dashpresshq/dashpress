import { ReactNode } from "react";
import Head from "next/head";
import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";
import { useAppTheme } from "../useAppTheme";
import { CardContent, CardHeader } from "@/components/ui/card";

interface IProps {
  children: ReactNode;
  title: MessageDescriptor;
  subTitle?: MessageDescriptor;
}

export function AuthLayout({ children, title, subTitle }: IProps) {
  const {
    data: { fullLogo, homeLink, name },
  } = useAppConfiguration("site_settings");
  useAppTheme();
  const { _ } = useLingui();

  let value = 0.2;

  const getRandom = () => {
    value -= 0.025;
    return `hsla(var(--dp-primary),${value})`;
  };

  return (
    <>
      <Head>
        <title>
          {_(title)} - {name}
        </title>
      </Head>
      <div className="relative bg-primary">
        <div className="absolute overflow-hidden justify-center inset-0 items-center flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-lvw h-lvh"
            viewBox="0 0 1600 800"
          >
            <rect fill="#000" width="1600" height="800" />
            <g
              stroke="hsla(var(--dp-primary))"
              strokeWidth="66.7"
              strokeOpacity="0.05"
            >
              <circle fill={getRandom()} cx="0" cy="0" r="1800" />
              <circle fill={getRandom()} cx="0" cy="0" r="1700" />
              <circle fill={getRandom()} cx="0" cy="0" r="1600" />
              <circle fill={getRandom()} cx="0" cy="0" r="1500" />
              <circle fill={getRandom()} cx="0" cy="0" r="1400" />
              <circle fill={getRandom()} cx="0" cy="0" r="1300" />
              <circle fill={getRandom()} cx="0" cy="0" r="1200" />
              <circle fill={getRandom()} cx="0" cy="0" r="1100" />
              <circle fill={getRandom()} cx="0" cy="0" r="1000" />
              <circle fill={getRandom()} cx="0" cy="0" r="900" />
              <circle fill={getRandom()} cx="0" cy="0" r="800" />
              <circle fill={getRandom()} cx="0" cy="0" r="700" />
              <circle fill={getRandom()} cx="0" cy="0" r="600" />
              <circle fill={getRandom()} cx="0" cy="0" r="500" />
              <circle fill={getRandom()} cx="0" cy="0" r="400" />
              <circle fill={getRandom()} cx="0" cy="0" r="300" />
              <circle fill={getRandom()} cx="0" cy="0" r="200" />
              <circle fill={getRandom()} cx="0" cy="0" r="100" />
            </g>
          </svg>
        </div>
        <div className="flex justify-center items-center h-lvh relative">
          <div className="w-full max-w-lg m-4">
            <CardHeader className="flex gap-2 flex-col items-center bg-primary rounded-xl rounded-b-none">
              {fullLogo && (
                <a href={homeLink}>
                  <img src={fullLogo} className="w-40" alt="logo" />
                </a>
              )}
              <p className="text-white">{_(title)}</p>
              {subTitle && <p className="text-white text-xs">{_(subTitle)}</p>}
            </CardHeader>
            <CardContent className="rounded-xl rounded-t-none">
              {children}
            </CardContent>
          </div>
        </div>
      </div>
    </>
  );
}
