const mongoose = require("mongoose");
const { connectMongo } = require("../src/db/mongo");

const studentRepository = require("../src/repositories/studentRepository");

async function main() {
    try {
        // 1. Połączenie z MongoDB
        await connectMongo();

        // 2. Przygotowanie danych studenta
        const studentData = {
            fullName: "Jan Kowalski",
            email: `jan.kowalski.${Date.now()}@example.com`,
            city: "Lublin",
            fieldOfStudy: "Informatyka",
            year: 2,
            active: true
        };

        // 3. CREATE - dodawanie studenta
        console.log("\n--- CREATE ---");

        const createdStudent = await studentRepository.create(studentData);

        console.log("Dodano studenta:");
        console.log(createdStudent);

        const studentId = createdStudent._id;

        // 4. FIND ALL - pobieranie wszystkich studentów
        console.log("\n--- FIND ALL ---");

        const students = await studentRepository.findAll();

        console.log("Liczba studentów:", students.length);
        console.log(students);

        // 5. FIND BY ID - pobieranie po ID
        console.log("\n--- FIND BY ID ---");

        const foundStudent = await studentRepository.findById(studentId);

        console.log("Znaleziony student:");
        console.log(foundStudent);

        // 6. UPDATE - aktualizacja danych
        console.log("\n--- UPDATE ---");

        const updatedStudent = await studentRepository.update(studentId, {
            city: "Warszawa",
            year: 3
        });

        console.log("Zaktualizowany student:");
        console.log(updatedStudent);

        // 7. REMOVE - usuwanie studenta
        console.log("\n--- REMOVE ---");

        const deletedStudent = await studentRepository.remove(studentId);

        console.log("Usunięty student:");
        console.log(deletedStudent);

        // 8. Sprawdzenie nieistniejącego dokumentu
        console.log("\n--- BRAK DOKUMENTU ---");

        const missingStudent = await studentRepository.findById(
            "507f1f77bcf86cd799439011"
        );

        console.log("Nieistniejący student:", missingStudent);

        const missingUpdate = await studentRepository.update(
            "507f1f77bcf86cd799439011",
            { city: "Lublin" }
        );

        console.log("Aktualizacja nieistniejącego:", missingUpdate);

        const missingDelete = await studentRepository.remove(
            "507f1f77bcf86cd799439011"
        );

        console.log("Usuwanie nieistniejącego:", missingDelete);

        // 9. Niepoprawny identyfikator
        console.log("\n--- NIEPOPRAWNE ID ---");

        const invalidStudent = await studentRepository.findById("abc");

        console.log("Wynik dla niepoprawnego ID:", invalidStudent);

        // 10. Sprawdzenie duplikatu e-mail
        console.log("\n--- DUPLIKAT EMAIL ---");

        const duplicateData = {
            fullName: "Anna Nowak",
            email: `duplicate.${Date.now()}@example.com`,
            city: "Lublin",
            fieldOfStudy: "Informatyka",
            year: 1
        };

        await studentRepository.create(duplicateData);

        try {
            await studentRepository.create(duplicateData);
        } catch (err) {
            if (err.code === 11000) {
                console.log("Wykryto duplikat adresu e-mail!");
            } else {
                throw err;
            }
        }

        // Sprzątanie po teście duplikatu
        const duplicateStudent = await studentRepository.findAll();

        const testStudent = duplicateStudent.find(
            student => student.email === duplicateData.email
        );

        if (testStudent) {
            await studentRepository.remove(testStudent._id);
        }

        console.log("\nTest repository zakończony.");

    } catch (err) {
        console.error("Błąd testu:", err.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
        console.log("Rozłączono z MongoDB");
    }
}

main();