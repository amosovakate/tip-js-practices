export function getVisibleTasks(tasks, filter = "all") {
  if (!Array.isArray(tasks)) return [];
  if (filter === "pending") return tasks.filter(t => !t.completed);
  if (filter === "completed") return tasks.filter(t => t.completed);
  return [...tasks]; // filter === "all"
}