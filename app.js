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

app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;

  const getRequiredState = `
  select state_id as stateId, state_name as stateName, population 
  from state 
  where state_id = ${stateId};`;

  const requiredState = await database.get(getRequiredState);
  response.send(requiredState);
});

app.post("/districts/", async (request, response) => {
  const districtDetails = request.body;
  const {
    districtName,
    stateId,
    cases,
    cured,
    active,
    deaths,
  } = districtDetails;

  const postDetails = `
  insert into district (district_name, state_id,
  cases, cured, active, deaths)
  values (${districtName},
  ${stateId},
  ${cases},
  ${cured},
  ${active},
  ${deaths});`;
  const postResponse = await database.run(postDetails);
  response.send("District Successfully Added");
});
