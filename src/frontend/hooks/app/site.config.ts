import { ISiteSettings } from "shared/types/config";
import { useAppConfiguration } from "../configuration/configuration.store";

const DEFAULT_SITE_CONFIG: ISiteSettings = {
  name: "Hadmean",
  homeLink: "/",
  logo: "/assets/images/logo.png",
  fullLogo: "/assets/images/full-logo.png",
};

export const useSiteConfig = () => {
  const { data = DEFAULT_SITE_CONFIG } =
    useAppConfiguration<ISiteSettings>("site_settings");
  return data;
};
