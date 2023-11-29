import { extractCSSVars } from "src/utils/helpers";

import colors from "src/styles/exports/colors.module.scss";

export const COLOR = extractCSSVars<string>(colors, (a: string) => a) as Readonly<Constant.Color>;