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

const getGreeting = async (req, res) => {
  const _id = req.params._id;
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();

  const db = client.db("exercise_1");
  db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not found" });
    client.close();
  });
};

const getGreetingWithFind = async (req, res) => {
  let start = 0;
  let limit = 25;

  if (req.query.start) {
    start = parseInt(req.query.start);
  }
  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  }

  const client = await MongoClient(MONGO_URI, options);
  await client.connect();

  const db = client.db("exercise_1");
  const result = await db.collection("greetings").find().toArray();

  if (start + limit > result.length) {
    limit = result.length - start;
  }

  if (result) {
    res.status(200).json({
      status: 200,
      start,
      limit,
      data: result.slice(start, start + limit),
    });
  } else {
    res.status(404).json({ status: 404, data: "Not found" });
  }
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetingWithFind,
};
