const db = require("../db/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = "medication_secret"; // In production, use env var

exports.register = (req, res) => {
  const { email, password, role } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
    [email, hashedPassword, role],
    function (err) {
      if (err) return res.status(400).json({ error: "User already exists" });
      res.status(201).json({ id: this.lastID, email, role });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user) return res.status(401).json({ error: "Invalid email" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, role: user.role });
  });
};
