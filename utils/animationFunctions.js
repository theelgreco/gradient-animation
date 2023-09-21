/* MAIN ANIMATION METHODS */

import timingFunctions from "../utils/timingFunctions.js";

function linearGradientStringToNestedArray(str) {
  const regex = /linear-gradient\((.*)\)/;
  const splitRegex = /(?<=[a-z\)%]), /;
  // match string inside of parentheses (-55deg, transparent 25%) => ["-55deg", "transparent 25%"]

  const stringArray = str.match(regex)[1].split(splitRegex);
  // nest arrays to split value from "key",
  // e.g: ["-55deg", "transparent 25%"] => [["-55, "deg"], ["transparent", "25%"]]

  const res = [];
  for (let i = 0; i < stringArray.length; i++) {
    const subStr = stringArray[i];
    // console.log(subStr);
    const isRotation = subStr.includes("deg") || subStr.includes("turn");
    const splitStr = subStr.split(/(?<=[a-z\)]) /);
    if (isRotation) {
      res.push(splitRotationStringToArr(subStr));
    } else if (i === 0) {
      res.push(["180", "deg"]);
      res.push(splitStr);
    } else {
      res.push(splitStr);
    }
  }

  console.log(res);
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
    // removed the commented lines for now as they were glitching if one frame to another had the same value, e.g no changes from frame 1 to 2

    let unitRegex = /\D+/;
    const subIndex = parseFloat(arr1[i][1]) > -1 ? 1 : 0;
    diff.index = i;
    diff.subIndex = subIndex;
    diff.startValue = parseFloat(arr1[i][subIndex]);
    diff.endValue = parseFloat(arr2[i][subIndex]);
    diff.unit = arr1[i][1].match(unitRegex)[0];
    break;
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
  console.log("starting animation...");
  let currentIteration = 1;
  let startTime = performance.now();
  const steps = keyframes.length;
  let currentStep = 0;

  function update(currentTime) {
    console.log("animating...");
    const elapsedTime = currentTime - startTime;
    const currentKeyframe = keyframes[currentStep];

    // Takes the from property and turns into a nested array, e.g:
    // from: "linear-gradient(90deg, red, orange 50%, red)",
    //    => [["90", "deg"], ["red"], ["orange", "50%"], ["red"]]
    const fromStrNestedArr = linearGradientStringToNestedArray(
      currentKeyframe.from
    );

    // Takes the to property and turns into a nested array, e.g:
    // from: "linear-gradient(90deg, red, orange 50%, red)",
    //    => [["90", "deg"], ["red"], ["orange", "10%"], ["red"]]
    const toStrNestedArr = linearGradientStringToNestedArray(
      currentKeyframe.to
    );

    // Finds the different value given the two arrays above and returns an object
    // idea: return array of objects for each different property
    const { index, subIndex, startValue, endValue, unit } = findDiffIndex(
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

    // progress is a percent of time passed,
    // e.g if 1000ms has passed when duration is 2000ms then progress = 0.5 => 50%
    const progress = Math.min(elapsedTime / duration, 1);
    // this takes the progress and passes it to the easing function which returns a new percentage based on the easing method
    // e.g, if method is ease-in and progress = 0.5 => it may return 0.35 (not accurate just an example)
    const easedProgress = method(progress);

    // totalChange is equal to the total amount the value changes from one frame to the next,
    // e.g if start = 50 & end = 100 => totalChange = 50
    const totalChange = endValue - startValue;
    const currentValue = (startValue + totalChange) * easedProgress;

    // update the value in the nested array, if it has
    fromStrNestedArr[index][subIndex] =
      subIndex === 0 ? `${currentValue}` : `${currentValue}${unit}`;

    // takes the nested array and turns it into a valid CSS string and applies it as the background
    element.style.background = formatStringFromArr(fromStrNestedArr);

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

export default animate;
