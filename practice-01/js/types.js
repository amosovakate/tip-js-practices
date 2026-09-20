"use strict";

const result1 = "8" + 2;
console.log("Результат:", result1); // Ожидаемый результат: "82"
console.log("Тип результата:", typeof result1); // Ожидаемый тип: string

const result2 = "8" - 2;
console.log("Результат:", result2); // Ожидаемый результат: 6
console.log("Тип результата:", typeof result2); // Ожидаемый тип: number    

const result3 = Number("8") + 2;
console.log("Результат:", result3); // Ожидаемый результат: 10
console.log("Тип результата:", typeof result3); // Ожидаемый тип: number

const result4 = "12" > "3";
console.log("Результат:", result4); // Ожидаемый результат: false
console.log("Тип результата:", typeof result4); // Ожидаемый тип: boolean

const result5 = 12 === "12";
console.log("Результат:", result5); // Ожидаемый результат: false
console.log("Тип результата:", typeof result5); // Ожидаемый тип: boolean

const result6 = Number("");
console.log("Результат:", result6); // Ожидаемый результат: 0
console.log("Тип результата:", typeof result6); // Ожидаемый тип: number

const result7 = Number("text");
console.log("Результат:", result7); // Ожидаемый результат: NaN
console.log("Тип результата:", typeof result7); // Ожидаемый тип: number

const result8 = Boolean("false");
console.log("Результат:", result8); // Ожидаемый результат: true
console.log("Тип результата:", typeof result8); // Ожидаемый тип: boolean

const result9 = typeof null;
console.log("Результат:", result9); // Ожидаемый результат: "object" 
console.log("Тип результата:", typeof result9); // Ожидаемый тип: string

const result10 = typeof NaN;
console.log("Результат:", result10); // Ожидаемый результат: "number"
console.log("Тип результата:", typeof result10); // Ожидаемый тип: string