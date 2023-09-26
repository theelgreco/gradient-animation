import animate from "../utils/animationFunctions.js";
import initialiseCssOnLoad from "../utils/cssFunctions.js";

/* CHECKS FIRST IF CSS PROVIDED */
if (typeof document !== "undefined") {
  initialiseCssOnLoad(document);
}

export default animate;
