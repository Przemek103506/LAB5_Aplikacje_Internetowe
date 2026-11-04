const studentRepository = require("../src/repositories/studentRepository");

async function main() {
    console.log("Test MongoDB Repository");
    console.log("Dostępne funkcje:");

    console.log(Object.keys(studentRepository));
}

main();