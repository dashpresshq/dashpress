import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useEffect } from "react";

export const useAppTheme = () => {
  const themeColor = useAppConfiguration<{ primary: string }>("theme_color");
  useEffect(() => {
    if (themeColor.data?.primary) {
      const primaryColor = themeColor.data?.primary;
      document.documentElement.style.setProperty(
        "--hadmean-primary-color",
        primaryColor
      );
      document.documentElement.style.setProperty(
        "--hadmean-primary-shade-color",
        `${primaryColor}1A`
      );
    }
  }, [themeColor]);
};
