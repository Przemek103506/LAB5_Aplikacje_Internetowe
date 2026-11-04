const mongoose = require("mongoose");
const { mongoUri } = require("../config/env");

async function connectMongo() {
    try {
        await mongoose.connect(mongoUri);
        console.log("Połączono z MongoDB");
    } catch (error) {
        console.error("Błąd połączenia z MongoDB:", error.message);
        throw error;
    }
}

module.exports = {
    connectMongo
};