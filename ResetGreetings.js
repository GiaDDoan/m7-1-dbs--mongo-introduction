const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const ResetGreetings = async () => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db("exercise_1");
    await db.collection("greetings").deleteMany({});
    console.log("REMOVED");
    client.close();
  } catch (err) {
    console.log(err.stack);
  }
};

ResetGreetings();
