import { useModelMenuItems } from "../../data-store/navigation.data-store";
import { NavigationLayout } from "../_layouts/app";

export function ListModel() {
//   const fields = getModelFields("users");
  const modelNavigation = useModelMenuItems();

  if(modelNavigation.isFetching){
      return "Loading";
  }

  return <NavigationLayout navigationItems={modelNavigation.data}>Foo List</NavigationLayout>;
}
