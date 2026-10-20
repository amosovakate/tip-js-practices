// Проверка корректности названия задачи (вспомогательная функция)
export function normalizeTitle(title) {
  if (typeof title !== 'string') return '';
  return title.trim();
}

export function isValidTitle(title) {
  const normalized = normalizeTitle(title);
  return normalized.length > 0 && normalized.length <= 100;
}

// 1. Создание задачи
export function createTask(id, title, priority = "medium") {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: 'Некорректный id' };
  }
  if (!isValidTitle(title)) {
    return { ok: false, error: 'Некорректное название' };
  }
  if (!['low', 'medium', 'high'].includes(priority)) {
    return { ok: false, error: 'Некорректный приоритет' };
  }

  return {
    ok: true,
    task: {
      id,
      title: normalizeTitle(title),
      priority,
      completed: false
    }
  };
}

// 2. Поиск по id
export function findTaskById(tasks, id) {
  if (!Array.isArray(tasks)) return undefined;
  return tasks.find(task => task.id === id);
}

// 3. Получение невыполненных
export function getPendingTasks(tasks) {
  if (!Array.isArray(tasks)) return [];
  return tasks.filter(task => !task.completed);
}

// 4. Получение названий
export function getTaskTitles(tasks) {
  if (!Array.isArray(tasks)) return [];
  return tasks.map(task => task.title);
}

// 5. Статистика
export function getTaskStats(tasks) {
  if (!Array.isArray(tasks)) {
    return { total: 0, completed: 0, pending: 0, progress: 0 };
  }
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : (completed / total) * 100;

  return { total, completed, pending, progress };
}

// 6. Добавление задачи
export function addTask(tasks, id, title, priority = "medium") {
  const createResult = createTask(id, title, priority);
  if (!createResult.ok) {
    return createResult;
  }
  
  if (findTaskById(tasks, id)) {
    return { ok: false, error: 'Задача с таким id уже существует' };
  }
  
  return { ok: true, tasks: [...tasks, createResult.task] };
}

// 7. Изменение статуса
export function setTaskCompleted(tasks, id, completed) {
  if (typeof completed !== 'boolean') {
    return { ok: false, error: 'completed должен быть boolean' };
  }
  const task = findTaskById(tasks, id);
  if (!task) {
    return { ok: false, error: 'Задача не найдена' };
  }
  const newTasks = tasks.map(t => t.id === id ? { ...t, completed } : t);
  return { ok: true, tasks: newTasks };
}

// 8. Переименование
export function renameTask(tasks, id, title) {
  if (!isValidTitle(title)) {
    return { ok: false, error: 'Некорректное название' };
  }
  const task = findTaskById(tasks, id);
  if (!task) {
    return { ok: false, error: 'Задача не найдена' };
  }
  const newTasks = tasks.map(t => t.id === id ? { ...t, title: normalizeTitle(title) } : t);
  return { ok: true, tasks: newTasks };
}

// 9. Удаление
export function removeTask(tasks, id) {
  const task = findTaskById(tasks, id);
  if (!task) {
    return { ok: false, error: 'Задача не найдена' };
  }
  const newTasks = tasks.filter(t => t.id !== id);
  return { ok: true, tasks: newTasks };
}

// 10. Обновление (НОВОЕ ИЗ ПР4)
export function updateTask(tasks, id, title, priority) {
  // Проверяем id
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: 'Некорректный id' };
  }
  // Проверяем существование задачи
  const task = findTaskById(tasks, id);
  if (!task) {
    return { ok: false, error: 'Задача не найдена' };
  }
  // Проверяем title и priority
  if (!isValidTitle(title)) {
    return { ok: false, error: 'Некорректное название' };
  }
  if (!['low', 'medium', 'high'].includes(priority)) {
    return { ok: false, error: 'Некорректный приоритет' };
  }

  // Возвращаем новый массив, меняя только title и priority
  const newTasks = tasks.map(t => 
    t.id === id 
      ? { ...t, title: normalizeTitle(title), priority } 
      : t
  );

  return { ok: true, tasks: newTasks };
}