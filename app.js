const express = require("express");
const mysql = require("mysql");

const app = express();

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "challenge",
  port: 6603,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

app.get("/users", (req, res) => {
  connection.query("SELECT * FROM user", (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Error fetching data" });
      return;
    }
    res.json(results);
  });
});

// [1]- All messages in any conversation sent by the user with user ID 4

app.get("/messages-by-user/:userId", (req, res) => {
  const userId = req.params.userId;
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid userId" });
    return;
  }
  connection.query(
    "SELECT * FROM message WHERE userId = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Error fetching data" });
        return;
      }
      res.json(results);
    }
  );
});

// [2]- All messages in conversation where users 1 and 3 are participating (other users could also be participating)

app.get("/messages-by-participants", (req, res) => {
  const participants = req.query.participants
    .split(",")
    .map((participant) => parseInt(participant.trim()));

  if (participants.some(isNaN)) {
    res.status(400).json({ error: "Invalid participant IDs" });
    return;
  }
  connection.query(
    `
        SELECT *
        FROM message
        WHERE conversationId IN (
            SELECT conversationId
            FROM conversation
            WHERE userId IN (?)
            GROUP BY conversationId
        )`,
    [participants],
    (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Error fetching data" });
        return;
      }
      res.json(results);
    }
  );
});

// [3]- All messages in any conversation where the message contents include the word "cake"

app.get("/messages/search", (req, res) => {
  const searchWord = req.query.word;
  if (!searchWord) {
    res.status(400).json({ error: "Search word is required" });
    return;
  }
  connection.query(
    "SELECT * FROM message WHERE txt LIKE ?",
    [`%${searchWord}%`],
    (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Error fetching data" });
        return;
      }
      res.json(results);
    }
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
