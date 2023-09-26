export function formatStepsFromJs(steps, element) {
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
