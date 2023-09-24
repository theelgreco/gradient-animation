/* MAIN ANIMATION METHODS */

import timingFunctions from "../utils/timingFunctions.js";

// takes step string and converts it to nested array, e.g,
// linear-gradient(90deg, red, orange 50px, red)
// => [["90", "deg"], ["red"], ["orange", "50px"], ["red"]]

// linear-gradient(90deg, rgb(0, 255, 0), rgb(0, 255, 0), rgb(0, 255, 0))
// => [["90", "deg"], ["0", "255", "0"], ["0", "255", "0"], ["0", "255", "0"]]
function linearGradientStringToNestedArray(str) {
  const regex = /linear-gradient\((.*)\)/;
  const splitRegex = /(?<=[a-z\)%]), /;
  // match string inside of parentheses (-55deg, transparent 25%) => ["-55deg", "transparent 25%"]

  const stringArray = str.match(regex)[1].split(splitRegex);
  // nest arrays to split value from "key",
  // e.g: ["55deg", "transparent 25%"] => [["55, "deg"], ["transparent", "25%"]]

  const res = [];
  for (let i = 0; i < stringArray.length; i++) {
    const subStr = stringArray[i];
    const splitStr = subStr.split(/(?<=[a-z\)]) /);
    // console.log(subStr);

    if (i === 0) {
      res.push(splitRotationStringToArr(subStr));
    } else {
      let regex = /rgba\(/;
      let str1 = splitStr[0];
      str1 = str1.replace(regex, "");
      str1 = str1.replace(")", "");
      const rgbaColourValues = str1.split(", ");
      const positionValue = splitStr[1];
      const colourSplit = positionValue
        ? [...rgbaColourValues, positionValue]
        : [...rgbaColourValues];

      res.push(colourSplit);
    }
  }

  return res;
}

function splitRotationStringToArr(str) {
  let regex = /deg/;
  let match = str.match(regex)[0];
  let value = str.split(match)[0];

  let resArr = [value, "deg"];
  return resArr;
}

// finds the differences between two nested arrays (frames) and returns the values in an object:
// e.g, arr1: [["90deg"], ["red", "20%"], ["orange"]]
//      arr2: [["90deg"], ["red", "50%"], ["orange"]]
//   => { index: 1, from: 20, to: 50, unit: "%" }
function findDiffIndex(arr1, arr2) {
  const arrLength = arr1.length;

  const arrOfDiffs = [];

  for (let i = 0; i < arrLength; i++) {
    const nestedArr1 = arr1[i];
    const nestedArr2 = arr2[i];

    if (!nestedArr1[1]) continue;
    if (nestedArr1.length < 3) {
      const diff = {};
      const val1Check = nestedArr1[0] === nestedArr2[0];
      const val2check = nestedArr1[1] === nestedArr2[1];
      if (val1Check !== val2check) {
        const unitRegex = /\D+/;
        const subIndex = parseFloat(nestedArr1[1]) > -1 ? 1 : 0;
        diff.index = i;
        diff.subIndex = subIndex;
        diff.startValue = parseFloat(nestedArr1[subIndex]);
        diff.endValue = parseFloat(nestedArr2[subIndex]);
        diff.unit = nestedArr1[1].match(unitRegex)[0];
        diff.property = subIndex === 0 ? "rotation" : "position";
        arrOfDiffs.push(diff);
      }
    } else {
      const smallerArr =
        nestedArr1.length < nestedArr2.length ? nestedArr1 : nestedArr2;
      const smallerArrLength = smallerArr.length;

      for (let j = 0; j < smallerArrLength; j++) {
        const val1 = nestedArr1[j];
        const val2 = nestedArr2[j];
        const valCheck = val1 === val2;

        if (!valCheck) {
          const diff = {};
          const charRegex = /[A-Za-z%]+/;
          const unit = charRegex.test(val1) ? val1.match(charRegex)[0] : null;
          diff.index = i;
          diff.subIndex = j;
          diff.startValue = parseFloat(val1);
          diff.endValue = parseFloat(val2);
          diff.unit = unit;
          diff.property = unit ? "position" : "color";
          arrOfDiffs.push(diff);
        }
      }
    }
  }

  return arrOfDiffs;
}

