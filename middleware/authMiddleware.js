const jwt = require("jsonwebtoken");
const SECRET = "medication_secret";

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
