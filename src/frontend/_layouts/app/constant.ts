import { GitHub, Globe, Twitter, Users } from "react-feather";

export const DEMO_LINKS = [
  {
    id: "github",
    IconComponent: GitHub,
    label: "Star us on Github",
    description: `Tell us DashPress is a useful project by dropping us a star`,
    link: "https://github.com/dashpresshq/dashpress",
  },
  {
    id: "twitter",
    IconComponent: Twitter,
    label: "Follow us on Twitter",
    description: `Tweet at @dashpressHQ if you know others will benefit using DashPress`,
    link: "https://twitter.com/dashpressHQ",
  },
  {
    id: "users",
    IconComponent: Users,
    label: "Join our Discord community",
    description: `Ask your questions here`,
    link: "https://discord.gg/aV6DxwXhzN",
  },
  {
    id: "website",
    IconComponent: Globe,
    label: "Visit our website",
    description: `For more links on documentation, roadmap, blog etc`,
    link: "https://dashpress.io",
  },
];
