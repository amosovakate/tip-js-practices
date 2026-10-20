const ALLOWED_PRIORITIES = new Set(["low", "medium", "high"]);

export function validateTaskDraft(draft, tasks, editingId = null) {
  const errors = {};
  const { id, title, priority } = draft || {};

  const numId = Number(id);
  
  if (editingId === null) {
    if (!Number.isSafeInteger(numId) || numId <= 0) {
      errors.id = "Некорректный id";
    } else if (tasks.some(t => t.id === numId)) {
      errors.id = "Задача с таким id уже существует";
    }
  } else {
    const taskToEdit = tasks.find(t => t.id === editingId);
    if (!taskToEdit) {
      errors.id = "Редактируемая задача не найдена";
    }
  }

  const normalizedTitle = typeof title === "string" ? title.trim() : "";
  if (normalizedTitle.length === 0) {
    errors.title = "Название не может быть пустым";
  } else if (normalizedTitle.length > 100) {
    errors.title = "Название не должно превышать 100 символов";
  }

  if (!ALLOWED_PRIORITIES.has(priority)) {
    errors.priority = "Некорректный приоритет";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      id: editingId !== null ? editingId : numId,
      title: normalizedTitle,
      priority
    }
  };
}