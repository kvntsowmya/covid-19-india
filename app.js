const express = require("express");
const app = express();
app.use(express.json());

const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const pathLoc = path.join(__dirname, "covid19India.db");
let database = null;

const InitializeDBAndServer =async () => {
  try {
    database =await open({
      filename: pathLoc,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at https://localhost:3000/");
    });
  } catch (error) {
    console.log(`error occured: ${error.message}`);
  }
};

InitializeDBAndServer();

app.get("/states/", async (request, response) => {
  const getAllStatesQuery = `
    select * from state`;

  const databaseResponse = await database.all(getAllStatesQuery);
  response.send(databaseResponse);
});
