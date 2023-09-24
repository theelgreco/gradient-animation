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

// takes step string and converts it to nested array, as well as rgba e.g,
// linear-gradient(90deg, rgb(0, 255, 0, 0.5), rgb(0, 255, 0), rgb(0, 255, 0))
// => [["90", "deg"], ["0", "255", "0", "0.5"], ["0", "255", "0", "1"], ["0", "255", "1"]]
function linearGradientStringToNestedArray(str) {
  const gradientTypeRegex = /(linear|radial|conic)-gradient/;
  const gradientType = str.match(gradientTypeRegex)[0];
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

      // colourSplit.unshift(gradientType);
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

// put pieces of the string back together:
// [["90", "deg"],["0", "0", "0", "0", "0%"], ["255", "0", "0", "0", "0.5%"], ["0", "0", "0", "0", "100%"]];
// => "linear-gradient(90deg, rgb(0, 0, 0, 0) 0%, rgb(255, 0, 0, 0) 0.5%, rgb(0, 0, 0, 0) 100%)"
function formatStringFromArr(arr) {
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

export {
  convertGradientString,
  linearGradientStringToNestedArray,
  formatStringFromArr,
};
