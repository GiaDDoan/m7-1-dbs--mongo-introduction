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
    const db = client.db(req.baseUrl);

    console.log(req.body, "BODY");

    res.status(200).json("ok");
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
};

module.exports = {
  createGreeting,
};
