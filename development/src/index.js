import {initialiseCssOnLoad} from "../utils/cssFunctions.js";
import {animateGradient} from "../utils/animationFunctions.js";

/* CHECKS FIRST IF CSS PROVIDED */
if (typeof document !== "undefined") {
  initialiseCssOnLoad(document);
}

export default animateGradient