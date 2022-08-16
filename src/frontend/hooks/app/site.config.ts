export const useSiteConfig = () => ({
  name: process.env.NEXT_PUBLIC_SITE_NAME || "My Site",
  homeLink: "/",
  logo: "/assets/images/logo.svg",
});
