const mongoose = require("mongoose");
const { connectMongo } = require("../db/mongo");
const Student = require("../models/Student");

async function main() {
    try {
        // Połączenie z MongoDB
        await connectMongo();

        // Przygotowanie kolekcji
        await Student.init();

        // Usunięcie dotychczasowych studentów
        await Student.deleteMany({});

        console.log("Usunięto dotychczasowe dane.");

        // Lista miast
        const cities = [
            "Lublin",
            "Warszawa",
            "Kraków",
            "Rzeszów",
            "Gdańsk",
            "Wrocław",
            "Poznań",
            "Łódź"
        ];

        // Lista kierunków
        const fields = [
            "Informatyka",
            "Zarządzanie",
            "Matematyka",
            "Automatyka",
            "Ekonomia",
            "Logistyka"
        ];

        const students = [];

        // Generowanie 5000 studentów
        for (let i = 1; i <= 5000; i++) {
            const randomCity =
                cities[Math.floor(Math.random() * cities.length)];

            const randomField =
                fields[Math.floor(Math.random() * fields.length)];

            const randomYear =
                Math.floor(Math.random() * 5) + 1;

            const randomActive =
                Math.random() < 0.8;

            students.push({
                albumNumber: 100000 + i,

                fullName: `Student ${i}`,

                email: `student${i}@example.com`,

                city: randomCity,

                fieldOfStudy: randomField,

                year: randomYear,

                active: randomActive
            });
        }

        // Dodawanie wszystkich studentów
        await Student.insertMany(students);

        console.log("Dodano 5000 studentów.");

    } catch (error) {
        console.error("Błąd seedowania:", error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
        console.log("Rozłączono z MongoDB.");
    }
}

main();