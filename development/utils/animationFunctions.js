/* MAIN ANIMATION METHODS */

import { timingFunctions } from "./timingFunctions.js";
import { formatStepsFromJs } from "./jsFunctions.js";
import {
  convertGradientString,
  linearGradientStringToNestedArray,
  formatStringFromArr,
} from "./stringFunctions.js";

// finds the differences between two nested arrays (frames) and returns the values in an object:
// e.g, arr1: [["90deg"], ["red", "20%"], ["orange"]]
//      arr2: [["90deg"], ["red", "50%"], ["orange"]]
//   => { index: 1, from: 20, to: 50, unit: "%" }
function findDiffIndex(arr1, arr2) {
  const arrLength = arr1.length;
  const arrOfDiffs = [];

  for (let i = 1; i < arrLength; i++) {
    const subArray1 = arr1[i];
    const subArray2 = arr2[i];
    if (!subArray1[1]) continue;
    if (subArray1.length < 3) {
      const diff = {};
      const val1Check = subArray1[0] === subArray2[0];
      const val2check = subArray1[1] === subArray2[1];
      if (val1Check !== val2check) {
        const unitRegex = /\D+/;
        const subIndex = parseFloat(subArray1[1]) > -1 ? 1 : 0;
        diff.index = i;
        diff.subIndex = subIndex;
        diff.startValue = parseFloat(subArray1[subIndex]);
        diff.endValue = parseFloat(subArray2[subIndex]);
        diff.unit = subArray1[1].match(unitRegex)[0];
        diff.property = subIndex === 0 ? "rotation" : "position";
        arrOfDiffs.push(diff);
      }
    } else {
      const smallerArr =
        subArray1.length < subArray2.length ? subArray1 : subArray2;
      const smallerArrLength = smallerArr.length;

      for (let j = 0; j < smallerArrLength; j++) {
        const val1 = subArray1[j];
        const val2 = subArray2[j];
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

function delayAnimation(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
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

let animCount = 0;
let animIds = {};

function cancelAnimation(element) {
  cancelAnimationFrame(animIds[element.dataset.animnum]);
  delete element.dataset.animnum;
  delete animIds[element.dataset.animnum];
}

async function animateGradient(element, steps, optionalSettings) {
  // console.log("formatting settings");
  // if the first step has a value property it's come from js so needs formatting
  if (!element.dataset.animnum) element.dataset.animnum = animCount;
  animCount++;

  if (steps[0].value) steps = formatStepsFromJs(steps, element);

  let gradientType;
  // takes the from/to linear-gradient strings for each step and converts all colours to rgb/rgba and all rotations to deg,
  // e.g, linear-gradient(to left, red 50px, green 100px, red 150px)
  //   => linear-gradient(270deg, rgb(255, 0, 0) 50px, rgb(0, 255, 0) 100px, rgb(255, 0, 0) 150px)
  steps.forEach((step, index) => {
    const from = convertGradientString(step.from);
    const to = convertGradientString(step.to);
    if (index === 0) gradientType = from.type;
    step.from = from.string;
    step.to = to.string;
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
      currentKeyframe.from,
      gradientType
    );

    // Takes the to property and turns into a nested array, e.g:
    // from: "linear-gradient(90deg, red, orange 50%, red)",
    //    => [["90", "deg"], ["red"], ["orange", "10%"], ["red"]]
    const toStrNestedArr = linearGradientStringToNestedArray(
      currentKeyframe.to,
      gradientType
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

    animIds[element.dataset.animnum] = requestAnimationFrame(update);
  }

  return new Promise((resolve) => {
    function onAnimationFinished() {
      delete element.dataset.animnum;
      delete animIds[element.dataset.animnum];
      if (!fill) element.style.backgroundImage = originalBackground;
      element.removeEventListener("animationFinished", onAnimationFinished);
      resolve(); // Resolve the Promise when the animation is finished
    }

    element.addEventListener("animationFinished", onAnimationFinished);
    animIds[element.dataset.animnum] = requestAnimationFrame(update);
  });
}

export { animateGradient, cancelAnimation };