// put pieces of the string back together:
// e.g, ["linear-gradient(", "90deg", "red 20%", "orange"] => "linear-gradient(90deg, red 20%, orange)"
function formatStringFromArr(arr) {
  // [
  //   ["90", "deg"], DONE
  //   ["0", "0", "0", "0", "0%"],
  //   ["255", "0", "0", "0", "0.0044412891050171766%"],
  //   ["0", "0", "0", "0", "100%"],
  // ];

  let resString = "linear-gradient(";
  let lastIndex = arr.length - 1;
  arr.forEach((subArr, index) => {
    // if subArr[0] is a num then join without spaces, e.g "90", "deg" => "90deg"
    if (index === 0) {
      resString += subArr.join("");
    } else {
      let rgbaString = `rgba(${subArr[0]}, ${subArr[1]}, ${subArr[2]}, ${subArr[3]})`;
      if (subArr[4]) rgbaString += ` ${subArr[4]}`;
      resString += rgbaString;
    }

    if (index !== lastIndex) resString += ",";
  });
  resString += ")";

  return resString;
}

// formats linear gradient strings at start.
// turns all rotations to 'deg'
// converts all colours to rgb/rgba values
// idea: convert all colour positions to % from any unit, e.g 'rem', 'px'
function convertGradientString(step) {
  // this applies the gradient to a temp element to use getcomputedstyle and convert colors to rgb(a)
  const tempElement = document.createElement("div");
  tempElement.style.backgroundImage = step;
  tempElement.style.display = "none";
  document.body.appendChild(tempElement);
  const formattedBgString =
    window.getComputedStyle(tempElement).backgroundImage;
  document.body.removeChild(tempElement);

  // match string inside of parentheses (-55deg, transparent 25%) => ["-55deg", "transparent 25%"]
  const regex = /linear-gradient\((.*)\)/;
  const splitRegex = /(?<=[a-z\)%]), /;
  const stringArray = formattedBgString.match(regex)[1].split(splitRegex);
  const isRotation = checkIfRotation(stringArray[0]);

  if (!isRotation) {
    stringArray.unshift("180deg");
  } else {
    stringArray[0] = convertRotationToDegString(stringArray[0]);
  }

  const stringArrayMap = stringArray.map((str) => {
    let rgbRegex = /rgb/;
    let rgbaRegex = /rgba/;

    if (rgbRegex.test(str) && !rgbaRegex.test(str)) {
      str = str.replace("rgb", "rgba");
      str = str.replace(")", ", 1)");
    }

    return str;
  });

  let joined = stringArrayMap.join(", ");
  let resString = `linear-gradient(${joined})`;

  return resString;
}

function checkIfRotation(subStr) {
  const isRotation =
    subStr.includes("deg") || subStr.includes("turn") || subStr.includes("to");
  return isRotation;
}

function convertRotationToDegString(str) {
  let regex = /deg|turn|to /;
  let match = str.match(regex)[0];
  let value = str.split(match)[0];

  if (match === "turn") {
    value = value.includes(".") ? "0." + value.split(".")[1] : value;
    value = String(360 * Number(value));
  }

  if (match === "to") {
    const lookupObj = {
      top: "0",
      "right top": "10",
      right: "90",
      "right bottom": "170",
      bottom: "180",
      "left bottom": "190",
      left: "270",
      "left top": "350",
    };
    let direction = str.split(match)[1].trim();
    value = lookupObj[direction];
  }

  let res = `${value}deg`;
  return res;
}

function delayAnimation(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function formatStepsFromJs(steps, element) {
  let res = [];
  let elementBackgroundImage = window.getComputedStyle(element).backgroundImage;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    // if its the first step and there is no duration specified, contine
    if (i === 0 && !step.duration) continue;
    const prevStep = steps[i - 1];
    // ?. notation as it may still be first step which does not have prevStep value
    const prevValue = prevStep?.value;
    const currentValue = step.value;

    if (elementBackgroundImage === "none") {
      elementBackgroundImage = currentValue;
      // element.style.backgroundImage = currentValue;
    }

    let obj = {
      // if its the first step set from to elementBackgroundImage else set prevValue
      from: i === 0 ? elementBackgroundImage : prevValue,
      to: currentValue,
      duration: step.duration,
      method: step.method,
    };

    res.push(obj);
  }

  return res;
}

function reverseSteps(stepsArr) {
  const resArr = [];
  const stepsArrToReversed = stepsArr.toReversed();
  for (let i = 0; i < stepsArrToReversed.length; i++) {
    const step = stepsArrToReversed[i];
    const { to, from } = step;
    const objCopy = { ...step };
    objCopy.to = from;
    objCopy.from = to;
    resArr.push(objCopy);
  }
  return resArr;
}

