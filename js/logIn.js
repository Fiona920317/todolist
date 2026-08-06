const email = document.querySelector("#email");
const password = document.querySelector("#password");

/*即時驗證email和密碼是否為空值開始*/
let touchedEmail = false; //設定目前狀態為"還沒被碰過"
let touchedPassword = false;

email.addEventListener("input", function (e) {
  if (!touchedEmail) return;
  validateEmail();
});

email.addEventListener(
  "blur" /*當事件離開焦點時觸發的事件(和focus相反)*/,
  function (e) {
    touchedEmail = true;
    validateEmail();
  },
);

password.addEventListener("input", function (e) {
  if (!touchedPassword) return;
  validatePassword();
});

password.addEventListener(
  "blur" /*當事件離開焦點時觸發的事件(和focus相反)*/,
  function (e) {
    touchedPassword = true;
    validatePassword();
  },
);

function validateEmail() {
  if (email.value == "") {
    email.setCustomValidity("請輸入email");
    email.classList.add("is-invalid");
    email.classList.remove("is-valid");
  } else {
    email.setCustomValidity("");
    email.classList.remove("is-invalid");
    email.classList.add("is-valid");
  }
}
function validatePassword() {
  if (password.value.length < 6) {
    password.setCustomValidity("請輸入密碼");
    password.classList.add("is-invalid");
    password.classList.remove("is-valid");
  } else {
    password.setCustomValidity("");
    password.classList.remove("is-invalid");
    password.classList.add("is-valid");
  }
}
/*即時驗證email和密碼是否為空值結束*/

const apiUrl = "https://todoo.5xcamp.us";
let token = localStorage.getItem("token") || "";
function logIn(user) {
  axios
    .post(`${apiUrl}/users/sign_in`, {
      user,
    })
    .then((res) => {
      console.log(res);
      alert("登入成功");
      token = res.headers.authorization;
      localStorage.setItem("token", token);
      window.location.href = "todoList.html";
    })
    .catch((error) => {
      console.log(error.response);
      alert("登入失敗");
    });
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          event.preventDefault(); //如果不送出表單的話，這行就是必要
          const user = {
            email: email.value,
            password: password.value,
          };
          logIn(user);
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });
})();
