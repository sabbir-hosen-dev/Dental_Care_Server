const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const PORT = 5003;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Mongodb connect");

    const infoCollection = client
      .db(process.env.DB_NAME)
      .collection(process.env.INFO_COLLECTION);


    // get all info Data 
    app.get("/getInfoData", async (req,res) => {
      try {
        const data = await infoCollection.find({}).toArray();
        res.send(data)
      } catch (error) {
        
      }
    })

    // add information data
    app.get("/addIfoData", async (req, res) => {
      try {
        const data = req.body;
        const infoData = await infoCollection.insertOne({data});
        res.send(infoData);
      } catch (error) {
        console.log(error);
      }
    });


    // get Data Home Route
    app.get("/", async (req, res) => {
      try {
        res.send("Server Is Running Ok");
      } catch (err) {
        console.log(err);
      }
    });

    app.listen(PORT, () => {
      console.log(`server run at http://localhost/${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
  }
}
run().catch(console.dir);
