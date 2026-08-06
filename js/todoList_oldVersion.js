//因為語法有些複雜，所以有用jQuery

//全域變數和函式
let token = localStorage.getItem("token");
const apiUrl = "https://todoo.5xcamp.us";
let todos = [];
let todos_uncompleted = [];
let todos_completed = [];
let todos_to_show = [];
let is_expanded = false;
function getTodo() {
  return axios
    .get(`${apiUrl}/todos`, {
      headers: {
        authorization: token,
      },
    })
    .then((res) => {
      console.log(res);
      todos = res.data.todos;
      renderTodo();
    })
    .catch((err) => console.log(err.response));
}
//一定要先處理好要渲染的資料，然後再渲染，不然渲染函式會變超級長，維護也會很麻煩
function renderTodo() {
  if (todos.length == 0) {
    $(".emptyTodoGroup").removeClass("d-none");
    $(".showTodoGroup").addClass("d-none");
  } else {
    $(".emptyTodoGroup").addClass("d-none");
    $(".showTodoGroup").removeClass("d-none");
    let str = "";

    //分類todos(uncompleted or completed)
    todos_uncompleted = todos.filter((item) => item.completed_at == null);
    todos_completed = todos.filter((item) => item.completed_at != null);

    //根據is_expanded把對應的資訊裝進todos_to_show
    //is_expanded==true =>兩個都裝，先裝uncompleted，再裝completed
    if (is_expanded == true) {
      todos_to_show = todos_uncompleted.concat(todos_completed); //合併陣列用concat()貓貓
    }
    //is_expanded==false =>先裝至多六個uncompleted，如果不夠，再用completed補上差額
    else {
      todos_to_show = todos_uncompleted.slice(0, 6);
      console.log(todos_to_show);

      if (todos_uncompleted.length < 6) {
        let count = 6 - todos_uncompleted.length;
        todos_to_show = todos_to_show.concat(todos_uncompleted.slice(0, count));
        console.log(todos_to_show);
      }
    }
    //根據陣列todo的item.completed_at，渲染成已完成/未完成樣式
    todos_to_show.forEach((item, index) => {
      if (item.completed_at == null) {
        str += `<li class="showTodoGroup__main__item">
              <label class="checkboxGroup translate-middle">
                <input class="checkboxGroup__checkbox" type="checkbox" />
                <span class="checkboxGroup__checkmark"></span>
                <i class="checkboxGroup__checkmark--checked bi bi-check"></i>
              </label>
              <input class="todo" type="text" value="${item.content}" id="${item.id}" autocomplete="off" completed_at=${item.completed_at} />
              <i class="deleteTodoBtn translate-middle bi bi-x" data_num="${index}"></i>
            </li>`;
      } else {
        str += `<li class="showTodoGroup__main__item">
              <label class="checkboxGroup translate-middle">
                <input class="checkboxGroup__checkbox" type="checkbox" />
                <span class="checkboxGroup__checkmark completed"></span>
                <i class="checkboxGroup__checkmark--checked completed bi bi-check"></i>
              </label>
              <input class="todo completed" type="text" value="${item.content}" id="${item.id}" autocomplete="off" completed_at=${item.completed_at} />
              <i class="deleteTodoBtn translate-middle bi bi-x" data_num="${index}"></i>
            </li>`;
      }
    });
    $(".showTodoGroup__main").html(str);
    if (todos.length > 6) {
      if (is_expanded == true) {
        $(".showMoreBtn").html("顯示較少");
      } else {
        $(".showMoreBtn").html(`${todos.length - 6}個待完成項目`);
      }
    } else {
      $(".showMoreBtn").html("");
    }
  }
}

//如果只想顯示uncompleted
function renderUncompleted() {
  //is_expanded==true =>把全部的uncompleted裝進todos_to_show
  if (is_expanded == true) {
    todos_to_show = todos_uncompleted;
  }
  //is_expanded==false =>把前六個的uncompleted裝進todos_to_show
  else {
    todos_to_show = todos_uncompleted.slice(0, 6);
  }
  //渲染todos_to_show
  todos_to_show.forEach((item, index) => {
    str += `<li class="showTodoGroup__main__item">
              <label class="checkboxGroup translate-middle">
                <input class="checkboxGroup__checkbox" type="checkbox" />
                <span class="checkboxGroup__checkmark completed"></span>
                <i class="checkboxGroup__checkmark--checked completed bi bi-check"></i>
              </label>
              <input class="todo completed" type="text" value="${item.content}" id="${item.id}" autocomplete="off" completed_at=${item.completed_at} />
              <i class="deleteTodoBtn translate-middle bi bi-x" data_num="${index}"></i>
            </li>`;
  });
}
//如果只想顯示completed
function renderCompleted() {
  //is_expanded==true =>渲染全部的completed
  if (is_expanded == true) {
    todos_uncompleted.forEach((item, index) => {
      str += `<li class="showTodoGroup__main__item">
              <label class="checkboxGroup translate-middle">
                <input class="checkboxGroup__checkbox" type="checkbox" />
                <span class="checkboxGroup__checkmark completed"></span>
                <i class="checkboxGroup__checkmark--checked completed bi bi-check"></i>
              </label>
              <input class="todo completed" type="text" value="${item.content}" id="${item.id}" autocomplete="off" completed_at=${item.completed_at} />
              <i class="deleteTodoBtn translate-middle bi bi-x" data_num="${index}"></i>
            </li>`;
    });
  }
  //is_expanded==false =>渲染前六個的completed
  else {
    todos_uncompleted.slice(0, 6).forEach((item, index) => {
      str += `<li class="showTodoGroup__main__item">
              <label class="checkboxGroup translate-middle">
                <input class="checkboxGroup__checkbox" type="checkbox" />
                <span class="checkboxGroup__checkmark completed"></span>
                <i class="checkboxGroup__checkmark--checked completed bi bi-check"></i>
              </label>
              <input class="todo completed" type="text" value="${item.content}" id="${item.id}" autocomplete="off" completed_at=${item.completed_at} />
              <i class="deleteTodoBtn translate-middle bi bi-x" data_num="${index}"></i>
            </li>`;
    });
  }
}

