let userDetails = {
  _id: null,
  gender: null,
  weight: null,
  email: null,
  role: [],
};

const user = (function () {
  function login({ email, password }) {
    $.ajax({
      url: "/login",
      type: "POST",
      data: JSON.stringify({ email, password }),
      dataType: "json",
      contentType: "application/json",
    })
      .done(function (json) {
        const { data } = json;
        userDetails = data;
        console.log("init redirect");
        window.location.href = "/log";
      })
      .fail(function (xhr, status, error) {
        console.error(`${error}`);
        alert(
          `Sorry, there was a problem!: ${error}, use admin@fitwell.com, admin to login`
        );
      });
  }

  function register({ email, password, weight, gender }) {
    $.ajax({
      url: "/register",
      type: "POST",
      data: JSON.stringify({ email, password, weight, gender }),
      dataType: "json",
      contentType: "application/json",
    })
      .done(function (json) {
        const { data } = json;
        userDetails = data;
        window.location.href = "/log";
      })
      .fail(function (xhr, status, error) {
        alert(`Sorry, there was a problem!: ${error}`);
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

function populateUser() {
  console.log("in populate");
  const { _id, gender, weight, email, role } = userDetails || {};
  const idContentMapper = [
    { id: "user_id", data: email },
    { id: "user_gender", data: gender },
    { id: "user_weight", data: weight },
  ];

  idContentMapper.forEach((item) => {
    const { id, data } = item;
    document.getElementById(id).textContent = data;
  });
}
