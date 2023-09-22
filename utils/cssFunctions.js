/* CSS FILE METHODS */

import animate from "./animationFunctions.js";

// check if @keyframes linearGradient exists
function checkForGradientAnimationCSS(doc) {
  let myRules = doc.styleSheets[0].cssRules;
  let arrOfKeyframes = [];
  for (let i = 0; i < myRules.length; i++) {
    let keyframes;
    let animationName;
    if (
      myRules[i].type === 7 &&
      myRules[i].name.includes("linear-gradient-animation")
    ) {
      keyframes = myRules[i];
      animationName = myRules[i].name;
      arrOfKeyframes.push({ animationName, keyframes });
      // break;
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
  console.log(duration);
  for (let i = 0; i < keyframesFromCss.length; i++) {
    if (i === 0) continue;
    const currentKeyframePercent = parseInt(keyframesFromCss[i][1]);
    const prevKeyframePercent = parseInt(keyframesFromCss[i - 1][1]);

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
    const { animationName, keyframes } = arrOfKeyframes[i];
    const gradient = document.querySelector(`.${animationName}`);

    if (gradient) {
      let {
        animationDuration,
        animationTimingFunction,
        animationIterationCount,
        background,
      } = window.getComputedStyle(gradient);

      if (keyframes && parseFloat(animationDuration)) {
        let keyframesFromCss = formatKeyframeStrings(keyframes, background);

        let keyframes2 = formatKeyframes(
          keyframesFromCss,
          animationDuration,
          animationTimingFunction
        );

        if (animationIterationCount && animationIterationCount === "infinite") {
          animationIterationCount = Infinity;
        }

        animationIterationCount = parseInt(animationIterationCount);

        resArr.push([gradient, keyframes2, animationIterationCount]);
      }
    }
  }

  for (let i = 0; i < resArr.length; i++) {
    const gradient = resArr[i][0];
    const keyframes2 = resArr[i][1];
    const animationIterationCount = resArr[i][2];
    animate(gradient, keyframes2, animationIterationCount);
  }
}

export default initialiseCssOnLoad;
