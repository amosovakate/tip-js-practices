export const STORAGE_VERSION = 1;

export function isValidTaskList(value) {
  if (!Array.isArray(value)) return false;
  const ids = new Set();
  for (const task of value) {
    if (typeof task !== 'object' || task === null) return false;
    if (!Number.isSafeInteger(task.id) || task.id <= 0) return false;
    if (ids.has(task.id)) return false; // проверка уникальности id
    ids.add(task.id);
    if (typeof task.title !== 'string' || task.title.trim().length === 0) return false;
    if (!['low', 'medium', 'high'].includes(task.priority)) return false;
    if (typeof task.completed !== 'boolean') return false;
  }
  return true;
}

export function loadTasks(storage, key, fallbackTasks) {
  try {
    const raw = storage.getItem(key);
    if (!raw) {
      return { ok: true, source: "initial", tasks: fallbackTasks.map(t => ({ ...t })) };
    }
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== STORAGE_VERSION) {
      throw new Error("Неизвестная версия данных");
    }
    if (!isValidTaskList(parsed.tasks)) {
      throw new Error("Некорректная схема данных");
    }
    return { ok: true, source: "storage", tasks: parsed.tasks.map(t => ({ ...t })) };
  } catch (error) {
    return {
      ok: false,
      source: "fallback",
      tasks: fallbackTasks.map(t => ({ ...t })),
      error: error.message || "Ошибка чтения",
    };
  }
}

export function saveTasks(storage, key, tasks) {
  try {
    if (!isValidTaskList(tasks)) {
      return { ok: false, error: "Некорректный список задач" };
    }
    storage.setItem(key, JSON.stringify({ version: STORAGE_VERSION, tasks }));
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message || "Ошибка сохранения" };
  }
}

export function removeSavedTasks(storage, key) {
  try {
    storage.removeItem(key);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message || "Ошибка удаления" };
  }
}