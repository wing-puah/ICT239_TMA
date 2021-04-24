const user = (function () {
  function login({ username, password }) {}

  function register({ username, password, weight, gender }) {
    $.ajax({
      url: "/register",
      type: "POST",
      data: JSON.stringify({ username, password, weight, gender }),
      dataType: "json",
      contentType: "application/json",
    })
      .done(function (json) {
        console.log({ json });
      })
      .fail(function (xhr, status, error) {
        alert("Sorry, there was a problem!");
        console.log({ error });
      });
  }

  return { login, register };
})();

function onLogin() {
  const formData = new FormData(document.getElementById("login-form"));
  const formObject = Object.fromEntries(formData);
  user.login(formObject);
}

function onRegister() {
  const formData = new FormData(document.getElementById("register-form"));
  const formObject = Object.fromEntries(formData);
  user.register(formObject);
}
