const email = document.querySelector("#email");
const nickname = document.querySelector("#nickname");
const password = document.querySelector("#password");
const password2 = document.querySelector("#password2");

/*即時驗證密碼長度開始*/
let touched = false; //設定目前狀態為"還沒被碰過"

password.addEventListener("input", function (e) {
  if (!touched) return;
  validatePassword();
});

password.addEventListener(
  "blur" /*當事件離開焦點時觸發的事件(和focus相反)*/,
  function (e) {
    touched = true; /*變更狀態為"已碰過"，這樣就算回去改input的值也會持續驗證密碼是否合格*/
    validatePassword();
  },
);

function validatePassword() {
  if (password.value.length < 6) {
    password.setCustomValidity("密碼至少要6個字元");
    password.classList.add("is-invalid");
    password.classList.remove("is-valid");
  } else {
    password.setCustomValidity("");
    password.classList.remove("is-invalid");
    password.classList.add("is-valid");
  }
}
/*即時驗證密碼長度結束*/

//設置全域變數
const apiUrl = "https://todoo.5xcamp.us";
function signUp(user) {
  return axios
    .post(`${apiUrl}/users`, {
      user,
    })
    .then((res) => {
      console.log(res);
      alert("註冊成功");
      window.location.href = "logIn.html";
    })
    .catch((error) => {
      console.log(error.response);
      alert("註冊失敗");
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
        /*驗證密碼是否一致開始*/
        if (password.value !== password2.value) {
          password2.setCustomValidity("not match");
        } else {
          password2.setCustomValidity("");
        }
        /*驗證密碼是否一致結束*/

        if (
          !form.checkValidity()
        ) /*if條件->若表單全部的input無效，則執行以下行為*/ {
          event.preventDefault();
          event.stopPropagation();
          alert("failed");
        } /*新增else->若表單全部的input有效，則儲存資料*/ else {
          event.preventDefault(); //如果不送出表單的話，這行就是必要

          //因為user變數只會在送出表單後儲存資料時用到，所以不要在全域命名變數
          const user = {
            email: email.value,
            nickname: nickname.value,
            password: password.value,
          };

          //啟動signUp函式
          signUp(user);
        }
        form.classList.add("was-validated");
      },
      false,
    );
  });
})();
