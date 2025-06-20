const db = require("../db/database");

exports.addMedication = (req, res) => {
  const { name, dosage, frequency } = req.body;
  const userId = req.user.id;

  db.run(
    `INSERT INTO medications (user_id, name, dosage, frequency, taken_dates) VALUES (?, ?, ?, ?, ?)`,
    [userId, name, dosage, frequency, JSON.stringify([])],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, dosage, frequency });
    }
  );
};

exports.markAsTaken = (req, res) => {
  const medId = req.params.id;
  const date = new Date().toISOString().split("T")[0];

  db.get(`SELECT taken_dates FROM medications WHERE id = ?`, [medId], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "Medication not found" });

    let dates = JSON.parse(row.taken_dates);
    if (!dates.includes(date)) dates.push(date);

    db.run(
      `UPDATE medications SET taken_dates = ? WHERE id = ?`,
      [JSON.stringify(dates), medId],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Marked as taken", taken_dates: dates });
      }
    );
  });
};

exports.getMedications = (req, res) => {
  const userId = req.user.id;

  db.all(`SELECT * FROM medications WHERE user_id = ?`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
