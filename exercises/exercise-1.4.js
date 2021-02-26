const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");

  const USER = req.body;
  await db.collection("users").insertOne({ name: USER.name });

  if (USER) {
    res.status(201).json({
      status: 201,
      data: USER,
    });
  } else {
    res.status(404).json({
      status: 404,
      message: "Error in addUser",
    });
  }

  client.close();
};

module.exports = {
  addUser,
};
