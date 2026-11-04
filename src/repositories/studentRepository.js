const Student = require("../models/Student");
const mongoose = require("mongoose");

// Pobieranie wszystkich studentów
async function findAll() {
    return Student.find().sort({ createdAt: -1 });
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