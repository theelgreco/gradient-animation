/* CSS FILE METHODS */

import animate from "./animationFunctions.js";

// check if @keyframes linearGradient exists
function checkForGradientAnimationCSS(doc) {
  const styleSheets = doc.styleSheets;
  let arrOfKeyframes = [];

  for (let i = 0; i < styleSheets.length; i++) {
    let myRules = styleSheets[i].cssRules;
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
    const currentKeyframePercent = parseFloat(keyframesFromCss[i][1]);
    const prevKeyframePercent = parseFloat(keyframesFromCss[i - 1][1]);

    const frameDuration = calculateDurationPerFrame(
      duration,
      currentKeyframePercent,
      prevKeyframePercent
    );

    f.push({
      from: keyframesFromCss[i - 1][0],
      to: keyframesFromCss[i][0],
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

function initialiseCssOnLoad(document) {
  const arrOfKeyframes = checkForGradientAnimationCSS(document);
  let resArr = [];

  for (let i = 0; i < arrOfKeyframes.length; i++) {
    const { keyframeRuleName, keyframes } = arrOfKeyframes[i];
    const gradient = document.querySelector(`.${keyframeRuleName}`);
    if (!gradient) continue;

    let {
      animation,
      animationName,
      animationDuration,
      animationTimingFunction,
      animationIterationCount,
      backgroundImage,
      animationDelay,
    } = window.getComputedStyle(gradient);

    if (animation.split(", ")[1]) {
      animationName = animationName.split(", ")[0];
      animationDuration = animationDuration.split(", ")[0];
      animationTimingFunction = animationTimingFunction.split(", ")[0];
      animationIterationCount = animationIterationCount.split(", ")[0] || null;
      animationDelay = animationDelay.split(", ")[0] || null;
    }
    console.log(animationName);
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

    if (animationIterationCount === "infinite") {
      animationIterationCount = Infinity;
    } else if (!animationIterationCount) {
      animationIterationCount = 1;
    } else {
      animationIterationCount = parseInt(animationIterationCount);
    }

    animationDelay = parseFloat(animationDelay) * 1000;

    resArr.push([
      gradient,
      keyframes2,
      animationIterationCount,
      animationDelay,
    ]);
  }

  for (let i = 0; i < resArr.length; i++) {
    const gradient = resArr[i][0];
    const keyframes2 = resArr[i][1];
    const animationIterationCount = resArr[i][2];
    const delay = resArr[i][3];
    animate(gradient, keyframes2, {
      iterations: animationIterationCount,
      delay: delay,
    });
  }
}

export default initialiseCssOnLoad;
