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

document.getElementById("log").addEventListener("submit", activities.add);
