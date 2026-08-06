///////////////////////////////全域變數和函式/////////////////////////////////
const token = localStorage.getItem("token");
const apiUrl = "https://todoo.5xcamp.us";
let current_state = "showAll";
let is_expanded = false;
let todos = []; //原生todo資料，不會改動這個
let todos_uncompleted = []; //未完成的todo資料
let todos_completed = []; ///已完成的todo資料
let todos_arranged = []; //排序過後的todo資料，未完成在前，已完成在後

/////////////////////////控制好current_state和is_expanded是核心邏輯//////////////////////////////////////

////////////////////////////// 獲得並處理todos資料(最最重要的非同步函式)//////////////////////////////////
function getTodo() {
  //如果沒有return的話，這個函式不會把值傳出去，在之後await getTodo()時就相當於叫程式等一個undefined，程式會很困惑
  //有return的話，await getTodo()等於叫程式等一個promise回來，好了再下一步
  return axios
    .get(`${apiUrl}/todos`, {
      headers: {
        authorization: token,
      },
    })
    .then((res) => {
      //儲存todos
      todos = res.data.todos;

      //處理和儲存todos_uncompleted,todos_completed,todos_arranged
      todos_uncompleted = todos.filter((item) => item.completed_at == null);
      todos_completed = todos.filter((item) => item.completed_at != null);
      todos_arranged = todos_uncompleted.concat(todos_completed);
    })
    .catch((err) => console.log(err.response));
}
///////////////////////////渲染todolist和showMoreBtn(好的渲染函式比什麼都重要)////////////////////////////////////////
function render() {
  //判斷當前的current_state以挑選要用的資料陣列
  let todos_selected = [];
  if (current_state == "showAll") {
    todos_selected = todos_arranged;
  } else if (current_state == "showUncompleted") {
    todos_selected = todos_uncompleted;
  } else {
    todos_selected = todos_completed;
  }

  if (todos_selected.length == 0 && current_state == "showAll") {
    //如果todos為空，顯示emptyTodoGroup
    console.log("showAll-0");
    $(".emptyTodoGroup").removeClass("d-none");
    $(".showTodoGroup").addClass("d-none");
  } else if (todos_selected.length == 0 && current_state == "showCompleted") {
    $(".showTodoGroup__main")
      .html(`<p style="text-align: center; padding: 20px 0; font-size: 24px">
            暫無已完成項目
          </p>`);
  } else if (todos_selected.length == 0 && current_state == "showUncompleted") {
    console.log("showUncompleted-0");
    $(".showTodoGroup__main")
      .html(`<p style="text-align: center; padding: 20px 0; font-size: 24px">
            暫無未完成項目
          </p>`);
  } else {
    //如果todos不為空，顯示showTodoGroup
    $(".emptyTodoGroup").addClass("d-none");
    $(".showTodoGroup").removeClass("d-none");
    //根據is_expanded狀態和被挑選的資料陣列的長度，渲染showMoreBtn
    if (is_expanded == true) {
      $(".showMoreBtn").html("顯示較少");
    } else if (is_expanded == false && todos_selected.length > 6) {
      $(".showMoreBtn").html(`顯示剩餘${todos_selected.length - 6}個項目`);
    } else {
      $(".showMoreBtn").html("");
    }
    //開始處理資料=>把資料陣列切成要被渲染的量(至多六個物件)
    let str = "";
    if (todos_selected.length > 6 && is_expanded == false) {
      todos_selected = todos_selected.slice(0, 6);
    }
    //開始渲染todolist
    todos_selected.forEach((item, index) => {
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
    //把渲染好的東西放上網頁
    $(".showTodoGroup__main").html(str);
  }
}
////////////////////////////////////////其他非同步函式們//////////////////////////////////////
async function initializeTodo() {
  //current_state一律切換回showAll狀態
  if (current_state != "showAll") {
    current_state = "showAll";
    $(".showAll").addClass("active");
    $(".showUncompleted").removeClass("active");
    $(".showCompleted").removeClass("active");
  }
  //is_expanded一律切換回false
  is_expanded = false;

  $(".clearCompletedBtn").removeClass("d-none");

  await getTodo(); //等getTodo()拿到response，儲存完todos後再接著跑
  render();
}
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
function addTodo(input_value) {
  /*將input的value丟到API
  如果成功=>await getTodo()=>render() */
  axios
    .post(
      `${apiUrl}/todos`,
      {
        todo: {
          content: input_value,
        },
      },
      {
        headers: {
          authorization: token,
        },
      },
    )
    .then(async (res) => {
      await initializeTodo();
    })
    .catch((err) => console.log(err.response));
}
async function editTodo(input_value, selectedIdid) {
  axios
    .put(
      `${apiUrl}/todos/${selectedIdid}`,
      {
        todo: {
          content: input_value,
        },
      },
      {
        headers: {
          authorization: token,
        },
      },
    )
    .then(async (res) => {
      await getTodo();
      render();
    })
    .catch((err) => console.log(err.response));
}
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
    .then(async (res) => {
      await getTodo();
      render();
    })
    .catch((err) => console.log(err.response));
}
function deleteTodo(selectedId) {
  axios
    .delete(`${apiUrl}/todos/${selectedId}`, {
      headers: {
        authorization: token,
      },
    })
    .then(async (res) => {
      await getTodo();
      render();
    });
}
async function deleteCompletedTodo() {
  console.log(todos_completed);

  await todos_completed.forEach((item) => {
    console.log(item);

    axios.delete(`${apiUrl}/todos/${item.id}`, {
      headers: {
        authorization: token,
      },
    });
  });
  await getTodo();
  render();
}
/////////////////////////////////////////////程式正式開跑/////////////////////////////////////////////////
$(document).ready(async function () {
  //初始化設定
  initializeTodo();

  ///////////////////////////////////監聽，然後切換各式各樣的樣式///////////////////////////////////
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

  //監聽showTodoGroup__switchState__item，切換class的active以及current_state
  $(".showTodoGroup__switchState__item").on("click", function (e) {
    if ($(e.target).hasClass("active") != true) {
      is_expanded = false;
    }

    //當前點擊的item添加active，其他的兄弟元素都移除active
    $(e.target).addClass("active");
    $(e.target).siblings().removeClass("active");
    //如果切換到其他item，那就會統一收起todolist

    //根據點擊的item class，切換current_state和渲染畫面
    if ($(e.target).hasClass("showAll")) {
      //如果點擊的是"全部"
      current_state = "showAll";
    } else if ($(e.target).hasClass("showUncompleted")) {
      //如果點擊的是"未完成"
      current_state = "showUncompleted";
    } else {
      //如果點擊的是"已完成"
      current_state = "showCompleted";
    }
    console.log(current_state);
    render();
  });
  //監聽showMoreBtn，切換is_expanded
  $(".showMoreBtn").on("click", function () {
    if (is_expanded == false) {
      is_expanded = true;
    } else {
      is_expanded = false;
    }
    render();
  });

  //新增todos並即時更新todo和showMoreBtn
  $(".addTodoGroup").on("submit", (e) => {
    e.preventDefault();
    const input = $(".addTodoGroup__input");

    if (input.val() == "") {
      alert("請輸入代辦事項");
      return;
    } else {
      addTodo(input.val());
      input.val("");
    }
  });

  //編輯todos並即時更新todo，需要選取對應input的ID
  $(".showTodoGroup__main").on("change", ".todo", function (e) {
    let selectedId = $(e.target).attr("id");
    let input_value = $(e.target).val();
    editTodo(input_value, selectedId);
  });

  //當checkbox被勾選時，切換狀態並回傳API
  $(".showTodoGroup__main").on(
    "click",
    ".checkboxGroup__checkbox",
    function (e) {
      let selectedId = $(e.target).parent().parent().find(".todo").attr("id");
      toggleTodo(selectedId);
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
  //監聽deleteTodoBtn，刪除並即時更新todolist
  $(".showTodoGroup__main").on("click", ".deleteTodoBtn", function (e) {
    let selectedId = $(e.target).parent().find(".todo").attr("id");
    console.log(selectedId);
    deleteTodo(selectedId);
  });
  //監聽clearCompletedBtn，清除所有已完成todo
  $(".clearCompletedBtn").on("click", () => {
    deleteCompletedTodo();
  });
});
