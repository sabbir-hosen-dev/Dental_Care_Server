const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const PORT = 5003;
const app = express();

app.use(cors());
app.use(express.static("Doctors"));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    console.log("Mongodb connected");

    const Database = client.db(process.env.DB_NAME);
    const infoCollection = Database.collection(process.env.INFO_COLLECTION);
    const appomentCollection = Database.collection(
      process.env.APPOMENT_COLLECTION
    );
    const usersCollection = Database.collection(process.env.USERS_COLLECTION);
    const doctorsCollection = Database.collection(
      process.env.DOCTORS_COLLECTION
    );

    // userRool check
    app.get("/userRoll", async (req, res) => {
      try {
        const email = req.query.email;
        const data = await doctorsCollection.find({ email: email }).toArray();
        res.status(200).send(data)
      } catch (error) {
        res.status(400).send(error.message);
      }
    });

    // delete a doctor
    app.delete("/deleteDoctor", async (req, res) => {
      try {
        const email = req.query.email;
        console.log(email);
        const result = await doctorsCollection.deleteOne({ email: email });
        res.status(200).send(result);
      } catch (error) {
        console.log(error);
        res.status(400).send("Doctor not find database");
      }
    });

    //get all Doctord
    app.get("/getAllDoctors", async (req, res) => {
      try {
        const data = await doctorsCollection.find({}).toArray();
        res.status(200).send(data);
      } catch (err) {
        res.status(400).send(err.message);
        console.log(err);
        res.status(400).send(err.message);
      }
    });

    // app a doctor
    app.post("/addadoctor", async (req, res) => {
      const file = req.files.myFile;
      const { name, email, speciality } = req.body;

      file.mv(`${__dirname}/Doctors/${file.name}`, (err) => {
        if (err) {
          res.status(400).send(err.toString());
        }
        doctorsCollection.insertOne({
          name,
          email,
          speciality,
          img: file.name,
        });
        res.send({ name: file.name, send: true });
      });
    });
    //delete User
    app.delete("/deleteUser", async (req, res) => {
      try {
        const id = req.query;
        const data = await usersCollection.deleteOne({
          _id: new ObjectId(id.id),
        });
        tes.send(data);
      } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
      }
    });

    // get users
    app.get("/getAllUsers", async (req, res) => {
      try {
        const users = await usersCollection.find({}).toArray();
        res.send(users);
      } catch (error) {
        console.log(err);
        res.status(400).send(error.message);
      }
    });

    // post users
    app.post("/addUser", async (req, res) => {
      try {
        const user = req.body;
        console.log(req.body)
        const existingUser = await usersCollection.findOne({
          email: user.email,
        }).toArray();

        if (existingUser) {
          return res.status(200).json({ message: "User already exists" });
        }
        const result = await usersCollection.insertOne(user);
        res.send(data);
        res.status(201).json(result);
      } catch (error) {
        res.status(400).send(error.message);
      }
    });

    // get appoment
    app.get("/getAppoment", async (req, res) => {
      try {
        const dateString = req.query.date;

        const date = new Date(dateString);
    
        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = date.toLocaleDateString("en-US", options);
    
        const data = await appomentCollection.find({ date:formattedDate}).toArray();
        res.send(data);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    //appoment data post
    app.post("/addAppoment", async (req, res) => {
      try {
        const data = req.body;
        const postData = await appomentCollection.insertOne(data);
        res.send(postData);
      } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
      }
    });

    // get all info Data
    app.get("/getInfoData", async (req, res) => {
      try {
        const data = await infoCollection.find({}).toArray();
        res.send(data);
      } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
      }
    });

    // add information data
    app.get("/addInfoData", async (req, res) => {
      try {
        const data = req.body;
        const infoData = await infoCollection.insertOne({ data });
        res.send(infoData);
      } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
      }
    });

    // get Data Home Route
    app.get("/", async (req, res) => {
      try {
        res.send("Server Is Running Ok");
      } catch (err) {
        console.log(err);
        res.status(400).send(error.message);
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process with an error code
  }
}
run().catch(console.dir);
