//(N = 1 в журнале)

"use strict"

const totalTasks = 12;
const completedTasks = 5;
if (Number.isFinite(totalTasks)&&(Number.isFinite(completedTasks))) {
    if (Number.isInteger(totalTasks)&&(Number.isInteger(completedTasks))){
        if (totalTasks < 1000 && completedTasks < 1000){
            if (totalTasks < 0 || completedTasks < 0){
                console.log("Ошибка: отрицательное количество."); // отрицательное число
            }   else{
                if (totalTasks === 0 && completedTasks === 0){
                    console.log("Сообщение «Задач пока нет»"); // задач нет
                } 
                if (totalTasks === completedTasks && totalTasks !== 0){
                    console.log("Осталось 0; прогресс 100.0%; статус «Завершено»."); // завершено
                }  
                if (totalTasks > 0 && completedTasks === 0){
                    console.log(`Осталось ${totalTasks}; прогресс 0.0%; статус «Не начато».`); // не начато
                }
                if (totalTasks > completedTasks && completedTasks !== 0){
                    const diffrence = totalTasks - completedTasks;
                    const precent = (completedTasks / totalTasks * 100).toFixed(1);
                    console.log(`Осталось ${diffrence}, прогресс ${precent}; статус "В работе"`); // в работе
                }   
                if (totalTasks < completedTasks){
                    console.log("Ошибка: выполнено больше, чем существует."); // выполнено больше, чем есть
                }
            }
        }   else{
            console.log("Ошибка: превышена верхняя граница."); // больше 1000
        }
    }   else{
        console.log("Ошибка: дробное количество."); // дробь
    }

}   else{
    if (typeof totalTasks === "string" || typeof completedTasks === "string"){
        console.log("Ошибка: вместо числа передана строка."); // строка
    }   else {
        console.log("Ошибка: недопустимое числовое значение."); // непопустимое число
    }
}