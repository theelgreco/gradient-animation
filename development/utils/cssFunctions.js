/* CSS FILE METHODS */

import {animateGradient} from "./animationFunctions.js";

// check if @keyframes linearGradient exists
function checkForGradientAnimationCSS(doc) {
  const styleSheets = doc.styleSheets;
  let arrOfKeyframes = [];

  for (let i = 0; i < styleSheets.length; i++) {
    // check for external stylesheet
    const { href } = styleSheets[i];
    const { origin } = window.location;
    // if the stylesheet is external then ignore and continue to next iteration
    if (href && !href.includes(origin)) continue;

    const myRules = styleSheets[i].cssRules;
    for (let j = 0; j < myRules.length; j++) {
      let keyframes;
      let keyframeRuleName;
      if (
        myRules[j].type === 7 &&
        myRules[j].name.includes("gradient-animation")
      ) {
        keyframes = myRules[j];
        keyframeRuleName = myRules[j].name;
        arrOfKeyframes.push({ keyframeRuleName, keyframes });
        // break;
      }
    }
  }

  return arrOfKeyframes;
  // return { animationName, keyframes };
}

// create array with keyframe strings from css @keyframes rule e.g,
// "100% { background-image: linear-gradient(90deg, red, black, red) );
//  => ["linear-gradient(90deg, red, black, red)", "100%"]
function formatKeyframeStrings(keyframes, backgroundImage) {
  let frames = [];
  let index = 0;
  for (let key in keyframes) {
    // prettier-ignore
    // only look in the objects that have a number as a key, these contain the info we want
    if (parseInt(key) > -1) {
      let regex = /(linear|repeating-linear|radial|repeating-radial)-gradient\(.*\)/;
      let frame = keyframes[key];
      let cssText = frame.cssText;
      let keyText = frame.keyText;
      if (index === 0 && keyText !== "0%") {
        frames.push([backgroundImage, "0%"]);
      }
      frames.push([cssText.match(regex)[0], keyText]);
    } else {
      break;
    }
    index++;
  }

  return frames;
}

// take keyframe strings array and convert to keyframe array of objects,
// e.g, [
//       "linear-gradient(90deg, red, black 50%, red)",
//       "linear-gradient(90deg, red, black 100%, red)"
//      ]
//   => {
//        from: "linear-gradient(90deg, red, black 50%, red)",
//        to: "linear-gradient(90deg, red, black 100%, red)",
//        duration: 2000,
//        method: "linear"
//      }
function formatKeyframes(stepsFromCss, duration, method) {
  let f = [];

  duration = secondsStringToMs(duration);

  for (let i = 0; i < stepsFromCss.length; i++) {
    if (i === 0) continue;
    const currentKeyframePercent = parseFloat(stepsFromCss[i][1]);
    const prevKeyframePercent = parseFloat(stepsFromCss[i - 1][1]);

    const frameDuration = calculateDurationPerFrame(
      duration,
      currentKeyframePercent,
      prevKeyframePercent
    );

    // linear-gradient strings
    const prevValue = stepsFromCss[i - 1][0];
    const currentValue = stepsFromCss[i][0];

    f.push({
      from: prevValue === "none" ? currentValue : prevValue,
      to: currentValue,
      duration: frameDuration,
      method: method,
    });
  }

  return f;
}

// convert time string to ms, e.g => "0.2s" becomes 200
function secondsStringToMs(str) {
  return parseFloat(str) * 1000;
}

// split duration between number of frames
function calculateDurationPerFrame(
  duration,
  currentKeyframePercent,
  prevKeyframePercent
) {
  const percentToDecimal = (currentKeyframePercent - prevKeyframePercent) / 100;
  return Math.floor(duration * percentToDecimal);
}

function checkForTransitions(document) {}

function initialiseCssOnLoad(document) {
  const arrOfKeyframes = checkForGradientAnimationCSS(document);
  let resArr = [];

  for (let i = 0; i < arrOfKeyframes.length; i++) {
    const { keyframeRuleName, keyframes } = arrOfKeyframes[i];
    const gradient = document.querySelector(`.${keyframeRuleName}`);
    if (!gradient) continue;

    const computedStyle = window.getComputedStyle(gradient);

    let {
      animation,
      animationName,
      animationDuration,
      animationTimingFunction,
      animationIterationCount,
      backgroundImage,
      animationDelay,
      animationFillMode,
      animationDirection,
    } = computedStyle;

    let animationStartDelay = computedStyle.getPropertyValue(
      "--animation-start-delay"
    );

    if (animation.split(", ")[1]) {
      animationName = animationName.split(", ")[0];
      animationDuration = animationDuration.split(", ")[0];
      animationTimingFunction = animationTimingFunction.split(", ")[0];
      animationIterationCount = animationIterationCount.split(", ")[0] || null;
      animationDelay = animationDelay.split(", ")[0] || null;
      animationFillMode = animationFillMode.split(", ")[0] || null;
      animationDirection = animationDirection.split(", ")[0] || null;
    }

    if (animationName !== "gradient") {
      if (!animationName.includes("_gradient_")) continue;
    }
    if (!keyframes && !parseFloat(animationDuration)) continue;

    let keyframesFromCss = formatKeyframeStrings(keyframes, backgroundImage);

    let keyframes2 = formatKeyframes(
      keyframesFromCss,
      animationDuration,
      animationTimingFunction
    );

    animationDelay = parseFloat(animationDelay) * 1000;

    const startDelayIsMs = animationStartDelay.includes("ms");
    animationStartDelay = parseFloat(animationStartDelay);

    if (!startDelayIsMs) animationStartDelay *= 1000;

    resArr.push([
      gradient,
      keyframes2,
      animationIterationCount,
      animationDelay,
      animationStartDelay,
      animationFillMode,
      animationDirection,
    ]);
  }

  for (let i = 0; i < resArr.length; i++) {
    const gradient = resArr[i][0];
    const keyframes2 = resArr[i][1];
    const animationIterationCount = resArr[i][2];
    const delay = resArr[i][3];
    const startDelay = resArr[i][4];
    const fill = resArr[i][5];
    const direction = resArr[i][6];

    animateGradient(gradient, keyframes2, {
      iterations: animationIterationCount,
      delay: delay,
      startDelay: startDelay,
      fill: fill,
      direction: direction,
    });
  }
}

export {initialiseCssOnLoad};