async function animate(element, steps, optionalSettings) {
  // console.log("formatting settings");
  // if the first step has a value property it's come from js so needs formatting
  if (steps[0].value) steps = formatStepsFromJs(steps, element);

  // takes the from/to linear-gradient strings for each step and converts all colours to rgb/rgba and all rotations to deg,
  // e.g, linear-gradient(to left, red 50px, green 100px, red 150px)
  //   => linear-gradient(270deg, rgb(255, 0, 0) 50px, rgb(0, 255, 0) 100px, rgb(255, 0, 0) 150px)
  steps.forEach((step) => {
    step.from = convertGradientString(step.from);
    step.to = convertGradientString(step.to);
  });

  const originalBackground = window.getComputedStyle(element).backgroundImage;

  let iterations = optionalSettings?.iterations;
  if (!iterations) iterations = 1;
  else if (iterations === "infinite") iterations = Infinity;
  else iterations = parseInt(iterations);

  const startDelay = optionalSettings?.startDelay;
  const fill = optionalSettings?.fill;
  const delay = optionalSettings?.delay;
  const direction = optionalSettings?.direction || "normal";

  let currentIteration = 1;
  const totalSteps = steps.length;
  let currentStep = 0;
  // if direction is not normal make a copy of steps array reversed
  const reversedSteps = direction !== "normal" ? reverseSteps(steps) : null;

  const stepsLookupObj = {
    normal: { 0: steps, 1: steps },
    reverse: { 0: reversedSteps, 1: reversedSteps },
    alternate: { 0: reversedSteps, 1: steps },
    "alternate-reverse": { 0: steps, 1: reversedSteps },
  };

  let currentDirection = currentIteration % 2;
  let currentDirectionSteps = stepsLookupObj[direction][currentDirection];

  if (startDelay) await delayAnimation(startDelay);
  let startTime = performance.now();

  async function update(currentTime) {
    const elapsedTime = currentTime - startTime;
    const currentKeyframe = currentDirectionSteps[currentStep];

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

    const { duration } = currentDirectionSteps[currentStep];
    let method = timingFunctions[currentDirectionSteps[currentStep].method];
    if (!method) method = timingFunctions["linear"];

    if (elapsedTime >= duration) {
      element.style.backgroundImage = formatStringFromArr(toStrNestedArr);
      currentStep++;

      if (currentStep === totalSteps) {
        currentStep = 0; // Reset to the first keyframe for the next iteration
        currentIteration++;

        currentDirection = currentIteration % 2;
        currentDirectionSteps = stepsLookupObj[direction][currentDirection];

        if (currentIteration > iterations) {
          element.dispatchEvent(new Event("animationFinished"));
          return; // All iterations completed
        }

        if (delay) await delayAnimation(delay);
      }

      startTime = performance.now();
    }

    // Finds the different value given the two arrays above and returns an array of objects containing differences for each property, e.g position, rotation
    // if object is empty then there is no difference between frames so will not execute - instead goes to next step
    const differences = findDiffIndex(fromStrNestedArr, toStrNestedArr);
    const framesHaveDifferences = differences.length;
    if (framesHaveDifferences) {
      differences.forEach((difference) => {
        const { index, subIndex, startValue, endValue, unit, property } =
          difference;

        // progress is a percent of time passed,
        // e.g if 1000ms has passed when duration is 2000ms then progress = 0.5 => 50%
        const progress = Math.min(elapsedTime / duration, 1);
        // this takes the progress and passes it to the easing function which returns a new percentage based on the easing method
        // e.g, if method is ease-in and progress = 0.5 => it may return 0.35 (not accurate just an example)
        const easedProgress = method(progress);

        // totalChange is equal to the total amount the value changes from one frame to the next,
        // e.g if start = 50 & end = 100 => totalChange = 50
        const totalChange = endValue - startValue;
        const currentValue = startValue + totalChange * easedProgress;

        // update the value in the nested array, if it has
        if (property === "rotation" || property === "color") {
          fromStrNestedArr[index][subIndex] = `${currentValue}`;
        } else if (property === "position") {
          fromStrNestedArr[index][subIndex] = `${currentValue}${unit}`;
        }

        // takes the nested array and turns it into a valid CSS string and applies it as the background
        element.style.backgroundImage = formatStringFromArr(fromStrNestedArr);
      });
    }

    requestAnimationFrame(update);
  }

  return new Promise((resolve) => {
    function onAnimationFinished() {
      if (!fill) element.style.backgroundImage = originalBackground;
      element.removeEventListener("animationFinished", onAnimationFinished);
      resolve(); // Resolve the Promise when the animation is finished
    }

    element.addEventListener("animationFinished", onAnimationFinished);
    requestAnimationFrame(update);
  });
}

export default animate;
