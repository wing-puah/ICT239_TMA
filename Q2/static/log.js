const caloriePerMinPerKgMap = {
  bicycling: 0.064,
  walking: 0.084,
  swimming: 0.13,
  running: 0.21,
};

function calculateCalories(formObject) {
  const { weight } = formObject;
  /** Calculation will always return 0 if there is no weight, so we return early */
  if (!weight) return 0;

  return Object.entries(formObject).reduce((acc, [k, v]) => {
    if (!Object.prototype.hasOwnProperty.call(caloriePerMinPerKgMap, k) || !v) {
      return acc;
    }

    const calorieUnit = caloriePerMinPerKgMap[k];
    acc += parseFloat(v) * calorieUnit * weight;
    return acc;
  }, 0);
}

function populateCalorie(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formObject = Object.fromEntries(formData);

  const totalCalories = calculateCalories(formObject);
  document.getElementById("counter").innerText = Math.ceil(totalCalories);
}

document.getElementById("log").addEventListener("submit", populateCalorie);
