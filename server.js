const express = require("express");
const mysql = require("mysql");

const app = express();
const PORT = process.env.PORT || 3600;

// MySQL Connection Configuration
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "harshita@23",
  database: "VOTOIn",
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
  const registrationType = req.body.registrationType;

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

  const query =
    "INSERT INTO voter (F_name, L_name, password, email, mobile, address, city, country, adhaar, voterid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  connection.query(
    query,
    [
      voterData.F_name,
      voterData.L_name,
      voterData.password,
      voterData.email,
      voterData.mobile,
      voterData.address,
      voterData.city,
      voterData.country,
      voterData.adhaar,
      voterData.voterid,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into voter table:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      console.log("Data inserted into voter table successfully");
      // Redirect to the registration successful page
      res.redirect("/submit-form?role=voter");
    }
  );
}

// Handle candidate registration
function handleCandidateRegistration(req, res) {
  const candidateData = req.body;

  const query =
    "INSERT INTO candidate (F_name, L_name, password, email, mobile, address, city, country, adhaar, voterid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  connection.query(
    query,
    [
      candidateData.F_name,
      candidateData.L_name,
      candidateData.password,
      candidateData.email,
      candidateData.mobile,
      candidateData.address,
      candidateData.city,
      candidateData.country,
      candidateData.adhaar,
      candidateData.voterid,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into candidate table:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      console.log("Data inserted into candidate table successfully");
      // Redirect to the registration successful page
      res.redirect("/submit-form?role=candidate");
    }
  );
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
