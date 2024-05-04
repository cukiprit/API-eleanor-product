import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "2h" });
};

export default generateToken;
