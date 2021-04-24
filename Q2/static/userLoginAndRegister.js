const user = (function () {
  function login({ email, password }) {}

  function register({ email, password, weight, gender }) {
    console.log("ajax");
    $.ajax({
      url: "/register",
      type: "POST",
      data: JSON.stringify({ email, password, weight, gender }),
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
  console.log({ formObject, user });
  user.register(formObject);
}
