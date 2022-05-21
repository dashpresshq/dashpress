import { NavigationLayout } from "../../views/_layouts/app";

export function ConfigureApp() {
  return (
    <NavigationLayout navigationItems={[{ title: "Something to configure", link: "Something to configure" }]}>
      Configure App
    </NavigationLayout>
  );
}
