const mongoose = require("mongoose");
const { connectMongo } = require("../src/db/mongo");
const Student = require("../src/models/Student");

async function showStats(label) {
    const result = await Student.find({
        city: "Lublin"
    })
        .sort({
            fullName: 1,
            _id: 1
        })
        .explain("executionStats");

    console.log(`\n--- ${label} ---`);

    console.log(
        "Dokumenty sprawdzone:",
        result.executionStats.totalDocsExamined
    );

    console.log(
        "Czas wykonania (ms):",
        result.executionStats.executionTimeMillis
    );

    console.log(
        "Liczba zwróconych dokumentów:",
        result.executionStats.nReturned
    );

    console.log("Plan zapytania:");

    console.log(
        JSON.stringify(result.queryPlanner.winningPlan, null, 2)
    );
}

async function main() {
    try {
        await connectMongo();

        // Zapewniamy utworzenie indeksów modelu
        await Student.init();

        // Usuwamy indeksy, których działanie chcemy porównać
        try {
            await Student.collection.dropIndex("city_1");
        } catch (error) {
            console.log("Indeks city_1 nie był dostępny.");
        }

        try {
            await Student.collection.dropIndex("city_fullName_id");
        } catch (error) {
            console.log("Indeks złożony nie był dostępny.");
        }

        // Test przed utworzeniem indeksów
        await showStats("PRZED UTWORZENIEM INDEKSÓW");

        // Tworzymy indeks dla miasta
        await Student.collection.createIndex(
            { city: 1 },
            { name: "city_1" }
        );

        // Tworzymy indeks złożony
        await Student.collection.createIndex(
            { city: 1, fullName: 1, _id: 1 },
            { name: "city_fullName_id" }
        );

        console.log("\nUtworzono indeksy.");

        // Test po utworzeniu indeksów
        await showStats("PO UTWORZENIU INDEKSÓW");

    } catch (error) {
        console.error("Błąd testu indeksów:", error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
        console.log("\nRozłączono z MongoDB.");
    }
}

main();