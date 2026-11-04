const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        albumNumber: {
            type: Number,
            unique: true,
            sparse: true
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 120
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            unique: true
        },

        city: {
            type: String,
            required: true,
            trim: true
        },

        fieldOfStudy: {
            type: String,
            required: true,
            trim: true
        },

        year: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

// Indeks dla miasta
studentSchema.index(
    { city: 1 },
    { name: "city_1" }
);

// Indeks złożony: filtrowanie po mieście
// oraz sortowanie po nazwisku i identyfikatorze
studentSchema.index(
    { city: 1, fullName: 1, _id: 1 },
    { name: "city_fullName_id" }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;