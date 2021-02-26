const assert = require("assert");
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db("exercise_1");
    const result = await db.collection("greetings").insertOne(req.body);
    console.log(req.body, "BODY");

    assert.strictEqual(1, result.insertedCount);

    res.status(200).json({ status: 201, data: req.body });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
};

module.exports = {
  createGreeting,
};
