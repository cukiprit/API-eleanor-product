import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const verifyToken = (req, res, next) => {
  const bearerheader = req.headers["authorization"];

  if (!bearerheader) {
    return res.status(403).json({ error: "No token provided" });
  }

  const parts = bearerheader.split(" ");

  if (!parts.length === 2) {
    return res.status(401).json({ error: "Token error" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Token malformatted" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    }

    req.userId = decoded.id;
    next();
  });
};

export default verifyToken;
