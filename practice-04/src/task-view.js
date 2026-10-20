import { getTaskStats } from "./task-service.js";

// Создание DOM-элемента одной задачи
export function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = `task-card ${task.completed ? 'is-completed' : ''}`;
  li.dataset.taskId = task.id;

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;

  const priority = document.createElement("span");
  priority.className = "task-priority";
  const priorityMap = { low: "Низкий", medium: "Средний", high: "Высокий" };
  priority.textContent = priorityMap[task.priority] || task.priority;

  const createButton = (action, label) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.action = action;
    const span = document.createElement("span");
    span.className = "action-label";
    span.textContent = label;
    btn.append(span);
    return btn;
  };

  const toggleBtn = createButton("toggle", task.completed ? "Вернуть" : "Готово");
  const editBtn = createButton("edit", "Изменить");
  const deleteBtn = createButton("delete", "Удалить");

  const controls = document.createElement("div");
  controls.className = "task-controls";
  controls.append(toggleBtn, editBtn, deleteBtn);

  li.append(title, priority, controls);
  return li;
}

// Отрисовка списка
export function renderTaskList(listElement, tasks) {
  listElement.replaceChildren(...tasks.map(createTaskElement));
}

// Отрисовка статистики
export function renderSummary(summaryElement, tasks, visibleCount) {
  const stats = getTaskStats(tasks);
  const elements = {
    total: summaryElement.querySelector('[data-stat="total"]'),
    completed: summaryElement.querySelector('[data-stat="completed"]'),
    pending: summaryElement.querySelector('[data-stat="pending"]'),
    progress: summaryElement.querySelector('[data-stat="progress"]'),
    visible: summaryElement.querySelector('[data-stat="visible"]'),
  };
  
  if (elements.total) elements.total.textContent = stats.total;
  if (elements.completed) elements.completed.textContent = stats.completed;
  if (elements.pending) elements.pending.textContent = stats.pending;
  if (elements.progress) elements.progress.textContent = stats.progress.toFixed(1) + "%";
  if (elements.visible) elements.visible.textContent = visibleCount;
}

// Отрисовка пустого состояния
export function renderEmptyState(messageElement, total, visibleCount) {
  if (total === 0) {
    messageElement.hidden = false;
    messageElement.textContent = "Список задач пуст.";
  } else if (visibleCount === 0) {
    messageElement.hidden = false;
    messageElement.textContent = "Нет задач по выбранному фильтру.";
  } else {
    messageElement.hidden = true;
    messageElement.textContent = "";
  }
}