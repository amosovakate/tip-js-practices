"use strict";

const totalTasks = 5;
const completedTasks = 5;
const dailyLimit = 2;

if (!Number.isFinite(totalTasks) || !Number.isFinite(completedTasks)) {
    if (typeof totalTasks === "string" || typeof completedTasks === "string") {
        console.log("Ошибка: вместо числа передана строка.");
    } else {
        console.log("Ошибка: недопустимое числовое значение.");
    }
} else if (!Number.isInteger(totalTasks) || !Number.isInteger(completedTasks)) {
    console.log("Ошибка: дробное количество.");
} else if (totalTasks < 0 || completedTasks < 0) {
    console.log("Ошибка: отрицательное количество.");
} else if (totalTasks > 1000 || completedTasks > 1000) {
    console.log("Ошибка: превышена верхняя граница.");
} else if (totalTasks < completedTasks) {
    console.log("Ошибка: некорректное число выполненных задач.");
} else if (typeof dailyLimit === "string") {
    console.log("Ошибка: дневная норма задана строкой.");
} else if (!Number.isFinite(dailyLimit)) {
    console.log("Ошибка: недопустимое числовое значение дневной нормы.");
} else if (!Number.isInteger(dailyLimit)) {
    console.log("Ошибка: дробной дневной нормы быть не должно.");
} else if (dailyLimit === 0) {
    console.log("Ошибка; цикл не запускается.");
} else if (dailyLimit > 1000) {
    console.log("Ошибка: превышена верхняя граница нормы.");
} else {
    const difference = totalTasks - completedTasks;

    if (difference === 0) {
        console.log("Потребуется дней: 0");
    } else {
        console.log(`Осталось задач: ${difference}`);

        let remaining = difference;
        let day = 1;

        while (remaining > 0) {
            const completedToday = Math.min(remaining, dailyLimit);
            remaining -= completedToday;

            console.log(
                `День ${day}: выполнено ${completedToday}, осталось ${remaining}`
            );

            day += 1;
        }

        console.log(`Потребуется дней: ${day - 1}`);
    }
}