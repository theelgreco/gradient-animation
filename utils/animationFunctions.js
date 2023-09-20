/* MAIN ANIMATION METHODS */

import timingFunctions from "../utils/timingFunctions.js";

function linearGradientStringToNestedArray(str) {
  let regex = /\((.*)\)/;
  // console.log(str);

  // match string inside of parentheses (-55deg, transparent 25%) => ["-55deg", "transparent 25%"]
  let stringArray = str.match(regex)[1].split(", ");
  // nest arrays to split value from "key",
  // e.g: ["-55deg", "transparent 25%"] => [["-55, "deg"], ["transparent", "25%"]]
  let res = [];
  const strSplitArray = stringArray.map((str, index) => {
    let isRotation = str.includes("deg") || str.includes("turn");
    if (isRotation) {
      res.push(splitRotationStringToArr(str));
    } else if (index === 0) {
      res.push(["180", "deg"], [str]);
    } else {
      res.push(str.split(" "));
    }
  });

  return res;
}

function splitRotationStringToArr(str) {
  let regex = /deg|turn/;
  let match = str.match(regex)[0];
  let value = str.split(match)[0];

  if (match === "turn") {
    value = value.includes(".") ? "0." + value.split(".")[1] : value;
    value = String(360 * Number(value));
  }

  let resArr = [value, "deg"];
  return resArr;
}

// finds the differences between two nested arrays (frames) and returns the values in an object:
// e.g, arr1: [["90deg"], ["red", "20%"], ["orange"]]
//      arr2: [["90deg"], ["red", "50%"], ["orange"]]
//   => { index: 1, from: 20, to: 50, unit: "%" }
function findDiffIndex(arr1, arr2) {
  const arrLength = arr1.length;
  let diff = {};
  for (let i = 0; i < arrLength; i++) {
    if (!arr1[i][1]) continue;
    const str1 = arr1[i][0] + arr1[i][1];
    const str2 = arr2[i][0] + arr2[i][1];
    if (str1 !== str2) {
      let unitRegex = /\D+/;
      const subIndex = parseInt(str1[i][1]) > -1 ? 1 : 0;
      diff.index = i;
      diff.subIndex = subIndex;
      diff.from = parseInt(arr1[i][subIndex]);
      diff.to = parseInt(arr2[i][subIndex]);
      diff.unit = arr1[i][1].match(unitRegex)[0];
      break;
    }
  }
  return diff;
}

// put pieces of the string back together:
// e.g, ["linear-gradient(", "90deg", "red 20%", "orange"] => "linear-gradient(90deg, red 20%, orange)"
function formatStringFromArr(arr) {
  let resString = "linear-gradient(";
  let lastIndex = arr.length - 1;
  arr.forEach((subArr, index) => {
    // if subArr[0] is a num then join without spaces, e.g "90", "deg" => "90deg"
    if (parseFloat(subArr[0]) > -1) {
      resString += subArr.join("");
    } else {
      resString += subArr.join(" ");
    }

    if (index !== lastIndex) resString += ",";
  });
  resString += ")";
  return resString;
}

function animate(element, keyframes, iterations) {
  let currentIteration = 1;
  let startTime = performance.now();
  const steps = keyframes.length;
  let currentStep = 0;

  function update(currentTime) {
    const elapsedTime = currentTime - startTime;
    const currentKeyframe = keyframes[currentStep];

    // find difference
    const fromStrNestedArr = linearGradientStringToNestedArray(
      currentKeyframe.from
    );
    const toStrNestedArr = linearGradientStringToNestedArray(
      currentKeyframe.to
    );
    const { index, subIndex, from, to, unit } = findDiffIndex(
      fromStrNestedArr,
      toStrNestedArr
    );

    const { duration } = keyframes[currentStep];
    const method = timingFunctions[keyframes[currentStep].method];

    if (elapsedTime >= duration) {
      element.style.background = formatStringFromArr(toStrNestedArr);
      currentStep++;

      if (currentStep === steps) {
        currentStep = 0; // Reset to the first keyframe for the next iteration
        currentIteration++;

        if (iterations !== undefined && currentIteration > iterations) {
          return; // All iterations completed
        } else if (iterations === undefined) {
          return; // Run only once if iterations is undefined
        }
      }

      startTime = performance.now();
    }

    const progress = Math.min(elapsedTime / duration, 1);
    const easedProgress = method(progress);
    const currentValue = from + (to - from) * easedProgress;

    fromStrNestedArr[index][subIndex] =
      subIndex === 0 ? `${currentValue}` : `${currentValue}${unit}`;

    element.style.background = formatStringFromArr(fromStrNestedArr);

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

export default animate;
