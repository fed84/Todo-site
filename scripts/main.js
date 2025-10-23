import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

const dateToday = dayjs();
export const fullDate = dateToday.format("DD/MM/YY");
const dayElem = document.querySelector(".day");
if (dayElem) dayElem.innerHTML = dateToday.format("dddd");
const fullDateElem = document.querySelector(".full-date");
if (fullDateElem) fullDateElem.innerHTML = fullDate;

export class Todo {
  id;
  title;
  description;
  priority;
  status;
  creationDate;
  vital;

  constructor(todoDetails) {
    this.title = todoDetails.title;
    this.description = todoDetails.description;
    this.priority = todoDetails.priority;
    this.status = todoDetails.status;
    this.id = Math.random();
    this.creationDate = todoDetails.creationDate;
    this.vital = todoDetails.vital;
  }
  extraButton() {
    if (this.status !== "completed") {
      return `<button class='complete-button' data-todo-id='${this.id}'><img class="tick" src="images/tick.png"></button>`;
    } else {
      return "";
    }
  }

  getPriorityColor() {
    if (this.priority === "low") {
      return "green";
    }
    if (this.priority === "medium") {
      return "blue";
    }
    if (this.priority === "high") {
      return "red";
    }
  }

  getStatusColor() {
    if (this.status === "not started") {
      return "red";
    }
    if (this.status === "in progress") {
      return "blue";
    }
    if (this.status === "completed") {
      return "green";
    }
  }

  isVital() {
    if (this.vital) {
      return `<img class="vital-img tick" src="images/!.png">`;
    } else {
      return "";
    }
  }
}

// Hydrate stored todos (so methods like extraButton exist on each item)
const stored = JSON.parse(localStorage.getItem("todos")) || [];
export let todos = stored.map((todoDetails) => new Todo(todoDetails));

const storedCompleted =
  JSON.parse(localStorage.getItem("completed-todos")) || [];
export let completedTodos = storedCompleted.map(
  (todoDetails) => new Todo(todoDetails)
);

export function saveToStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("completed-todos", JSON.stringify(completedTodos));
}

export function renderTodos(array,stop) {
  let HTML = "";
  array.forEach((todo,index) => {
    if (index >= stop) {return}
    let todoHTML = `
    <div class="todo">
                <div class="progress-title-setting-div">
                <div class="left-group">
                  <img src="images/${todo.getStatusColor()}-circle.png" class="todo-icon" />
                  ${todo.extraButton()}
                  ${todo.isVital()}
                  </div>
                  <div class="todo-title middle-group">${todo.title}</div>
                  <div class="right-group">
                  <img class="todo-icon todo-icon-points" src="images/points.png" />
                  </div>
                </div>
                <div class="description-div">
                  ${todo.description}
                </div>
                <div class="bottom-todo">
                  <div class="priority">
                    Prority:
                      <span style="color: ${todo.getPriorityColor()}">${
      todo.priority
    }</span>
                  </div>
                  <div class="status">
                    Status: <span style="color: ${todo.getStatusColor()}">${
      todo.status
    }</span>
                  </div>
                  <div class="creation-date">Created on: ${
                    todo.creationDate
                  }</div>
                </div>
              </div>
    `;
    HTML += todoHTML;
  });
  if (document.querySelector(".list-of-todos")) {
    document.querySelector(".list-of-todos").innerHTML = HTML;
  }

  document.querySelectorAll(".complete-button").forEach((tick) => {
    tick.addEventListener("click", () => {
      const todoId = Number(tick.dataset.todoId);
      let newTodos = [];
      array.forEach((todo) => {
        if (todo.id !== todoId) {
          newTodos.push(todo);
        } else {
          todo.status = "completed";
          completedTodos.push(todo);
          todos = todos.filter((todo) => todo.id !== todoId);
        }
      });
      array = newTodos;

      saveToStorage();
      renderTodos(array,4);
      renderCompletedTodos(completedTodos);
      calculateStats();
    });
  });
}

