const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// allow cross-origin requests
app.use(cors());

//connect to mongodb
mongoose.connect("mongodb://localhost/graphqldb");
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB database...");
});

// middleware to handover requests with graphql endpoint to graphqlHTTP
app.use(
  "/graphql",
  graphqlHTTP({
    // this function needs a schema to describe how data in our graph will look
    // schema: schema is equivalent to the beloq since we have same name
    schema,
    // this enables the graphiql mode for url starting with /graphql
    graphiql: true
  })
);

// listen to port
app.listen(4000, () => {
  console.log("Listening on port 4000...");
});
