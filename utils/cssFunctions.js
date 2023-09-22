/* CSS FILE METHODS */

import animate from "./animationFunctions.js";

// check if @keyframes linearGradient exists
function checkForGradientAnimationCSS(doc) {
  let myRules = doc.styleSheets[0].cssRules;
  let keyframes;
  for (let i = 0; i < myRules.length; i++) {
    if (
      myRules[i].type === 7 &&
      myRules[i].name === "linearGradientAnimation"
    ) {
      keyframes = myRules[i];
      break;
    }
  }

  return keyframes;
}

// create array with keyframe strings => e.g, ["linear-gradient(90deg, red, black, red)"]
function formatKeyframeStrings(keyframes, backgroundImage) {
  let frames = [];
  let index = 0;
  for (let key in keyframes) {
    if (parseInt(key) > -1) {
      let regex = /linear-gradient\(.*\)/;
      let frame = keyframes[key];
      let cssText = frame.cssText;
      let keyText = frame.keyText;
      if (index === 0 && keyText !== "0%") {
        frames.push([backgroundImage, "0%"]);
      }
      frames.push([cssText.match(regex)[0], keyText]);
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

function formatKeyframes(keyframesFromCss, duration, method) {
  let f = [];

  duration = secondsStringToMs(duration);

  for (let i = 0; i < keyframesFromCss.length; i++) {
    if (i === 0) continue;

    const frameDuration = calculateDurationPerFrame(
      duration,
      parseInt(keyframesFromCss[i][1])
    );
    f.push({
      from: keyframesFromCss[i - 1][0],
      to: keyframesFromCss[i][0],
      duration: frameDuration,
      method: method,
    });
    duration -= frameDuration;
  }

  return f;
}

// convert time string to ms, e.g => "0.2s" becomes 200
function secondsStringToMs(str) {
  return parseFloat(str) * 1000;
}

// split duration between number of frames
function calculateDurationPerFrame(duration, percent) {
  const percentToDecimal = percent / 100;
  return Math.floor(duration * percentToDecimal);
}

function initialiseCssOnLoad(document) {
  const gradientAnimationFromCss = checkForGradientAnimationCSS(document);
  const gradient = document.querySelector(".linearGradientAnimation");

  let {
    animationDuration,
    animationTimingFunction,
    animationIterationCount,
    background,
  } = window.getComputedStyle(gradient);

  if (gradientAnimationFromCss && parseFloat(animationDuration)) {
    let keyframesFromCss = formatKeyframeStrings(
      gradientAnimationFromCss,
      background
    );

    let keyframes2 = formatKeyframes(
      keyframesFromCss,
      animationDuration,
      animationTimingFunction
    );

    if (animationIterationCount && animationIterationCount === "infinite") {
      animationIterationCount = Infinity;
    }

    animate(gradient, keyframes2, animationIterationCount);
  }
}

export default initialiseCssOnLoad;
