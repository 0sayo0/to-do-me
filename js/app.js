// Selectors
const taskContainer = document.querySelector("#task-container");
const newTaskBtn = document.querySelector("#new-task");
const deleteAllBtn = document.querySelector("#delete-all");

const modal = document.querySelector("#modal-new-task");
const closeBtn = document.querySelector("#close-btn");

const formTask = document.querySelector("#form-task");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");

// LISTENERS
document.addEventListener("DOMContentLoaded", () => {
  // When the page loads, tell the UI to display the tasks that the TaskManager just retrieved.
  ui.showTasks(taskManager.tasks);
  ui.showDefaultMessage(taskManager.tasks);
});

// 1. Activar el modal con tu botón
newTaskBtn.addEventListener("click", () => {
  updating = false;

  formTask.reset();
  modal.showModal();
});

// 2. Cerrar el modal con el botón de cancelar
closeBtn.addEventListener("click", () => {
  modal.close();
});

// 3. Opcional pero muy recomendado: Cerrar al hacer clic afuera (en el backdrop)
modal.addEventListener("click", (e) => {
  const rect = modal.getBoundingClientRect();
  // Comprueba si el clic ocurrió fuera de las dimensiones de la caja del modal
  const isInDialog =
    rect.top <= e.clientY &&
    e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX &&
    e.clientX <= rect.left + rect.width;

  if (!isInDialog) {
    modal.close();
  }
});

formTask.addEventListener("submit", dataTask);

deleteAllBtn.addEventListener("click", handleDeleteAllTasks);

// Axiliar Variables
let updating;
let currentId;

// Classes
class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  }

  addTask(title, description) {
    const task = {
      id: Math.random().toString(36).substring(2) + Date.now(),
      title,
      description,
      checked: "off",
    };

    this.tasks = [...this.tasks, task];

    localStorage.setItem("tasks", JSON.stringify(this.tasks));

    ui.showTasks(this.tasks);
  }

  updateTask(newTitle, newDescription, taskId) {
    const updatedTask = {
      id: taskId,
      title: newTitle,
      description: newDescription,
      checked: "off",
    };

    this.tasks = this.tasks.map((task) =>
      task.id === taskId ? updatedTask : task,
    );

    localStorage.setItem("tasks", JSON.stringify(this.tasks));

    ui.showTasks(this.tasks);
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    ui.showTasks(this.tasks);
    ui.showDefaultMessage(this.tasks);
  }

  deleteAllTasks() {
    this.tasks = [];
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    ui.showTasks(this.tasks);
    ui.showDefaultMessage(this.tasks);
  }
}

class UI {
  showAlert(msg, type) {
    if (type === "error") {
      const errorAlert = document.createElement("P");
      errorAlert.textContent = msg;
      errorAlert.classList.add(
        "bg-red-200",
        "font-semibold",
        "text-center",
        "text-red-600",
        "p-2",
        "rounded",
        "rounded-md",
      );

      const reference = formTask.children[2];

      formTask.insertBefore(errorAlert, reference);

      setTimeout(() => {
        errorAlert.remove();
      }, 3000);
    }
  }

  showTasks(tasks) {
    while (taskContainer.firstChild) {
      taskContainer.removeChild(taskContainer.firstChild);
    }

    tasks.forEach((task) => {
      const showedTask = document.createElement("DIV");
      showedTask.classList.add("flex", "justify-between", "items-center");
      showedTask.dataset.id = task.id;

      // Input checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = task.checked;
      checkbox.classList.add(
        "appearance-none",
        "bg-white",
        "border",
        "border-transparent",
        "rounded",
        "w-[23px]",
        "h-[18px]",
        "checked:bg-emerald-600",
        "bg-center",
        "bg-no-repeat",
        "checked:bg-[length:14px_14px]",
        "checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIwIDYgOSAxN2wtNS01Ii8+PC9zdmc+')]",
      );

      // Task content
      const infoTask = document.createElement("DIV");
      infoTask.classList.add("w-full", "text-start", "mx-6");

      const taskTitle = document.createElement("H4");
      taskTitle.textContent = task.title;
      taskTitle.classList.add("font-semibold", "text-xl", "text-emerald-600");

      const taskDescription = document.createElement("P");
      taskDescription.textContent = task.description;
      taskDescription.classList.add(
        "font-normal",
        "text-base",
        "text-gray-700",
      );

      //Task Buttons
      const buttonsTask = document.createElement("DIV");
      buttonsTask.classList.add(
        "flex",
        "flex-col",
        "justify-center",
        "items-center",
        "gap-2",
      );

      const editBtn = document.createElement("button");
      editBtn.textContent = "Editar";
      editBtn.classList.add(
        "text-sm",
        "bg-blue-400",
        "text-white",
        "w-[80px]",
        "py-1",
        "rounded",
        "rounded-md",
        "cursor-pointer",
        "hover:bg-blue-500",
        "hover:-translate-y-1",
        "transition-all",
        "edit-btn",
      );
      editBtn.onclick = () =>
        handleUpdating(task.title, task.description, task.id);

      const deleteBtn = document.createElement("buttons");
      deleteBtn.textContent = "Eliminar";
      deleteBtn.classList.add(
        "text-sm",
        "bg-red-400",
        "text-white",
        "w-[80px]",
        "py-1",
        "rounded",
        "rounded-md",
        "cursor-pointer",
        "hover:bg-red-500",
        "hover:-translate-y-1",
        "transition-all",
      );

      deleteBtn.onclick = () => handleDeleting(task.id);

      // Inject into HTML
      infoTask.appendChild(taskTitle);
      infoTask.appendChild(taskDescription);

      buttonsTask.appendChild(editBtn);
      buttonsTask.appendChild(deleteBtn);

      showedTask.appendChild(checkbox);
      showedTask.appendChild(infoTask);
      showedTask.appendChild(buttonsTask);

      taskContainer.appendChild(showedTask);

      checkbox.onclick = () => {
        if (checkbox.value === "off") {
          checkbox.value = "on";
          taskTitle.classList.add("line-through");
          taskDescription.classList.add("line-through");

          task.checked = checkbox.value;

          return;
        }
        if (checkbox.value === "on") {
          checkbox.value = "off";
          taskTitle.classList.remove("line-through");
          taskDescription.classList.remove("line-through");

          task.checked = checkbox.value;

          return;
        }
      };
    });
  }

  showDefaultMessage(tasks) {
    if (tasks.length === 0) {
      const defaultMessage = document.createElement("P");
      defaultMessage.textContent = "No hay tareas pendientes";
      defaultMessage.classList.add("text-zinc-500");

      taskContainer.appendChild(defaultMessage);
    }
  }
}

const taskManager = new TaskManager();
const ui = new UI();

function dataTask(e) {
  e.preventDefault();

  const title = titleInput.value;
  const description = descriptionInput.value;

  if (title.trim() === "" || description.trim() === "") {
    ui.showAlert("Todos los campos son obligatorios", "error");
    return;
  }

  if (updating === true) {
    taskManager.updateTask(title, description, currentId);

    formTask.reset();

    modal.close();
    return;
  }

  taskManager.addTask(title, description);
  formTask.reset();

  modal.close();
}

function handleUpdating(title, description, id) {
  updating = true;

  modal.showModal();

  titleInput.value = title;
  descriptionInput.value = description;

  currentId = id;
}

function handleDeleting(id) {
  taskManager.deleteTask(id);
}

function handleDeleteAllTasks() {
  taskManager.deleteAllTasks();
}
