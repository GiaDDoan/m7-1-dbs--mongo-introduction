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
  const start = parseInt(req.query.start) || 0;
  let limit = parseInt(req.query.limit) || 25;

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
  client.close();
};

const deleteGreeting = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db("exercise_1");
    const _id = req.params._id;
    console.log(_id, "id");

    await db.collection("greetings").deleteOne({ _id });
    const result = await db.collection("greetings").find().toArray();

    res.status(204).json({ status: 204, data: result });
  } catch (err) {
    res.status(405).json({ status: 405, data: "Not found" });
  }
};

// class NotFoundError Extends  error
class ClientError extends Error {
  constructor(name, status, message) {
    super(message);
    this.message = message;
    this.status = status;
    this.name = name;
  }
}

const updateGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");
  let newValues;
  const _id = req.params._id;
  const query = { _id };
  if (
    Object.keys(req.body).length === 1 &&
    Object.keys(req.body)[0].toLowerCase() === "hello"
  ) {
    newValues = { $set: { ...req.body } };

    const updatedGreeting = await db
      .collection("greetings")
      .updateOne(query, newValues);

    try {
      assert.strictEqual(
        1,
        updatedGreeting.matchedCount,
        new ClientError("DocumentNotFound", 404, "Document not found")
      );
      assert.strictEqual(
        1,
        updatedGreeting.modifiedCount,
        new ClientError("ModificationError", 409, "Same modification value")
      );
    } catch (err) {
      return res
        .status(err.status)
        .json({ status: err.status, message: err.message });
    } finally {
      client.close();
    }
    res.status(200).json({ status: 200, query, data: updatedGreeting });
  } else {
    res.status(404).json({ status: 404, data: `${req.body} not found` });
  }
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetingWithFind,
  deleteGreeting,
  updateGreeting,
};
