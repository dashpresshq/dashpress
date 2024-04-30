import { Z_INDEXES } from "../constants/zIndex";
import { SYSTEM_COLORS } from "../theme/system";

export const GLOBAL_OFF_CANVAS_CSS = `
.offcanvas-backdrop{
    position: fixed;
    top: 0;
    left: 0;
    z-index: ${Z_INDEXES.offCanvas - 1};
    width: 100vw;
    height: 100vh;
    background-color: ${SYSTEM_COLORS.black};
    
      &.fade{
          opacity: 0;
      }
    
      &.show{
        opacity: 0.5;
      }
    }
`;
