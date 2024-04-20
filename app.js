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

// // [2]- All messages in conversation where users 1 and 3 are participating (other users could also be participating)

// app.get("/messages-by-users/:userId1/:userId2", (req, res) => {
//   const userId1 = req.params.userId1;
//   const userId2 = req.params.userId2;

//   if (isNaN(userId1) || isNaN(userId2)) {
//     res.status(400).json({ error: "Invalid userId" });
//     return;
//   }

//   connection.query(
//     `
//     SELECT m.id, m.userId, m.conversationId, m.txt
//     FROM message m
//     INNER JOIN conversation c ON m.conversationId = c.id
//     WHERE EXISTS (
//         SELECT 1 FROM conversation c1
//         WHERE c1.id = c.id AND c1.userId = ?
//     )
//     AND EXISTS (
//         SELECT 1 FROM conversation c2
//         WHERE c2.id = c.id AND c2.userId = ?
//     );
//     `,
//     [userId1, userId2],
//     (err, results) => {
//       if (err) {
//         console.error("Error fetching data:", err);
//         res.status(500).json({ error: "Error fetching data" });
//         return;
//       }
//       res.json(results);
//     }
//   );
// });

app.get("/messages-by-users/:userId1/:userId2", (req, res) => {
  const userId1 = req.params.userId1;
  const userId2 = req.params.userId2;

  if (isNaN(userId1) || isNaN(userId2)) {
    res.status(400).json({ error: "Invalid userId" });
    return;
  }

  connection.query(
    `
    SELECT * FROM message
    WHERE conversationId IN (
        SELECT DISTINCT conversationId
        FROM message
        WHERE userId = ? OR userId = ?
    );
    `,
    [userId1, userId2],
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
