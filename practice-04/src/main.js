import { demoTasks, variantTasks, variantNumber } from "./data.js";
import {
  addTask, findTaskById, removeTask, setTaskCompleted, updateTask,
} from "./task-service.js";
import { getVisibleTasks } from "./task-selectors.js";
import { renderEmptyState, renderSummary, renderTaskList } from "./task-view.js";
import { validateTaskDraft } from "./form-validation.js";
import { loadTasks, removeSavedTasks, saveTasks } from "./task-storage.js";

const elements = {
  list: document.querySelector("#task-list"),
  filters: document.querySelector("#task-filters"),
  summary: document.querySelector("#task-summary"),
  empty: document.querySelector("#empty-message"),
  message: document.querySelector("#operation-message"),
  datasetLabel: document.querySelector("#dataset-label"),
  storageStatus: document.querySelector("#storage-status"),
  form: document.querySelector("#task-form"),
  formHeading: document.querySelector("#form-heading"),
  formMode: document.querySelector("#form-mode"),
  formMessage: document.querySelector("#form-message"),
  idInput: document.querySelector("#task-id"),
  titleInput: document.querySelector("#task-title"),
  priorityInput: document.querySelector("#task-priority"),
  submitButton: document.querySelector("#form-submit"),
  cancelButton: document.querySelector("#cancel-edit"),
  resetButton: document.querySelector("#reset-data"),
};

const params = new URLSearchParams(window.location.search);
const isVariant = params.get("dataset") === "variant";
const isCheckRun = params.get("mode") === "check";
const initialTasks = isVariant ? variantTasks : demoTasks;
const datasetName = isVariant ? "variant" : "demo";
const storageKey = isCheckRun ? `tip-js-practice-04:checks:${datasetName}` : `tip-js-practice-04:${datasetName}`;

let loaded;
try {
  loaded = loadTasks(window.localStorage, storageKey, initialTasks);
} catch (error) {
  loaded = { ok: false, source: "fallback", tasks: initialTasks.map(t => ({ ...t })), error: error.message };
}
let currentTasks = loaded.tasks;
let currentFilter = "all";
let editingId = null;

elements.datasetLabel.textContent = isVariant ? `Индивидуальный вариант: ${variantNumber ?? "не указан"}` : "Общий контрольный набор";

if (loaded.source === "storage") {
  elements.storageStatus.textContent = "Данные восстановлены из localStorage.";
} else if (loaded.ok) {
  elements.storageStatus.textContent = "Используется исходный набор; сохранённых данных пока нет.";
} else {
  elements.storageStatus.textContent = loaded.error;
  elements.storageStatus.classList.add("is-warning");
}

// Отрисовка всего приложения
function renderApp() {
  const visible = getVisibleTasks(currentTasks, currentFilter);
  renderTaskList(elements.list, visible);
  renderSummary(elements.summary, currentTasks, visible.length);
  renderEmptyState(elements.empty, currentTasks.length, visible.length);
  
  for (const btn of elements.filters.querySelectorAll("[data-filter]")) {
    btn.classList.toggle("is-active", btn.dataset.filter === currentFilter);
  }
}

// Очистка ошибок
function clearFieldError(name) {
  const input = elements.form.elements.namedItem(name);
  const message = elements.form.querySelector(`[data-error-for="${name}"]`);
  if (input) {
    input.setCustomValidity("");
    input.removeAttribute("aria-invalid");
  }
  if (message) message.textContent = "";
}
function clearFormErrors() {
  ["id", "title", "priority"].forEach(clearFieldError);
  elements.formMessage.textContent = "";
}
function showFormErrors(errors) {
  clearFormErrors();
  for (const [name, text] of Object.entries(errors)) {
    const input = elements.form.elements.namedItem(name);
    const message = elements.form.querySelector(`[data-error-for="${name}"]`);
    if (input) {
      input.setCustomValidity(text);
      input.setAttribute("aria-invalid", "true");
    }
    if (message) message.textContent = text;
  }
  elements.form.reportValidity();
}

