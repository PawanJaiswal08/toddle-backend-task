// dotenv
const dotenv = require(`dotenv`);
dotenv.config({ path: `./../config.env` });

// Express
const express = require(`express`);
const app = express();

const path = require(`path`);
const expressGraphQL = require(`express-graphql`).graphqlHTTP;
const bodyParser = require(`body-parser`);
const cookieParser = require(`cookie-parser`);
const cors = require("cors");

// Database Connection
require(`../utils/dbConn`)();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    cors({
        // origin: 'http://localhost/:3000/',
        // headers: "*",
        // preflightContinue: false,
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

// Swagger Documentation
app.use(`/api-docs`, require(`./../api-docs/Swagger`));

// GraphQL
const schema = require(`./../graphql-schema/RootQuery`);
app.use(
    `/graphql`,
    expressGraphQL({
        schema: schema,
        graphiql: true,
    })
);

// Server
const PORT = process.env.PORT || 8000;

// Routes
app.get(`/`, (req, res) => {
    res.send(`Backend deployed`);
});

app.use(`/api`, require(`./Routes`));

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
