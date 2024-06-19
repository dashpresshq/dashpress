import { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";
import { SystemIconsKeys } from "shared/constants/Icons";

export const DEMO_LINKS: {
  id: string;
  systemIcon: SystemIconsKeys;
  label: MessageDescriptor;
  action: string;
}[] = [
  {
    id: "github",
    systemIcon: "Github",
    label: msg`Star us on Github`,
    action: "https://github.com/dashpresshq/dashpress",
  },
  {
    id: "twitter",
    systemIcon: "Twitter",
    label: msg`Follow us on Twitter`,
    action: "https://twitter.com/dashpressHQ",
  },
  {
    id: "discord",
    systemIcon: "Discord",
    label: msg`Join our Discord community`,
    action: "https://discord.gg/aV6DxwXhzN",
  },
  {
    id: "website",
    systemIcon: "Link",
    label: msg`Visit our website`,
    action: "https://dashpress.io",
  },
];