function setFormMode(id = null) {
  clearFormErrors();
  editingId = id;
  if (id === null) {
    elements.formHeading.textContent = "Новая задача";
    elements.formMode.textContent = "Создание";
    elements.idInput.disabled = false;
    elements.form.reset();
    elements.submitButton.textContent = "Добавить задачу";
    elements.cancelButton.hidden = true;
  } else {
    const task = findTaskById(currentTasks, id);
    if (!task) return setFormMode();
    elements.formHeading.textContent = "Редактирование";
    elements.formMode.textContent = "Редактирование";
    elements.idInput.value = task.id;
    elements.idInput.disabled = true;
    elements.titleInput.value = task.title;
    elements.priorityInput.value = task.priority;
    elements.submitButton.textContent = "Сохранить изменения";
    elements.cancelButton.hidden = false;
  }
}

function persistCurrentTasks(successMessage) {
  const saved = saveTasks(window.localStorage, storageKey, currentTasks);
  elements.storageStatus.classList.toggle("is-warning", !saved.ok);
  elements.storageStatus.textContent = saved.ok ? "Изменения сохранены в localStorage." : saved.error;
  elements.message.textContent = saved.ok ? successMessage : `${successMessage} ${saved.error}`;
  renderApp();
}

// Обработчик отправки формы
function handleFormSubmit(event) {
  event.preventDefault();
  const draft = {
    id: elements.idInput.value,
    title: elements.titleInput.value,
    priority: elements.priorityInput.value,
  };
  
  const validation = validateTaskDraft(draft, currentTasks, editingId);
  if (!validation.ok) return showFormErrors(validation.errors);

  let result;
  if (editingId === null) {
    result = addTask(currentTasks, validation.value.id, validation.value.title, validation.value.priority);
  } else {
    result = updateTask(currentTasks, editingId, validation.value.title, validation.value.priority);
  }

  if (result.ok) {
    currentTasks = result.tasks;
    setFormMode();
    persistCurrentTasks("Задача успешно сохранена.");
  } else {
    showFormErrors({ id: result.error });
  }
}

// Обработчик кликов по списку задач
function handleTaskListClick(event) {
  const btn = event.target.closest("button[data-action]");
  if (!btn) return;
  const taskId = Number(btn.closest("[data-task-id]").dataset.taskId);
  const action = btn.dataset.action;
  const task = findTaskById(currentTasks, taskId);

  if (action === "toggle") {
    const res = setTaskCompleted(currentTasks, taskId, !task.completed);
    if (res.ok) { currentTasks = res.tasks; persistCurrentTasks("Статус изменён."); }
  } else if (action === "delete") {
    const res = removeTask(currentTasks, taskId);
    if (res.ok) { currentTasks = res.tasks; persistCurrentTasks("Задача удалена."); }
  } else if (action === "edit") {
    setFormMode(taskId);
  }
}

function handleFilterClick(event) {
  const btn = event.target.closest("[data-filter]");
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  renderApp();
}

function handleResetClick() {
  const res = removeSavedTasks(window.localStorage, storageKey);
  if (!res.ok) {
    elements.message.textContent = `Ошибка сброса: ${res.error}`;
    return;
  }
  currentTasks = initialTasks.map(t => ({ ...t }));
  currentFilter = "all";
  setFormMode();
  
  // Вместо persistCurrentTasks (который сохраняет данные) 
  // просто обновляем интерфейс и пишем сообщение
  elements.storageStatus.textContent = "Данные сброшены к исходным.";
  elements.storageStatus.classList.remove("is-warning");
  elements.message.textContent = "Данные сброшены к исходным.";
  renderApp();
}

elements.form.addEventListener("submit", handleFormSubmit);
elements.form.addEventListener("input", (e) => {
  if (e.target.name) clearFieldError(e.target.name);
});
elements.list.addEventListener("click", handleTaskListClick);
elements.filters.addEventListener("click", handleFilterClick);
elements.cancelButton.addEventListener("click", () => setFormMode());
elements.resetButton.addEventListener("click", handleResetClick);

// Запуск
setFormMode();
renderApp();