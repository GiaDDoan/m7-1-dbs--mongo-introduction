const { MongoClient, Db } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db(req.baseUrl);

  const data = await db.collection("users").find().toArray();
  const users = await data;
  console.log(users, "USERS");

  if (users) {
    res.status(200).json({
      status: 200,
      data: users,
    });
  } else {
    res.status(404).json({
      status: 404,
      message: "No users found",
    });
  }

  client.close();
};

module.exports = {
  getUsers,
};
