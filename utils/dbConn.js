// dotenv
const dotenv = require(`dotenv`);
dotenv.config({ path: `./config.env` });

const mongoose = require(`mongoose`);

const DatabaseConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        });

        // console.log(Database Connected ...);
        console.log(
            `Database Connected on Port ${conn.connection.port} ... ${conn.connection.host}`
        );
    } catch (error) {
        console.log(error);
        if (error == `MongoNetworkError`) {
            console.log(`MongoNetworkError - No connection`);
        }
    }
};

module.exports = DatabaseConnect;