//////////////////////////////////////////////////////////
$(document).ready(async function () {
  //獲得todos+初始化渲染
  await getTodo(); //讓後面所有的程式碼都等getTodo()收到API回傳的訊息再跑
  $(".showAll").addClass("active");
  //點擊logOutBtn後，彈出popupMessage確認是否登出，登出後返回登入介面並清除token
  $(".logOutBtn").on("click", () => {
    $(".popupMessage").removeClass("d-none");
    $(".popupMessage__message__content").html("確定要登出嗎?");
  });
  $(".popupMessage__message__buttonGroup").on("click", (e) => {
    if ($(e.target).hasClass("confirmBtn")) {
      logOut();
    } else if ($(e.target).hasClass("cancelBtn")) {
      $(".popupMessage").addClass("d-none");
    }
  });
  function logOut() {
    axios
      .delete(`${apiUrl}/users/sign_out`, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        window.location.href = "logIn.html";
        localStorage.setItem("token", "");
      })
      .catch((err) => console.log(err.response));
  }

  //新增todos並即時更新todo和showMoreBtn
  $(".addTodoGroup__submit").on("click", function () {
    if ($(".addTodoGroup__input").val() == "") {
      return;
    } else {
      let newTodo = $(".addTodoGroup__input").val();
      addTodo(newTodo);
      $(".addTodoGroup__input").val("");
    }
  });
  $(".addTodoGroup__input").on("focus keydown", (e) => {
    if (e.keyCode === 13) {
      let newTodo = $(".addTodoGroup__input").val();
      addTodo(newTodo);
      $(".addTodoGroup__input").val("");
    }
  });
  function addTodo(newTodo) {
    axios
      .post(
        `${apiUrl}/todos`,
        {
          todo: {
            content: newTodo,
          },
        },
        {
          headers: {
            authorization: token,
          },
        },
      )
      .then((res) => {
        getTodo();
        renderTodo();
      });
  }

  //編輯todos並即時更新todo，需要選取對應input的ID
  $(".showTodoGroup__main").on("change", (e) => {
    let selectedId = $(e.target).attr("id");
    let newTodo = $(e.target).val();
    editTodo(selectedId, newTodo);
  });

  function editTodo(selectedId, newTodo) {
    axios
      .put(
        `${apiUrl}/todos/${selectedId}`,
        {
          todo: {
            content: newTodo,
          },
        },
        { headers: { authorization: token } },
      )
      .then((res) => getTodo());
  }

  //監聽deleteTodoBtn，刪除並即時更新todolist
  $(".showTodoGroup__main").on("click", ".deleteTodoBtn", (e) => {
    let selectedId = $(e.target).parent().find(".todo").attr("id");
    console.log(selectedId);
    deleteTodo(selectedId);
  });
  function deleteTodo(selectedId) {
    axios
      .delete(`${apiUrl}/todos/${selectedId}`, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => getTodo());
  }

  //監聽showMoreBtn點擊事件，切換is_expanded狀態
  $(".showMoreBtn").on("click", function () {
    if (is_expanded == false) {
      is_expanded = true;
    } else {
      is_expanded = false;
    }
    renderTodo();
  });

  //當checkbox被勾選時，切換狀態並回傳API
  $(".showTodoGroup__main").on("click", ".checkboxGroup__checkbox", (e) => {
    let selectedId = $(e.target).parent().parent().find(".todo").attr("id");
    toggleTodo(selectedId);
  });
  function toggleTodo(selectedId) {
    axios
      .patch(
        `${apiUrl}/todos/${selectedId}/toggle`,
        {},
        {
          headers: {
            authorization: token,
          },
        },
      )
      .then((res) => {
        console.log(res);
        getTodo();
      })
      .catch((err) => console.log(err.response));
  }
  //監聽clearCompletedBtn，清除所有已完成todo
  $(".clearCompletedBtn").on("click", () => {
    todos.forEach((item) => {
      if (item.completed_at != null) {
        let selectedId = item.id;
        deleteTodo(selectedId);
      }
    });
  });
  //根據item.completed_at切換showTodoGroup__switchState
  $(".showTodoGroup__switchState__item").on("click", (e) => {
    $(e.target).addClass("active");
    $(e.target).siblings().removeClass("active");
    if ($(e.target).hasClass("showAll")) {
      getTodo();
    } else if ($(e.target).hasClass("showUncompleted")) {
    } else {
    }
  });

  //當checkbox被勾選時，切換checkbox和todo的樣式
  $(".showTodoGroup__main").on(
    "click",
    ".checkboxGroup__checkbox",
    function () {
      $(this)
        .parent()
        .find(".checkboxGroup__checkmark")
        .toggleClass("completed");
      $(this)
        .parent()
        .find(".checkboxGroup__checkmark--checked")
        .toggleClass("completed");
      $(this).parent().parent().find(".todo").toggleClass("completed");
    },
  );

  //監聽滑鼠移入移出動作，顯示和隱藏deleteTodoBtn
  $(".showTodoGroup__main").on(
    "mouseenter",
    ".showTodoGroup__main__item",
    function () {
      $(this).find(".deleteTodoBtn").toggleClass("active");
    },
  );
  $(".showTodoGroup__main").on(
    "mouseleave",
    ".showTodoGroup__main__item",
    function () {
      $(this).find(".deleteTodoBtn").toggleClass("active");
    },
  );
});
