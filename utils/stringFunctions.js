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
  // prettier-ignore
  const formattedBgString = window.getComputedStyle(tempElement).backgroundImage;
  document.body.removeChild(tempElement);

  // match string inside of parentheses linear-gradient(-55deg, transparent 25%) => ["-55deg", "transparent 25%"]
  const regex = /(linear|radial)-gradient\((.*)\)/;
  const matches = formattedBgString.match(regex);
  const typeOfGradient = matches[1];
  const valuesString = matches[2];
  // seperates values into seperate parts, e.g ["90deg", "red 50px", "orange"]
  const splitRegex = /(?<=[a-z\)%]), /;
  const valuesArray = valuesString.split(splitRegex);

  if (typeOfGradient === "linear") {
    const rotationString = convertRotationToDegString(valuesArray[0]);
    if (!rotationString) valuesArray.unshift("180deg");
    else valuesArray[0] = rotationString;
  } else if (typeOfGradient === "radial") {
    const radialGradientShapeString = convertRadialGradientShape(
      valuesArray[0]
    );
    // shape will either always be shape string or 2 values (width,height)
    if (!radialGradientShapeString) valuesArray.unshift("ellipse at 50% 50%");
    else valuesArray[0] = radialGradientShapeString;
  }

  const valuesArrayMap = valuesArray.map((str) => {
    let rgbRegex = /rgb/;
    let rgbaRegex = /rgba/;

    if (rgbRegex.test(str) && !rgbaRegex.test(str)) {
      str = str.replace("rgb", "rgba");
      str = str.replace(")", ", 1)");
    }

    return str;
  });

  let joined = valuesArrayMap.join(", ");
  let resString = `${typeOfGradient}-gradient(${joined})`;

  return { string: resString, type: typeOfGradient };
}

function convertRotationToDegString(str) {
  let regex = /deg|turn|to /;
  let match = str.match(regex);

  if (!match) return false;

  let value = str.split(match[0])[0];

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

function convertRadialGradientShape(str) {
  const isEllipseWithPosition = str[0] + str[1] === "at";
  const isEllipseWithoutPosition = str[0] + str[1] + str[2] === "rgb";

  //   covers if:
  //   - shape is only shapeString, e.g 'circle'
  //   - shape is not provided, as if the string is not a number or shapeString then there is no shape
  if (str === "circle") return "circle at 50% 50%";
  else if (isEllipseWithoutPosition) return false;

  const values = isEllipseWithPosition ? str.split("at ") : str.split(" at ");
  if (isEllipseWithPosition) values[0] = "ellipse";

  let resString = "";

  // if length is 1, only shape is specified, could be shapeString or value, e.g 'circle' or '50%'
  if (values.length === 1) {
    const shape = values[0];
    const shapeSplit = shape.split(" ");
    const value1 = shapeSplit[0];
    const value2 = shapeSplit[1];
    if (!parseFloat(value1)) resString = `${value1} at 50% 50%`;
    else if (!value2) resString = `${value1} ${value1} at 50% 50%`;
    else resString = `${value1} ${value2} at 50% 50%`;
  } else {
    const shapeString = values[0];
    let positionString = values[1];
    const shapes = shapeString.split(" ");
    const isShapeString = shapes[0] === "circle" || shapes[0] === "ellipse";
    const lookupObj = {
      top: "50% 0%",
      "top center": "50% 0%",
      "center top": "50% 0%",
      "top right": "100% 0%",
      "right top": "100% 0%",
      right: "100% 50%",
      "right center": "100% 50%",
      "center right": "100% 50%",
      "bottom right": "100% 100%",
      "right bottom": "100% 100%",
      bottom: "50% 100%",
      "center bottom": "50% 100%",
      "bottom center": "50% 100%",
      "bottom left": "0% 100%",
      "left bottom": "0% 100%",
      left: "0% 50%",
      "left center": "0% 50%",
      "center left": "0% 50%",
      "top left": "0% 0%",
      "left top": "0% 0%",
    };

    if (lookupObj[positionString]) positionString = lookupObj[positionString];

    const positions = positionString.split(" ").map((position) => {
      if (position === "center") position = "50%";
      else if (position === "left" || position === "top") position = "0%";
      else if (position === "bottom" || position === "right") position = "100%";
      return position;
    });

    // prettier-ignore
    if (!shapes[1] && isShapeString) resString = `${shapes[0]} at ${positions[0]} ${positions[1]}`;
    else if(!shapes[1]) resString = `${shapes[0]} ${shapes[0]} at ${positions[0]} ${positions[1]}`;
    else resString = `${shapes[0]} ${shapes[1]} at ${positions[0]} ${positions[1]}`;
  }

  return resString;
}

// takes step string and converts it to nested array, as well as rgba e.g,
// linear-gradient(90deg, rgb(0, 255, 0, 0.5), rgb(0, 255, 0), rgb(0, 255, 0))
// => [["90", "deg"], ["0", "255", "0", "0.5"], ["0", "255", "0", "1"], ["0", "255", "1"]]
function linearGradientStringToNestedArray(str, gradientType) {
  const str1 = `${gradientType}-gradient\\((.*)\\)`;
  const regex = new RegExp(str1);
  const splitRegex = /(?<=[a-z\)%]), /;
  // match string inside of parentheses (-55deg, transparent 25%) => ["-55deg", "transparent 25%"]

  const stringArray = str.match(regex)[1].split(splitRegex);
  // nest arrays to split value from "key",
  // e.g: ["55deg", "transparent 25%"] => [["55, "deg"], ["transparent", "25%"]]

  const res = [];
  for (let i = 0; i < stringArray.length; i++) {
    const subStr = stringArray[i];
    const splitStr = subStr.split(/(?<=[a-z\)]) /);

    if (i === 0 && gradientType === "linear") {
      res.push(splitRotationStringToArr(subStr));
    } else if (i === 0 && gradientType === "radial") {
      res.push(splitRadialShapeStringToArr(subStr));
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

  res.unshift([`${gradientType}-gradient`]);

  return res;
}

function splitRotationStringToArr(str) {
  const value = str.split("deg")[0];
  const resArr = [value, "deg"];
  return resArr;
}

function splitRadialShapeStringToArr(str) {
  return str.split(" ");
}

// put pieces of the string back together:
// [["90", "deg"],["0", "0", "0", "0", "0%"], ["255", "0", "0", "0", "0.5%"], ["0", "0", "0", "0", "100%"]];
// => "linear-gradient(90deg, rgb(0, 0, 0, 0) 0%, rgb(255, 0, 0, 0) 0.5%, rgb(0, 0, 0, 0) 100%)"
function formatStringFromArr(arr) {
  const gradientType = arr[0][0];
  let resString = `${gradientType}(`;
  let lastIndex = arr.length - 1;

  for (let i = 0; i < arr.length; i++) {
    const index = i;
    const subArr = arr[index];
    // arr[0] is the type of gradient, e.g ["linear"], ["radial"] so skip
    if (index === 0) continue;

    if (index === 1 && gradientType === "linear-gradient") {
      resString += subArr.join("");
    } else if (index === 1 && gradientType === "radial-gradient") {
      resString += subArr.join(" ");
    } else {
      let rgbaString = `rgba(${subArr[0]}, ${subArr[1]}, ${subArr[2]}, ${subArr[3]})`;
      if (subArr[4]) rgbaString += ` ${subArr[4]}`;
      resString += rgbaString;
    }

    if (index !== lastIndex) resString += ",";
  }

  resString += ")";

  return resString;
}

export {
  convertGradientString,
  linearGradientStringToNestedArray,
  formatStringFromArr,
};
