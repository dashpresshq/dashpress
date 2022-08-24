export const useSiteConfig = () => ({
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Hadmean",
  homeLink: "/",
  logo: "/assets/images/logo.png",
  fullLogo: "/assets/images/full-logo.png",
});
