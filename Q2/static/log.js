const caloriePerMinPerKgMap = {
  bicycling: 0.064,
  walking: 0.084,
  swimming: 0.13,
  running: 0.21,
};

const activities = (function () {
  function populateCalorie(data) {
    document.getElementById("counter").innerText = Math.ceil(data);
  }

  async function add(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData);

    const { _id } = await userFeStorage.retrieve();

    $.ajax({
      url: "/activity",
      type: "POST",
      data: JSON.stringify({ ...formObject, user_id: _id }),
      dataType: "json",
      contentType: "application/json",
    })
      .done(function (json) {
        const { total_calories } = json.data;
        populateCalorie(total_calories);
      })
      .fail(function (xhr, status, error) {
        alert(`Sorry, there was a problem!: ${error}`);
      });
  }

  return { add, populateCalorie };
})();

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

// function populateCalorie(totalCalories) {
//   // e.preventDefault();
//   // const formData = new FormData(e.target);
//   // const formObject = Object.fromEntries(formData);

//   // const totalCalories = calculateCalories(formObject);
//   document.getElementById("counter").innerText = Math.ceil(totalCalories);
// }

document.getElementById("log").addEventListener("submit", activities.add);
