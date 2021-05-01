const activities = (function () {
  function populateCalorie(data) {
    document.getElementById("counter").innerText = Math.ceil(data);
  }

  async function add(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData);

    const { email } = await userFeStorage.retrieve();

    $.ajax({
      url: "/activity",
      type: "POST",
      data: JSON.stringify({ ...formObject, email }),
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

  function sendFile(e) {
    e.preventDefault();
    const file = e.target[0].files[0];

    if (!file) {
      alert("There is no file!");
      return;
    }

    const data = new FormData();
    data.append("file", file, file.name);

    $.ajax({
      url: "/upload",
      type: "POST",
      data,
      cache: false,
      contentType: false,
      processData: false,
      dataType: "json",
    })
      .done(function (json) {
        const { success } = json;
        if (success) alert("Upload successfully!");
      })
      .fail(function (xhr, status, error) {
        alert(`Sorry, there was a problem!: ${error}`);
      });
  }

  return { add, populateCalorie, sendFile };
})();
