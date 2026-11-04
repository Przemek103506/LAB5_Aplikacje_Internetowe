const Student = require("../models/Student");
const mongoose = require("mongoose");

// Pobieranie studentów z filtrowaniem, sortowaniem i paginacją
async function findAll(input = {}) {
    const { city, sortBy, order } = input;

    // 1. Filtrowanie
    const filter = {};

    if (typeof city === "string" && city.trim()) {
        filter.city = city.trim();
    }

    // 2. Kontrolowane sortowanie
    const allowedSort = ["fullName", "city", "createdAt"];

    const sortField = allowedSort.includes(sortBy)
        ? sortBy
        : "fullName";

    const direction = order === "desc" ? -1 : 1;

    // _id zapewnia stabilną kolejność rekordów
    const sortSpec = {
        [sortField]: direction,
        _id: direction
    };

    // 3. Paginacja
    const page = Math.max(Number(input.page) || 1, 1);

    const limit = Math.min(
        Math.max(Number(input.limit) || 10, 1),
        50
    );

    const skip = (page - 1) * limit;

    // 4. Pobieranie danych i liczenie rekordów
    const [items, total] = await Promise.all([
        Student.find(filter)
            .sort(sortSpec)
            .skip(skip)
            .limit(limit),

        Student.countDocuments(filter)
    ]);

    return {
        items,
        total
    };
}

// Pobieranie studenta po ID
async function findById(id) {
    if (!mongoose.isObjectIdOrHexString(id)) {
        return null;
    }

    return Student.findById(id);
}

// Dodawanie studenta
async function create(data) {
    return Student.create(data);
}

// Aktualizacja studenta
async function update(id, data) {
    if (!mongoose.isObjectIdOrHexString(id)) {
        return null;
    }

    return Student.findByIdAndUpdate(id, data, {
        returnDocument: "after",
        runValidators: true
    });
}

// Usuwanie studenta
async function remove(id) {
    if (!mongoose.isObjectIdOrHexString(id)) {
        return null;
    }

    return Student.findByIdAndDelete(id);
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};