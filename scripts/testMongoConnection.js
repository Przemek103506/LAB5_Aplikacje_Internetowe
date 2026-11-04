const { connectMongo } = require("../src/db/mongo");

async function main() {
    try {
        await connectMongo();
        console.log("Test połączenia MongoDB zakończony sukcesem");
    } catch (error) {
        console.error("Test MongoDB nie powiódł się");
        process.exitCode = 1;
    } finally {
        const mongoose = require("mongoose");
        await mongoose.disconnect();
    }
}

main();