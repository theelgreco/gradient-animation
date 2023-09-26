// import bezierEasing from "../node_modules/bezier-easing/src/index.ts";

/* TIMING FUNCTIONS */

function easeInSine(x) {
  return 1 - Math.cos((x * Math.PI) / 2);
}

function easeOutSine(x) {
  return Math.sin((x * Math.PI) / 2);
}

function easeInOutSine(x) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

function easeInQuad(x) {
  return x * x;
}

function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function linear(x) {
  return x;
}

const timingFunctions = {
  linear: linear,
  "ease-in": easeInSine,
  "ease-out": easeOutSine,
  "ease-in-out": easeInOutSine,
  easeInQuad: easeInQuad,
  easeOutBack: easeOutBack,
  easeInOutCubic: easeInOutCubic,
};

export {timingFunctions};
