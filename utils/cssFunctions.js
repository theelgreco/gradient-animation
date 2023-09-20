/* CSS FILE METHODS */

import animate from "./animationFunctions.js";

// check if @keyframes linearGradient exists
function checkForGradientAnimationCSS(doc) {
  let myRules = doc.styleSheets[0].cssRules;
  let keyFrames;
  for (let i = 0; i < myRules.length; i++) {
    if (
      myRules[i].type === 7 &&
      myRules[i].name === "linearGradientAnimation"
    ) {
      keyFrames = myRules[i];
      break;
    }
  }
  return keyFrames;
}

// create array with keyframe strings => e.g, ["linear-gradient(90deg, red, black, red)"]
function formatKeyframeStrings(keyframes) {
  let frames = [];
  for (let key in keyframes) {
    if (parseInt(key) > -1) {
      let regex = /linear-gradient\(.*\)/;
      let frame = keyframes[key];
      let cssText = frame.cssText;
      frames.push(cssText.match(regex)[0]);
    }
  }
  return frames;
}

// take keyframe strings and convert to keyframe object
function formatKeyframes(keyframesFromCss, duration, method) {
  let f = [];
  for (let i = 0; i < keyframesFromCss.length; i++) {
    if (i === 0) continue;
    f.push({
      from: keyframesFromCss[i - 1],
      to: keyframesFromCss[i],
      duration: duration,
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
function calculateDurationPerFrame(duration, numberOfFrames) {
  return Math.floor(duration / (numberOfFrames - 1));
}

function initialiseCssOnLoad(document) {
  const gradientAnimationFromCss = checkForGradientAnimationCSS(document);

  if (gradientAnimationFromCss) {
    const gradient = document.querySelector(".linearGradientAnimation");
    let {
      animationDuration,
      animationTimingFunction,
      animationIterationCount,
    } = window.getComputedStyle(gradient);
    let keyframesFromCss = formatKeyframeStrings(gradientAnimationFromCss);

    const duration = calculateDurationPerFrame(
      secondsStringToMs(animationDuration),
      keyframesFromCss.length
    );

    const keyframes2 = formatKeyframes(
      keyframesFromCss,
      duration,
      animationTimingFunction
    );

    if (animationIterationCount && animationIterationCount === "infinite") {
      animationIterationCount = Infinity;
    }

    animate(gradient, keyframes2, animationIterationCount);
  }
}

export default initialiseCssOnLoad;
