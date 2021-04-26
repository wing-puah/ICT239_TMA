const userFeStorage = (function () {
  async function save(data) {
    localStorage.setItem("user", JSON.stringify(data));
  }

  async function retrieve() {
    const _user = localStorage.getItem("user");
    return JSON.parse(_user);
  }

  async function remove() {
    localStorage.removeItem("user");
  }

  return { save, retrieve, remove };
})();

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
        userFeStorage.save(data);
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
        userFeStorage.save(data);
        window.location.href = "/log";
      })
      .fail(function (xhr, status, error) {
        alert(`Sorry, there was a problem!: ${error}`);
      });
  }

  function logout() {
    userFeStorage.remove();
    window.location.href = "/";
  }

  return { login, register, logout };
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

async function populateUser() {
  const userDetails = await userFeStorage.retrieve();
  const { gender, weight, email, role } = userDetails || {};

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

async function populateUserRole() {
  const userDetails = await userFeStorage.retrieve();
  const { email, role } = userDetails || {};
  document.getElementById("user_id").textContent = email;
  document.getElementById("user_role").textContent = createRole(
    role || ["user"]
  );
}

function createRole(roles) {
  try {
    return roles.join(" and ");
  } catch (error) {
    console.error(`Issue with parsing role: ${role}`);
    return "User";
  }
}
