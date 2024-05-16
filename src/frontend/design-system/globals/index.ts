import { createGlobalStyle } from "styled-components";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { LIGHT_MODE } from "../theme/modes";
import { GLOBAL_NORMALIZE_CSS } from "./normalize";
import { GLOBAL_TOOLTIP_CSS } from "./tooltip";
import { GLOBAL_OFF_CANVAS_CSS } from "./off-canvas";
import { colorModeToRootColors } from "../theme/generate";
import { USE_ROOT_COLOR, prefixVarNameSpace } from "../theme/root";
import { DEFAULT_PRIMARY_COLOR } from "../theme/constants";

const rootColorString = typescriptSafeObjectDotEntries(
  colorModeToRootColors(DEFAULT_PRIMARY_COLOR, LIGHT_MODE)
)
  .map(([key, value]) => `${prefixVarNameSpace(key)}: ${value}`)
  .join(";");

export const GlobalStyles = createGlobalStyle`
*,
*::before,
*::after {
  box-sizing: border-box
}

${GLOBAL_NORMALIZE_CSS}

${GLOBAL_TOOLTIP_CSS}

${GLOBAL_OFF_CANVAS_CSS}

:root {
  ${rootColorString};
}

html {
  font-family: "Inter", sans-serif;
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  position: relative;
  min-height: 100%
}

body {
  margin: 0;
  font-weight: 400;
  color: ${USE_ROOT_COLOR("main-text")};
  background-color: ${USE_ROOT_COLOR("base-color")};
  min-height: 100vh;
  letter-spacing: 0.1px;
  line-height: 1.5;
  position: relative;
}

[tabindex="-1"]:focus:not(:focus-visible) {
  outline: 0 !important
}

a {
  font-family: "Inter", sans-serif;
  color: ${USE_ROOT_COLOR("primary-color")};
  text-decoration: none;
  background-color: transparent
}

a:hover {
  color: ${USE_ROOT_COLOR("primary-color")};
}

button:focus {
  outline: 1px dotted;
  outline: 5px auto -webkit-focus-ring-color
}

button::-moz-focus-inner {
  padding: 0;
  border-style: none
}

* {
  outline: none !important
}

@media (max-width: 1024px) {
  body {
      display: block !important
  }
}

@media print {

  *,
  *::before,
  *::after {
      text-shadow: none !important;
      box-shadow: none !important
  }

  a:not(.btn) {
      text-decoration: underline
  }

  img {
      page-break-inside: avoid
  }

  p {
      orphans: 3;
      widows: 3
  }

  @page {
      size: a3
  }

  body {
      min-width: 992px !important
  }
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  margin-bottom: .5rem;
  font-weight: 500;
  line-height: 1.2;
  color: ${USE_ROOT_COLOR("main-text")};

}

svg {
  overflow: hidden;
  vertical-align: middle;
}

.fade {
  transition: opacity .15s linear;
}

.gaussian-blur {
  filter: url(#gaussian-blur);
  filter: blur(2px);
}
`;
