import { Icon, Plus, Save } from "react-feather";
import { NAVIGATION_LINKS } from "../../lib/routing/links";

enum EntitySettingTypes {
  CRUD,
  Table,
  Diction,
}
export const ENTITY_ACTION_MENU_ITEMS: Record<
  EntitySettingTypes,
  {
    label: string;
    IconComponent: Icon;
    onClick: (entity: string) => string;
  }
> = {
  [EntitySettingTypes.CRUD]: {
    label: "CRUD Settings",
    IconComponent: Plus,
    onClick: NAVIGATION_LINKS.ENTITY.CONFIG.CRUD,
  },
  [EntitySettingTypes.Table]: {
    label: "Table Settings",
    IconComponent: Save,
    onClick: NAVIGATION_LINKS.ENTITY.CONFIG.TABLE,
  },
  [EntitySettingTypes.Diction]: {
    label: "CRUD Settings",
    IconComponent: Save,
    onClick: NAVIGATION_LINKS.ENTITY.CONFIG.DICTION,
  },
};


const useEntityActionMenuItems = () => {
    // const rout
    // return 
};