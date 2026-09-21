"use strict";

const totalTasks = 6;
const completedTasks = 0;
const dailyLimit = 1;

const dayNames = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];

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
} else if (dailyLimit < 1) {
    console.log("Ошибка: дневная норма должна быть не меньше 1.");
} else if (dailyLimit > 1000) {
    console.log("Ошибка: превышена верхняя граница нормы.");
} else {
    const difference = totalTasks - completedTasks;

    if (difference === 0) {
        console.log("Рабочих дней с выполнением задач: 0");
        console.log("Всего календарных дней: 0");
    } else {
        console.log(`Осталось задач: ${difference}`);

        let remaining = difference;
        let day = 1;
        let workingDays = 0;

        while (remaining > 0) {
            const weekdayIndex = (day - 1) % 7; // 0 - понедельник, 5 - суббота, 6 - воскресенье
            const dayName = dayNames[weekdayIndex];

            if (weekdayIndex >= 5) {
                console.log(`День ${day} (${dayName}): выходной`);
            } else {
                const completedToday = Math.min(remaining, dailyLimit);
                remaining -= completedToday;
                workingDays += 1;

                console.log(
                    `День ${day} (${dayName}): выполнено ${completedToday}, осталось ${remaining}`
                );
            }

            day += 1;
        }

        console.log(`Рабочих дней с выполнением задач: ${workingDays}`);
        console.log(`Всего календарных дней: ${day - 1}`);
    }
}