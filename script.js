let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

window.onload = () => {
  renderTasks();
  document.getElementById("themeToggle").onclick = toggleTheme;
};

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskDate = document.getElementById("taskDate");
  const text = taskInput.value.trim();
  const date = taskDate.value;

  if (text === "") return alert("Please enter a task.");

  const task = {
    id: Date.now(),
    text,
    date,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskDate.value = "";
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.filter(filterLogic[currentFilter]).forEach(task => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const taskText = document.createElement("span");
    taskText.innerText = task.text + (task.date ? ` (Due: ${task.date})` : "");
    
    // ✅ Mark complete / undo
    taskText.onclick = () => toggleComplete(task.id);

    // 📝 Edit on double click
    taskText.ondblclick = () => editTask(task);

    const delBtn = document.createElement("button");
    delBtn.innerHTML = "🗑️";
    delBtn.onclick = e => {
      e.stopPropagation();
      deleteTask(task.id);
    };

    li.appendChild(taskText);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}


function toggleComplete(id) {
  tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function editTask(task) {
  const newText = prompt("Edit Task:", task.text);
  if (newText !== null) {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();
}

const filterLogic = {
  all: () => true,
  active: task => !task.completed,
  completed: task => task.completed
};

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}
