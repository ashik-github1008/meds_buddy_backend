const express = require("express");
const router = express.Router();
const {
  addMedication,
  markAsTaken,
  getMedications,
} = require("../controllers/medicationController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, addMedication);
router.post("/taken/:id", auth, markAsTaken);
router.get("/", auth, getMedications);

module.exports = router;
