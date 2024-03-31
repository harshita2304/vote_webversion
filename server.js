const express = require("express");
const mysql = require("mysql");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Route handler for serving signup.html
app.get("/signup", (req, res) => {
  console.log("Received request for /signup");
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

// MySQL Connection Configuration
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "123456",
  database: "votingdb",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Handle form submission
app.post("/submit-form", (req, res) => {
  const registrationData = req.body;

  // Determine the registration type based on the received data
  const registrationType = req.body.type;

  if (registrationType === "voter") {
    handleVoterRegistration(req, res);
  } else if (registrationType === "candidate") {
    handleCandidateRegistration(req, res);
  } else {
    res.status(400).send("Invalid registration type");
  }
});

// Handle voter registration
function handleVoterRegistration(req, res) {
  const voterData = req.body;

  // Insert voter data into the database
  const query = "INSERT INTO voter SET ?";

  connection.query(query, voterData, (err, result) => {
    if (err) {
      console.error("Error inserting data into voter table:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    console.log("Data inserted into voter table successfully");
    res.redirect("/registration-successful?type=voter");
  });
}

// Handle candidate registration
function handleCandidateRegistration(req, res) {
  const candidateData = req.body;

  // Insert candidate data into the database
  const query = "INSERT INTO candidate SET ?";

  connection.query(query, candidateData, (err, result) => {
    if (err) {
      console.error("Error inserting data into candidate table:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    console.log("Data inserted into candidate table successfully");
    res.redirect("/registration-successful?type=candidate");
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
