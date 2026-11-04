const mongoose = require("mongoose");
const { connectMongo } = require("../src/db/mongo");

const studentRepository = require("../src/repositories/studentRepository");

async function main() {
    try {
        await connectMongo();

        // Test 1 - filtrowanie po mieście
        console.log("\n--- FILTROWANIE ---");

        const lublinStudents = await studentRepository.findAll({
            city: "Lublin",
            sortBy: "fullName",
            order: "asc",
            page: 1,
            limit: 10
        });

        console.log("Liczba studentów:", lublinStudents.total);
        console.log("Pobrano:", lublinStudents.items.length);
        console.log(lublinStudents.items);

        // Test 2 - sortowanie malejące
        console.log("\n--- SORTOWANIE ---");

        const sortedStudents = await studentRepository.findAll({
            sortBy: "fullName",
            order: "desc",
            page: 1,
            limit: 5
        });

        console.log(sortedStudents.items);

        // Test 3 - page = 0
        console.log("\n--- PAGE = 0 ---");

        const pageZero = await studentRepository.findAll({
            page: 0,
            limit: 10
        });

        console.log("Pobrano:", pageZero.items.length);

        // Test 4 - page = -1
        console.log("\n--- PAGE = -1 ---");

        const pageNegative = await studentRepository.findAll({
            page: -1,
            limit: 10
        });

        console.log("Pobrano:", pageNegative.items.length);

        // Test 5 - limit = 1000
        console.log("\n--- LIMIT = 1000 ---");

        const bigLimit = await studentRepository.findAll({
            page: 1,
            limit: 1000
        });

        console.log("Pobrano:", bigLimit.items.length);

        // Test 6 - limit = abc
        console.log("\n--- LIMIT = abc ---");

        const invalidLimit = await studentRepository.findAll({
            page: 1,
            limit: "abc"
        });

        console.log("Pobrano:", invalidLimit.items.length);

        // Test 7 - strona większa niż liczba stron
        console.log("\n--- STRONA POZA ZAKRESEM ---");

        const lastPage = await studentRepository.findAll({
            page: 10000,
            limit: 10
        });

        console.log("Liczba wszystkich:", lastPage.total);
        console.log("Pobrano:", lastPage.items.length);

        console.log("\nTest filtrowania zakończony.");

    } catch (error) {
        console.error("Błąd:", error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
        console.log("Rozłączono z MongoDB.");
    }
}

main();