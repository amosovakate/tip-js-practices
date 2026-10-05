import { demoTasks, variantNumber, variantTasks } from "./data.js";
import {
  addTask,
  setTaskCompleted,
  renameTask,
  removeTask,
  getPendingTasks,
  getTaskTitles,
  getTaskStats,
} from "./task-service.js";

// Снимок исходных данных, чтобы в конце проверить, что demoTasks не изменился
const demoSnapshot = JSON.stringify(demoTasks);

function showStats(label, tasks) {
  const { total, completed, pending, progress } = getTaskStats(tasks);
  console.log(`${label}: всего ${total}; выполнено ${completed}; осталось ${pending}`);
  if (total === 0) {
    console.log("Задач пока нет");
  } else {
    console.log(`Прогресс: ${progress.toFixed(1)}%`);
  }
}

// Применяет результат операции: при успехе возвращает новый список, при ошибке оставляет старый
function applyResult(currentTasks, result) {
  if (result.ok) {
    return result.tasks;
  }
  console.error(`Ошибка: ${result.error}`);
  return currentTasks;
}

let currentTasks = demoTasks;

console.log("=== Исходные данные ===");
console.log("Задачи:", currentTasks);
console.log("Названия:", getTaskTitles(currentTasks));
console.log("Невыполненные:", getPendingTasks(currentTasks));
showStats("Исходный набор", currentTasks);

console.log("\n=== Добавление id = 20 ===");
currentTasks = applyResult(
  currentTasks,
  addTask(currentTasks, 20, "Добавить проверку", "high")
);
showStats("После добавления", currentTasks);

console.log("\n=== Выполнение id = 4 ===");
currentTasks = applyResult(currentTasks, setTaskCompleted(currentTasks, 4, true));
showStats("После выполнения", currentTasks);

console.log("\n=== Переименование id = 10 ===");
currentTasks = applyResult(
  currentTasks,
  renameTask(currentTasks, 10, "Подготовить инструкцию запуска")
);
showStats("После переименования", currentTasks);

console.log("\n=== Удаление id = 7 ===");
currentTasks = applyResult(currentTasks, removeTask(currentTasks, 7));
showStats("После удаления", currentTasks);

console.log("\n=== Обработка отказа (повторяющийся id = 4) ===");
const before = currentTasks;
currentTasks = applyResult(
  currentTasks,
  addTask(currentTasks, 4, "Дубликат", "low")
);
console.log("Состояние не изменилось:", currentTasks === before);

console.log("\n=== Итог ===");
console.log("Идентификаторы:", currentTasks.map((task) => task.id));
console.log("Невыполненные:", getPendingTasks(currentTasks));

console.log("\n=== Проверка исходного demoTasks ===");
console.log("demoTasks не изменился:", JSON.stringify(demoTasks) === demoSnapshot);
console.log(demoTasks);

// ============================================================
// Сценарий варианта
// ============================================================

console.log(`\n\n=== СЦЕНАРИЙ ВАРИАНТА ${variantNumber} ===`);

const variantSnapshot = JSON.stringify(variantTasks);
let variantCurrent = variantTasks;

console.log("Задачи:", variantCurrent);
showStats("Исходный набор варианта", variantCurrent);

console.log("\n--- Добавление id = 80 ---");
variantCurrent = applyResult(
  variantCurrent,
  addTask(variantCurrent, 80, "Проверить проект перед сдачей", "high")
);
showStats("После добавления", variantCurrent);

console.log("\n--- Выполнение id = 11 ---");
variantCurrent = applyResult(variantCurrent, setTaskCompleted(variantCurrent, 11, true));
showStats("После выполнения", variantCurrent);

console.log("\n--- Переименование id = 23 ---");
variantCurrent = applyResult(
  variantCurrent,
  renameTask(variantCurrent, 23, "Уточнить план работы")
);
showStats("После переименования", variantCurrent);

console.log("\n--- Удаление id = 37 ---");
variantCurrent = applyResult(variantCurrent, removeTask(variantCurrent, 37));
showStats("После удаления", variantCurrent);

console.log("\n--- Отказ: повторное добавление id = 80 ---");
const variantBefore = variantCurrent;
variantCurrent = applyResult(
  variantCurrent,
  addTask(variantCurrent, 80, "Дубликат", "low")
);
console.log("Состояние не изменилось:", variantCurrent === variantBefore);

console.log("\n--- Итог варианта ---");
console.log("Идентификаторы:", variantCurrent.map((task) => task.id));
showStats("Итоговая сводка", variantCurrent);
console.log("variantTasks не изменился:", JSON.stringify(variantTasks) === variantSnapshot);