renderTodos(todos,4);

export function renderCompletedTodos(array) {
  let HTML = "";
  array.forEach((todo) => {
    let todoHTML = `
    <div class="todo">
                <div class="progress-title-setting-div">
                <div class="left-group">
                  <img src="images/${todo.getStatusColor()}-circle.png" class="todo-icon" />
                  ${todo.extraButton()}
                  </div>
                  <div class="todo-title middle-group">${todo.title}</div>
                  <div class="right-group">
                  <img class="todo-icon todo-icon-points" src="images/points.png" />
                  </div>
                </div>
                <div class="description-div">
                  ${todo.description}
                </div>
                <div class="bottom-todo">
                  <div class="priority">
                    Prority:
                      <span style="color: ${todo.getPriorityColor()}">${
      todo.priority
    }</span>
                  </div>
                  <div class="status">
                    Status: <span style="color: ${todo.getStatusColor()}">${
      todo.status
    }</span>
                  </div>
                  <div class="creation-date">Created on: ${
                    todo.creationDate
                  }</div>
                </div>
              </div>
    `;
    HTML += todoHTML;
  });
  if (document.querySelector(".list-of-completed-todos")) {
    document.querySelector(".list-of-completed-todos").innerHTML = HTML;
  }
  const clearCompletedButton = document.querySelector(".clear-completed-todos");
  if (clearCompletedButton) {
    clearCompletedButton.addEventListener("click", () => {
      completedTodos = [];
      saveToStorage();
      renderCompletedTodos(completedTodos);
      calculateStats();
    });
  }
}
renderCompletedTodos(completedTodos);

function calculateStats() {
  const completedPercent = Math.round(
    (completedTodos.length / (todos.length + completedTodos.length)) * 100
  );
  if (document.querySelector(".completed-task-circle")) {
    document.querySelector(
      ".completed-task-circle"
    ).innerHTML = `${completedPercent}%`;
  }

  if (completedTodos.length === 0) {
    if (document.querySelector(".completed-task-circle")) {
      document.querySelector(".completed-task-circle").innerHTML = "0%";
    }
  }

  let inProgressTodos = 0;
  let notStartedTodos = 0;

  todos.forEach((todo) => {
    if (todo.status === "in progress") {
      inProgressTodos += 1;
    } else {
      notStartedTodos += 1;
    }
  });

  const totalTasks = todos.length + completedTodos.length;

  const inProgressPercent =
    totalTasks === 0 ? 0 : Math.round((inProgressTodos / totalTasks) * 100);
  const inProgressElem = document.querySelector(".in-progress-task-circle");
  if (inProgressElem) inProgressElem.innerHTML = `${inProgressPercent}%`;

  const notStartedPercent =
    totalTasks === 0 ? 0 : Math.round((notStartedTodos / totalTasks) * 100);
  const notStartedElem = document.querySelector(".not-started-task-circle");
  if (notStartedElem) notStartedElem.innerHTML = `${notStartedPercent}%`;
}

calculateStats();

const searchBar = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");

function applySearchFunction() {
  if (searchButton) {
    searchButton.addEventListener("click", () => {
      searchTodo();
    });
  }
}

applySearchFunction();

function searchTodo() {
  const search = searchBar.value.toLowerCase();
  console.log(search);
  let searchArray = [];
  todos.forEach((todo) => {
    if (todo.title.includes(search)) {
      searchArray.push(todo);
    }
  });
  renderTodos(searchArray,1000);
  displayFilter(search);
  searchBar.value = ''
  searchBar.focus()
}

function displayFilter(search) {
  const filterDiv = document.querySelector(
    ".filter-div"
  )
  filterDiv.innerHTML = `<div class="filter-search">${search}</div><img src="images/cross.png" alt="cross" class="cancel-filter tick" />`;
  if(search === '') {filterDiv.innerHTML = '';}
  document.querySelector('.cancel-filter').addEventListener('click', () => {
    renderTodos(todos,4);
    filterDiv.innerHTML = ''
  })
}
